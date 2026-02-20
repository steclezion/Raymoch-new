<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Mail\OtpCodeMail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Artisan;

class SignupController extends Controller
{
    public function __construct()
    {
        // Public pages can be guest-only if you want:
        // $this->middleware('guest')->only(['index', 'createBasic', 'createBusiness', 'createInvestor']);
    }

    /**
     * GET /signup
     * Renders the React SignUp page (the grid you converted to React).
     * Blade only mounts React and passes routes via window.ROUTES.
     */
    public function index()
    {
        return view('pages.auth.signup.signup'); // resources/views/pages/auth/signup.blade.php
    }

    public function indexx()
    {
        return view('pages.auth.signup.signup'); // resources/views/pages/auth/signup.blade.php
    }

    /**
     * GET /signup/basic/create
     * Show a Basic (Individual) account creation page/form.
     */
    public function createBasic()
    {
        return view('pages.auth.signup.signup-basic'); // create this blade below
    }

    public function createBusiness()
    {
        return view('pages.auth.signup.signup-business'); // create this blade below
    }
    /**
     * GET /signup/business/create
     * Show a Business account creation page/form.
     */

    /**
     * GET /signup/investor/create
     * Show an Investor account creation page/form.
     */
    public function createInvestor()
    {
        return view('pages.auth.signup.signup-investor'); // create this blade below
    }

    /**
     * (Optional) POST handlers if you want to actually persist users/companies.
     * Add matching routes if/when you need them:
     *
     * Route::post('/signup/basic', [SignupController::class, 'storeBasic'])->name('signup.basic.store');
     * Route::post('/signup/business', [SignupController::class, 'storeBusiness'])->name('signup.business.store');
     * Route::post('/signup/investor', [SignupController::class, 'storeInvestor'])->name('signup.investor.store');
     */

    public function storeBasic(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:191'],
            'email'    => ['required', 'email', 'max:191', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        // Example: create a user (adjust to your actual User model/logic)
        // $user = \App\Models\User::create([
        //     'name' => $data['name'],
        //     'email' => $data['email'],
        //     'password' => bcrypt($data['password']),
        //     'role' => 'individual',
        // ]);

        // auth()->login($user);
        // return redirect()->route('dashboard');

        return back()->with('status', 'Basic user created (demo). Hook up persistence!');
    }

    public function storeBusiness(Request $request)
    {
        $data = $request->validate([
            'company_name' => ['required', 'string', 'max:191'],
            'email'        => ['required', 'email', 'max:191', 'unique:users,email'],
            'password'     => ['required', 'string', 'min:6', 'confirmed'],
            // add more business fields (industry, country, docs, etc.)
        ]);

        // TODO: create company + admin user, etc.
        return back()->with('status', 'Business account created (demo).');
    }

    public function storeInvestor(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:191'],
            'email'    => ['required', 'email', 'max:191', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            // e.g. fund size, thesis, geo, etc.
        ]);

        // TODO: create investor profile + user
        return back()->with('status', 'Investor account created (demo).');
    }


    public function showPaymentPlansCreate(Request $request)
    {
        // Retrieve query string: ?plan=basic
        $plan = $request->query('plan', 'basic'); // default 'basic' if missing
        // dd($plan);
        // Pass to the Blade or React view
        //  return view('pages.auth.signup.basic.create', compact('plan'));

        if ($request->query('plan', 'basic') == 'basic') {
            // returns the Blade that mounts the React page
            return view('pages.auth.signup.basic.create', compact('plan'));
        } else if ($request->query('plan', 'premium') == 'premium') {
            // returns the Blade that mounts the React page
            $plan = $request->query('plan', 'basic'); // default 'basic' if missing

            return view('pages.auth.signup.premium.create', compact('plan'));
        }
    }

