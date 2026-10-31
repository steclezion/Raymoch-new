<?php

namespace App\Http\Controllers;

use App\Mail\TrialCouponMail;
use App\Models\TrialRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

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

        $data['business_email'] = Str::lower(trim($data['business_email']));
        $data['phone'] = isset($data['phone']) ? trim($data['phone']) : null;

        $duplicateErrors = $this->duplicateContactErrors(
            $data['business_email'],
            $data['phone']
        );

        if ($duplicateErrors !== []) {
            throw ValidationException::withMessages($duplicateErrors);
        }

        $trial = new TrialRequest();
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

        // Send a branded, actionable security notification.
        try {
            Mail::to($trial->business_email)->send(new TrialCouponMail(
                firstName: $trial->first_name,
                email: $trial->business_email,
                coupon: $coupon,
                verificationUrl: route('trial.verify.page', ['email' => $trial->business_email]),
            ));
        } catch (\Throwable $exception) {
            Log::error('Unable to send trial verification email.', [
                'trial_request_id' => $trial->id,
                'exception' => $exception->getMessage(),
            ]);
            $trial->delete();

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

    public function verifyCoupon(Request $request)
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

        $trialEndsAt = now()->addDays(3);

        $verifiedTrial = DB::transaction(function () use ($trial, $trialEndsAt) {
            $lockedTrial = TrialRequest::whereKey($trial->id)->lockForUpdate()->firstOrFail();
            if ($lockedTrial->verified_at) abort(422, 'This coupon has already been used.');

            $lockedTrial->forceFill([
                'verified_at' => now(),
                'code_expires_at' => null,
                'trial_ends_at' => $trialEndsAt,
                'status' => 'verified',
            ])->save();

            return $lockedTrial;
        });

        $request->session()->regenerate();
        $request->session()->put('trial_access_id', $verifiedTrial->id);

        return response()->json([
            'ok' => true,
            'message' => 'Coupon verified. Your three-day trial is ready.',
            'redirect' => url('/explore'),
        ]);
    }


    public function checkExisting(Request $request)
    {
        $data = $request->validate([
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
        ]);

        $email = !empty($data['email']) ? Str::lower(trim($data['email'])) : null;
        $phone = !empty($data['phone']) ? trim($data['phone']) : null;
        $errors = $this->duplicateContactErrors($email, $phone);

        if ($errors !== []) {
            return response()->json([
                'exists'  => true,
                'message' => collect($errors)->flatten()->first(),
                'errors' => $errors,
            ], 200);
        }

        return response()->json([
            'exists'  => false,
            'message' => 'No existing request found.',
        ], 200);
    }

    /**
     * Check both trial requests and registered users for contact details that
     * must remain unique during trial signup.
     *
     * @return array<string, array<int, string>>
     */
    private function duplicateContactErrors(?string $email, ?string $phone): array
    {
        $errors = [];

        if ($email !== null && $email !== '') {
            $emailExists = TrialRequest::whereRaw('LOWER(business_email) = ?', [$email])->exists()
                || User::whereRaw('LOWER(email) = ?', [$email])->exists();

            if ($emailExists) {
                $errors['business_email'] = ['This email is already registered.'];
            }
        }

        if ($phone !== null && $phone !== '') {
            $phoneExists = TrialRequest::where('phone', $phone)->exists()
                || User::where('phone', $phone)->exists();

            if ($phoneExists) {
                $errors['phone'] = ['This phone number is already registered.'];
            }
        }

        return $errors;
    }
}
