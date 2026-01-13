<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use App\Models\LoginLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
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
            'user'     => ['required', 'string', 'max:191'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        // Accept email or phone (adjust column names as needed)
        $credentialKey = filter_var($validated['user'], FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';

        // Try to find user quickly to avoid timing side-channels (optional)
        /** @var User|null $user */
        $user = User::where($credentialKey, $validated['user'])->first();

        if (! $user || ! Auth::attempt([$credentialKey => $validated['user'], 'password' => $validated['password']], false)) 
            {
            RateLimiter::hit($this->throttleKey($request));
            return response()->json([
                'ok' => false,
                'message' => 'Invalid credentials.',
            ], 422);
        }

        // Success: clear attempts, regenerate session (session fixation defense)
        RateLimiter::clear($this->throttleKey($request));
        $request->session()->regenerate();

        // Create login log row
        $log = LoginLog::create([
            'user_id'    => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => (string) $request->header('User-Agent'),
            'logged_in_at' => now(),
        ]);

        // Store current log id in session so we can fill logout time later
        session(['current_login_log_id' => $log->id]);

        return response()->json([
            'ok' => true,
            'redirect' => url('/dashboard'),
        ]);
    }

    public function logout(Request $request)
    {
        // Fill logout time for the last login log
        if ($id = session('current_login_log_id')) {
            LoginLog::where('id', $id)->update(['logged_out_at' => now()]);
            $request->session()->forget('current_login_log_id');
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
            'user' => "Too many attempts. Try again in {$seconds} seconds."
        ])->status(429);
    }

    protected function throttleKey(Request $request): string
    {
        return Str::lower((string)$request->input('user')) . '|' . $request->ip();
    }
}

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoginLog extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'login_logs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'logged_in_at',
        'logged_out_at',
    ];

    /**
     * Disable default timestamps if your table doesn't use created_at/updated_at.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Relationship to the user.
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }
}
