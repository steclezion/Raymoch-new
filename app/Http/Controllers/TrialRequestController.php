<?php

namespace App\Http\Controllers;

use App\Models\TrialRequest;
use App\Models\User;
use App\Services\Auth\LoginActivityService;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class TrialRequestController extends Controller
{
    //

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name'     => ['required', 'string', 'max:100'],
            'last_name'      => ['required', 'string', 'max:100'],
            'business_email' => ['required', 'email', 'max:255'],
            'phone'          => ['nullable', 'string', 'max:40'],
            'company'        => ['nullable', 'string', 'max:255'],
            'agree_privacy'  => ['accepted'],
        ]);

        // Reuse an unfinished request so a user can request a fresh coupon after
        // an expired or undelivered email without creating duplicate rows.
        $trial = TrialRequest::where('business_email', $data['business_email'])
            ->whereNull('verified_at')
            ->latest('id')
            ->first();
        $wasCreated = !$trial;
        $trial ??= new TrialRequest();
        $trial->fill([
            'first_name'     => $data['first_name'],
            'last_name'      => $data['last_name'],
            'business_email' => $data['business_email'],
            'phone'          => $data['phone'] ?? null,
            'company'        => $data['company'] ?? null,
            'agree_privacy'  => $data['agree_privacy'],
            'ip'             => $request->ip(),
            'user_agent'     => mb_substr((string) $request->userAgent(), 0, 255),
        ]);

        // Store only a one-way hash. The readable coupon exists only in the email.
        $coupon = (string) random_int(100000, 999999);
        $trial->coupon = Hash::make($coupon);
        $trial->verification_code = null;
        $trial->code_expires_at   = Carbon::now()->addMinutes(15);
        $trial->verified_at = null;
        $trial->status = 'pending';
        $trial->save();

        // Send email (simple)
        try {
            Mail::raw(
                "Your Raymoch trial coupon is: {$coupon}\n\nEnter this six-digit coupon on the verification page. It expires in 15 minutes and can be used once.",
                function ($message) use ($trial) {
                    $message->to($trial->business_email)
                        ->subject('Your Raymoch trial coupon');
                }
            );
        } catch (\Throwable $exception) {
            Log::error('Unable to send trial verification email.', [
                'trial_request_id' => $trial->id,
                'exception' => $exception->getMessage(),
            ]);
            if ($wasCreated) {
                $trial->delete();
            } else {
                $trial->forceFill([
                    'coupon' => null,
                    'code_expires_at' => null,
                ])->save();
            }

            return response()->json([
                'ok' => false,
                'message' => 'We could not send the verification email. Please try again shortly.',
            ], 503);
        }

        return response()->json([
            'ok'       => true,
            'message'  => 'Request created and trial coupon sent.',
            'redirect' => route('trial.verify.page', ['email' => $trial->business_email]),
        ], 201);
    }

    public function verifyCoupon(Request $request, LoginActivityService $activity)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'coupon' => ['required', 'digits:6'],
        ]);

        $trial = TrialRequest::where('business_email', $data['email'])->latest('id')->first();

        if (!$trial) {
            return response()->json([
                'ok' => false,
                'message' => 'We could not find your request.',
            ], 404);
        }

        if (!$trial->coupon || !$trial->code_expires_at || $trial->verified_at) {
            return response()->json([
                'ok' => false,
                'message' => $trial->verified_at ? 'This coupon has already been used.' : 'No coupon has been generated yet.',
            ], 422);
        }

        if (Carbon::now()->greaterThan($trial->code_expires_at)) {
            return response()->json([
                'ok' => false,
                'message' => 'The coupon has expired. Please submit a new trial request.',
            ], 422);
        }

        if (!Hash::check($data['coupon'], $trial->coupon)) {
            return response()->json([
                'ok' => false,
                'message' => 'The coupon does not match our records.',
            ], 422);
        }

        $existingUser = User::where('email', $trial->business_email)->first();
        if ($existingUser) {
            return response()->json([
                'ok' => false,
                'existing_account' => true,
                'message' => 'An account already uses this email. Sign in with its existing security credentials.',
                'redirect' => route('login'),
            ], 409);
        }

        $user = DB::transaction(function () use ($trial) {
            $lockedTrial = TrialRequest::whereKey($trial->id)->lockForUpdate()->firstOrFail();
            if ($lockedTrial->verified_at) abort(422, 'This coupon has already been used.');

            $lockedTrial->forceFill([
                'verified_at' => now(),
                'code_expires_at' => null,
                'status' => 'verified',
            ])->save();

            return User::create([
                'name' => trim($lockedTrial->first_name.' '.$lockedTrial->last_name),
                'email' => $lockedTrial->business_email,
                'email_verified_at' => now(),
                'password' => Str::random(48),
                'phone' => $lockedTrial->phone,
                'company_name' => $lockedTrial->company,
                'type_of_account' => 'trial',
                'is_active' => true,
                'trial_ends_at' => now()->addDays(14),
            ]);
        });

        Auth::login($user);
        $request->session()->regenerate();
        $activity->start($request);

        // The coupon signs the user in now. This separate link lets them create
        // a private password for future sessions without exposing a temporary one.
        try {
            Password::sendResetLink(['email' => $user->email]);
        } catch (\Throwable $exception) {
            Log::warning('Trial user signed in, but password setup email failed.', [
                'user_id' => $user->id,
                'exception' => $exception->getMessage(),
            ]);
        }

        return response()->json([
            'ok' => true,
            'message' => 'Coupon verified. Your trial account is ready.',
            'redirect' => url('/home'),
        ]);
    }


    public function checkExisting(Request $request)
    {
        $data = $request->validate([
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
        ]);

        $exists = false;

        if (!empty($data['email'])) {
            $exists = TrialRequest::where('business_email', $data['email'])
                ->whereNotNull('verified_at')
                ->exists();
        }

        if (!$exists && !empty($data['phone'])) {
            $exists = TrialRequest::where('phone', $data['phone'])
                ->whereNotNull('verified_at')
                ->exists();
        }

        if ($exists) {
            return response()->json([
                'exists'  => true,
                'message' => 'This email already has an activated trial. Please sign in instead.',
            ], 200);
        }

        return response()->json([
            'exists'  => false,
            'message' => 'No existing request found.',
        ], 200);
    }
}
