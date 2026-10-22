<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\LoginLog;
use App\Models\User;
use App\Services\Auth\LoginActivityService;
use App\Services\Auth\TotpService;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    use AuthenticatesUsers;

    protected $redirectTo = '/home';

    public function __construct()
    {
        $this->middleware('guest')->except('logout');
        $this->middleware('auth')->only('logout');
    }

    public function showLogin()
    {
        return view('pages.auth.login');
    }

    public function loginJson(Request $request)
    {
        $this->ensureIsNotRateLimited($request);

        $validated = $request->validate([
            'user' => ['required', 'string', 'max:191'],
            'password' => ['required', 'string', 'min:6'],
            'remember' => ['sometimes', 'boolean'],
            'secure_sign_in' => ['sometimes', 'boolean'],
        ]);

        $login = trim($validated['user']);
        $credentialKey = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';

        $credentials = [
            $credentialKey => $login,
            'password' => $validated['password'],
        ];

        if (! Auth::validate($credentials)) {
            RateLimiter::hit($this->throttleKey($request));

            return response()->json([
                'ok' => false,
                'message' => 'Invalid credentials.',
            ], 422);
        }

        RateLimiter::clear($this->throttleKey($request));
        $user = User::where($credentialKey, $login)->firstOrFail();

        $mfaEnabled = (bool) ($user->two_factor_secret && $user->two_factor_confirmed_at);
        if ($mfaEnabled || (bool) ($validated['secure_sign_in'] ?? false)) {
            if (! $mfaEnabled) {
                return response()->json([
                    'ok' => false,
                    'code' => 'MFA_NOT_CONFIGURED',
                    'message' => 'Authenticator secure sign in is not configured for this account. Sign in normally, then open Authenticator setup from your security settings.',
                    'setup_url' => url('/security/authenticator'),
                ], 422);
            }

            $challenge = Str::random(64);
            $cacheKey = 'login:mfa:' . hash('sha256', $challenge);

            Cache::put($cacheKey, [
                'user_id' => $user->id,
                'remember' => (bool) ($validated['remember'] ?? false),
                'attempts' => 0,
            ], now()->addMinutes(5));
            $request->session()->put('login_mfa_challenge', hash('sha256', $challenge));

            return response()->json([
                'ok' => true,
                'requires_mfa' => true,
                'challenge' => $challenge,
                'message' => 'Enter the six-digit code from your authenticator app.',
            ], 202);
        }

        Auth::login($user, (bool) ($validated['remember'] ?? false));

        return $this->completeLogin($request, $user);
    }

    public function verifyMfa(Request $request, TotpService $totp)
    {
        $this->ensureMfaIsNotRateLimited($request);

        $validated = $request->validate([
            'challenge' => ['required', 'string', 'size:64'],
            'mfa_key' => ['required', 'digits:6'],
        ]);

        $challengeHash = hash('sha256', $validated['challenge']);
        if (! hash_equals((string) $request->session()->get('login_mfa_challenge'), $challengeHash)) {
            return response()->json(['ok' => false, 'message' => 'This authentication challenge is no longer valid.'], 422);
        }

        $cacheKey = 'login:mfa:' . $challengeHash;
        $pending = Cache::get($cacheKey);
        if (! is_array($pending)) {
            $request->session()->forget('login_mfa_challenge');
            return response()->json(['ok' => false, 'message' => 'The authentication key has expired. Please sign in again.'], 422);
        }

        $user = User::find($pending['user_id']);
        $step = $user?->two_factor_secret ? $totp->verify($user->two_factor_secret, $validated['mfa_key']) : null;
        $replayed = $step !== null && $user->two_factor_last_used_step !== null && $step <= $user->two_factor_last_used_step;

        if ($step === null || $replayed) {
            $pending['attempts'] = ((int) ($pending['attempts'] ?? 0)) + 1;
            if ($pending['attempts'] >= 5) {
                Cache::forget($cacheKey);
                $request->session()->forget('login_mfa_challenge');
            } else {
                Cache::put($cacheKey, $pending, now()->addMinutes(5));
            }
            RateLimiter::hit($this->mfaThrottleKey($request), 300);

            return response()->json(['ok' => false, 'message' => 'The authentication key is incorrect.'], 422);
        }

        if (! $user) {
            Cache::forget($cacheKey);
            $request->session()->forget('login_mfa_challenge');
            return response()->json(['ok' => false, 'message' => 'The account is no longer available.'], 422);
        }

        Cache::forget($cacheKey);
        RateLimiter::clear($this->mfaThrottleKey($request));
        $request->session()->forget('login_mfa_challenge');
        $user->forceFill(['two_factor_last_used_step' => $step])->save();
        Auth::login($user, (bool) ($pending['remember'] ?? false));

        return $this->completeLogin($request, $user);
    }

    private function completeLogin(Request $request, User $user)
    {
        $request->session()->regenerate();
        app(LoginActivityService::class)->start($request);

        // Critical: replace any deadline left by the pre-login session.
        $request->session()->put(
            'expires_at',
            now()->addMinutes((int) config('session.lifetime', 120))
        );

        $log = LoginLog::create([
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => (string) $request->userAgent(),
            'logged_in_at' => now(),
        ]);

        $request->session()->put('current_login_log_id', $log->id);

        return response()->json([
            'ok' => true,
            'authenticated' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'redirect' => url('/dashboard'),
        ]);
    }

    public function logout(Request $request)
    {
        if ($id = $request->session()->get('current_login_log_id')) {
            LoginLog::whereKey($id)->update(['logged_out_at' => now()]);
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    protected function ensureIsNotRateLimited(Request $request): void
    {
        $key = $this->throttleKey($request);

        if (! RateLimiter::tooManyAttempts($key, 5)) {
            return;
        }

        $seconds = RateLimiter::availableIn($key);

        throw ValidationException::withMessages([
            'user' => "Too many attempts. Try again in {$seconds} seconds.",
        ])->status(429);
    }

    protected function throttleKey(Request $request): string
    {
        return Str::lower((string) $request->input('user')) . '|' . $request->ip();
    }

    protected function ensureMfaIsNotRateLimited(Request $request): void
    {
        $key = $this->mfaThrottleKey($request);
        if (! RateLimiter::tooManyAttempts($key, 5)) return;

        $seconds = RateLimiter::availableIn($key);
        throw ValidationException::withMessages([
            'mfa_key' => "Too many authentication attempts. Try again in {$seconds} seconds.",
        ])->status(429);
    }

    protected function mfaThrottleKey(Request $request): string
    {
        return 'login-mfa|' . hash('sha256', (string) $request->input('challenge')) . '|' . $request->ip();
    }
}
