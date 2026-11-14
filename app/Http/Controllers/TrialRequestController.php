<?php

namespace App\Http\Controllers;

use App\Mail\TrialCouponMail;
use App\Mail\TrialVerificationMail;
use App\Models\CountryAll;
use App\Models\TrialRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class TrialRequestController extends Controller
{
    private const VERIFICATION_MINUTES = 15;

    private const TRIAL_DAYS = 1;

    public function create()
    {
        $countries = CountryAll::query()->whereNotNull('name')->whereNotNull('tele_code')
            ->where('tele_code', '!=', '')->orderBy('name')->get(['name', 'tele_code']);

        return view('pages.auth.trial', compact('countries'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'business_email' => ['required', 'email:rfc', 'max:255'],
            'country' => ['required', 'string', 'max:100', Rule::exists('countries_all', 'name')],
            'country_code' => ['required', 'string', 'max:10', Rule::exists('countries_all', 'tele_code')->where(fn ($query) => $query->where('name', $request->input('country')))],
            'phone' => ['nullable', 'string', 'max:40', 'regex:/^[0-9()\-\s+]+$/'],
            'company' => ['nullable', 'string', 'max:255'],
            'agree_privacy' => ['accepted'],
        ]);

        $email = Str::lower(trim($data['business_email']));
        $phone = $this->normalizePhone($data['phone'] ?? null, trim($data['country_code']));
        if (($errors = $this->duplicateContactErrors($email, $phone)) !== []) {
            throw ValidationException::withMessages($errors);
        }

        $code = (string) random_int(100000, 999999);
        $trial = TrialRequest::create([
            'first_name' => trim($data['first_name']), 'last_name' => trim($data['last_name']),
            'business_email' => $email, 'country' => $data['country'], 'country_code' => trim($data['country_code']),
            'phone' => $phone, 'company' => isset($data['company']) ? trim($data['company']) : null,
            'agree_privacy' => true, 'coupon' => null, 'verification_code' => Hash::make($code),
            'code_expires_at' => now()->addMinutes(self::VERIFICATION_MINUTES), 'verified_at' => null,
            'trial_ends_at' => null, 'status' => 'pending_verification', 'ip' => $request->ip(),
            'user_agent' => mb_substr((string) $request->userAgent(), 0, 255),
        ]);

        try {
            Mail::to($email)->send(new TrialVerificationMail($trial->first_name, $email, $code, route('trial.verify.page', ['email' => $email]), self::VERIFICATION_MINUTES));
        } catch (\Throwable $exception) {
            Log::error('Unable to send trial verification code.', ['trial_request_id' => $trial->id, 'exception' => $exception->getMessage()]);
            $trial->delete();

            return response()->json(['ok' => false, 'message' => 'We could not send the verification email. Please try again shortly.'], 503);
        }

        return response()->json(['ok' => true, 'message' => 'Verification code sent.', 'redirect' => route('trial.verify.page', ['email' => $email])], 201);
    }

    public function verifyCoupon(Request $request)
    {
        $data = $request->validate(['email' => ['required', 'email:rfc', 'max:255'], 'verification_code' => ['required', 'digits:6']]);
        $email = Str::lower(trim($data['email']));
        $trial = TrialRequest::whereRaw('LOWER(business_email) = ?', [$email])->latest('id')->first();

        if (! $trial || ! $trial->verification_code) {
            return response()->json(['ok' => false, 'message' => 'We could not find an active verification request.'], 404);
        }
        if ($trial->verified_at) {
            return response()->json(['ok' => false, 'message' => 'This verification code has already been used.'], 422);
        }
        if (! $trial->code_expires_at || $trial->code_expires_at->isPast()) {
            return response()->json(['ok' => false, 'message' => 'The verification code has expired. Submit a new trial request.'], 422);
        }
        if (! Hash::check($data['verification_code'], $trial->verification_code)) {
            return response()->json(['ok' => false, 'message' => 'The verification code does not match our records.'], 422);
        }
        if (User::whereRaw('LOWER(email) = ?', [$email])->exists()) {
            return response()->json(['ok' => false, 'existing_account' => true, 'message' => 'An account already uses this email.', 'redirect' => route('login')], 409);
        }

        $coupon = $this->generateCoupon();
        $trialEndsAt = now()->addDays(self::TRIAL_DAYS);

        try {
            $user = DB::transaction(function () use ($trial, $data, $coupon, $trialEndsAt) {
                $locked = TrialRequest::whereKey($trial->id)->lockForUpdate()->firstOrFail();
                if ($locked->verified_at || ! $locked->verification_code || ! Hash::check($data['verification_code'], $locked->verification_code)) {
                    throw ValidationException::withMessages(['verification_code' => 'This verification request is no longer valid.']);
                }
                $user = User::create([
                    'name' => trim($locked->first_name.' '.$locked->last_name), 'display_name' => $locked->first_name,
                    'email' => $locked->business_email, 'email_verified_at' => now(), 'password' => Hash::make(Str::random(64)),
                    'phone' => $locked->phone, 'company_name' => $locked->company, 'type_of_account' => 'trial',
                    'is_active' => true, 'trial_ends_at' => $trialEndsAt,
                ]);
                $locked->forceFill([
                    'users_trail_request_id' => $user->id, 'coupon' => Hash::make($coupon), 'verification_code' => null,
                    'verified_at' => now(), 'code_expires_at' => null, 'trial_ends_at' => $trialEndsAt, 'status' => 'verified',
                ])->save();
                Mail::to($locked->business_email)->send(new TrialCouponMail($locked->first_name, $locked->business_email, $coupon, route('trial.page').'#coupon-login', $trialEndsAt));

                return $user;
            });
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (\Throwable $exception) {
            Log::error('Unable to activate trial account.', ['trial_request_id' => $trial->id, 'exception' => $exception->getMessage()]);

            return response()->json(['ok' => false, 'message' => 'We could not activate the trial or send its coupon. Please try again.'], 503);
        }

        return response()->json(['ok' => true, 'message' => 'Email verified. Your 16-character coupon has been sent.', 'redirect' => route('trial.page').'#coupon-login', 'user_id' => $user->id]);
    }

    public function loginWithCoupon(Request $request)
    {
        $data = $request->validate(['email' => ['required', 'email:rfc', 'max:255'], 'coupon' => ['required', 'string', 'size:16']]);
        $record = DB::table('trial_user_coupon_view')->whereRaw('LOWER(email) = ?', [Str::lower(trim($data['email']))])->first();
        if (! $record || ! Hash::check($data['coupon'], $record->coupon_hash)) {
            return response()->json(['ok' => false, 'message' => 'The email or coupon is incorrect.'], 422);
        }
        if (! $record->trial_ends_at || now()->greaterThanOrEqualTo($record->trial_ends_at) || ! $record->is_active) {
            return response()->json(['ok' => false, 'message' => 'This trial has expired.'], 403);
        }
        if (! ($user = User::find($record->user_id))) {
            return response()->json(['ok' => false, 'message' => 'This trial account is no longer available.'], 404);
        }

        Auth::login($user, false);
        $request->session()->regenerate();
        $request->session()->put('expires_at', now()->addMinutes((int) config('session.lifetime', 120)));

        return response()->json(['ok' => true, 'message' => 'Coupon accepted. Signing you in…', 'redirect' => url('/dashboard')]);
    }

    public function checkExisting(Request $request)
    {
        $data = $request->validate(['email' => ['nullable', 'email:rfc', 'max:255'], 'country_code' => ['nullable', 'string', 'max:10'], 'phone' => ['nullable', 'string', 'max:40']]);
        $email = ! empty($data['email']) ? Str::lower(trim($data['email'])) : null;
        $errors = $this->duplicateContactErrors($email, $this->normalizePhone($data['phone'] ?? null, $data['country_code'] ?? null));

        return response()->json(['exists' => $errors !== [], 'message' => $errors === [] ? 'No existing request found.' : collect($errors)->flatten()->first(), 'errors' => $errors]);
    }

    private function duplicateContactErrors(?string $email, ?string $phone): array
    {
        $errors = [];
        if ($email && (TrialRequest::whereRaw('LOWER(business_email) = ?', [$email])->exists() || User::whereRaw('LOWER(email) = ?', [$email])->exists())) {
            $errors['business_email'] = ['This email is already registered.'];
        }
        if ($phone && (TrialRequest::where('phone', $phone)->exists() || User::where('phone', $phone)->exists())) {
            $errors['phone'] = ['This phone number is already registered.'];
        }

        return $errors;
    }

    private function normalizePhone(?string $phone, ?string $countryCode): ?string
    {
        $phone = trim((string) $phone);
        if ($phone === '') {
            return null;
        }
        $countryCode = trim((string) $countryCode);
        if ($countryCode === '' || str_starts_with(str_replace(' ', '', $phone), str_replace(' ', '', $countryCode))) {
            return $phone;
        }

        return trim($countryCode.' '.ltrim($phone, "+ \t\n\r\0\x0B"));
    }

    private function generateCoupon(): string
    {
        $groups = ['ABCDEFGHJKLMNPQRSTUVWXYZ', 'abcdefghijkmnopqrstuvwxyz', '23456789', '!@#$%^&*'];
        $characters = array_map(fn ($group) => $group[random_int(0, strlen($group) - 1)], $groups);
        $all = implode('', $groups);
        while (count($characters) < 16) {
            $characters[] = $all[random_int(0, strlen($all) - 1)];
        }
        for ($i = count($characters) - 1; $i > 0; $i--) {
            $j = random_int(0, $i);
            [$characters[$i], $characters[$j]] = [$characters[$j], $characters[$i]];
        }

        return implode('', $characters);
    }
}