    public function individualAccountStore(Request $request)
    {
        // API endpoint that the React page posts to
        $data = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'email'        => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')],
            'display_name' => ['required', 'string', 'max:80'],
            'password'     => ['required', 'string', 'min:6'],
            'consent'      => ['required', 'boolean'],
            'plan'         => ['nullable', 'string'],
        ]);

        // create user
        $user = User::create([
            'name'         => $data['name'],
            'email'        => $data['email'],
            'display_name' => $data['display_name'],
            'password'     => Hash::make($data['password']),
        ]);

        // log them in
        Auth::login($user);

        return response()->json([
            'ok'       => true,
            'user_id'  => $user->id,
            'redirect' => url('/dashboard'),
        ]);
    }

    // ... your existing methods (index, createBasic, etc.) ...

    /**
     * Step 1: validate payload, generate OTP, email it, stash payload + OTP in session.
     */


    // POST /signup/basic/send-otp
    public function sendOtp(Request $request)
    {
        $data = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['required', 'email', 'max:255', 'unique:users,email'],
            'display_name'   => ['required', 'string', 'max:80'],
            'password'       => $this->strongPasswordRule(),
            'confirm_password' => ['required', 'same:password'],
            'phone'          => ['required', 'string', 'max:40'],
            'company_name'   => ['required', 'string', 'max:191'],
            'consent'        => ['required', 'boolean'],
            'plan'           => ['nullable', 'string'],
        ]);

        // 6-digit OTP
        $code = random_int(100000, 999999);
        $key  = 'signup:otp:' . sha1($data['email']);


        // store form payload and OTP for 5 minutes
        Cache::put($key, [
            'payload' => $data,
            'code'    => (string)$code,
            'expires' => now()->addMinutes(5),
        ], now()->addMinutes(5));

        // send via mail (use your Mailable if you prefer)
        // Mail::raw("Your Raymoch verification code is: {$code}. It expires in 5 minutes.", function ($m) use ($data) {
        //     $m->to($data['email'])->subject('Your Raymoch verification code');
        // });

        // store form payload and OTP for 5 minutes
        Cache::put($key, [
            'payload' => $data,
            'code'    => (string)$code,
            'expires' => now()->addMinutes(5),
        ], now()->addMinutes(5));

        // ✅ send via designed HTML email
        Mail::to($data['email'])->send(new \App\Mail\RaymochOtpMail((string)$code, 5));




        return response()->json([
            'ok' => true,
            'expires' => Carbon::now()->addMinutes(5)->toIso8601String(),
        ]);
    }

    // POST /signup/basic/verify-otp
    public function verifyOtp(Request $request)
    {
        $request->validate(['code' => ['required', 'digits:6']]);

        // we sent OTP tied to email, read back by code: find matching cache
        // for simplicity, require client to also send email (recommended)
        $email = $request->input('email'); // if you decide to send it
        // if not sending email back, iterate through cache is messy; best to send email
        if (!$email) {
            return response()->json(['ok' => false, 'message' => 'Email missing'], 422);
        }

        $key = 'signup:otp:' . sha1($email);
        $cached = Cache::get($key);
        if (!$cached || $cached['code'] !== $request->code || now()->greaterThan($cached['expires'])) {
            return response()->json(['ok' => false, 'message' => 'Invalid or expired code'], 422);
        }

        $data = $cached['payload'];

        // decide account type & trial window
        $isCompany = $this->isCompanyEmail($data['email']);
        $trialDays = $isCompany ? 10 : 5;

        $user = User::create([
            'name'          => $data['name'],
            'email'         => $data['email'],
            'display_name'  => $data['display_name'],
            'phone'         => $data['phone'],
            'company_name'  => $data['company_name'],
            'type_of_account' => 'basic',               // $0 basic
            'password'      => Hash::make($data['password']),
            'trial_ends_at' => now()->addDays($trialDays),
            'is_active'     => true,
        ]);

        Auth::login($user);
        Cache::forget($key);

        // Immediately queue a “welcome/trial info” notification (defined below)
        $user->notify(new \App\Notifications\TrialWelcomeNotification($trialDays));

        return response()->json([
            'ok'       => true,
            'redirect' => url('/'),
        ]);
    }


    // app/Http/Controllers/SignupController.php
    private function isCompanyEmail(string $email): bool
    {
        $domain = strtolower(substr(strrchr($email, '@'), 1) ?: '');
        if (!$domain) return false;

        $free = [
            'gmail.com',
            'yahoo.com',
            'outlook.com',
            'hotmail.com',
            'live.com',
            'msn.com',
            'icloud.com',
            'me.com',
            'mac.com',
            'aol.com',
            'proton.me',
            'protonmail.com',
            'zoho.com',
            'gmx.com',
            'yandex.com',
            'mail.com',
            'pm.me'
        ];
        return !in_array($domain, $free, true);
    }

    private function strongPasswordRule(): array
    {
        return [
            'required',
            'string',
            'min:9',
            'regex:/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{9,}$/',
        ];
    }


    public function sendDeactivationRemindersNow()
    {
        Artisan::call('accounts:check-expiring');
        return back()->with('status', 'Reminders dispatched.');
    }
}
