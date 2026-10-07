<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\LoginLog;
use App\Models\User;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        ]);

        $login = trim($validated['user']);
        $credentialKey = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';

        if (! Auth::attempt([
            $credentialKey => $login,
            'password' => $validated['password'],
        ], false)) {
            RateLimiter::hit($this->throttleKey($request));

            return response()->json([
                'ok' => false,
                'message' => 'Invalid credentials.',
            ], 422);
        }

        RateLimiter::clear($this->throttleKey($request));
        $request->session()->regenerate();

        // Critical: replace any deadline left by the pre-login session.
        $request->session()->put(
            'expires_at',
            now()->addMinutes((int) config('session.lifetime', 120))
        );

        $user = $request->user();
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
}
