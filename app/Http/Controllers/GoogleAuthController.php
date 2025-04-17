<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Notifications\WelcomeGoogleUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use App\Mail\GoogleVerifyMail;
use Laravel\Reverb\Protocols\Pusher\Http\Controllers\Controller;

class GoogleAuthController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        // Find or create the user
        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'password' => bcrypt('google_default_password')
            ]
        );

        // If the user is verified, log in and redirect to dashboard
        if ($user->is_verified) {
            Auth::login($user);
            session()->put('expires_at', now()->addMinutes(60));
            return redirect()->route('dashboard')->with('success', 'Welcome back!');
        }

        // Otherwise, send them a verification email
        $verificationUrl = URL::temporarySignedRoute(
            'verify.email.link',
            now()->addMinutes(60),
            ['user' => $user->id]
        );

        Mail::to($user->email)->send(new GoogleVerifyMail($user, $verificationUrl));

        return redirect()->route('login')->with('success', 'We sent you a verification email. Please check your inbox.');
    }

    public function verifyEmail(Request $request)
    {
        if (! $request->hasValidSignature()) {
            abort(403, 'Invalid or expired verification link.');
        }

        $user = User::findOrFail($request->input('user'));

        if (! $user->is_verified) {
            $user->is_verified = true;
            $user->save();
        }

        // Auto-login the user
        Auth::login($user);
        session()->put('expires_at', now()->addMinutes(60));

        return redirect()->route('dashboard')->with('success', 'Welcome! Your email is verified.');
    }

    


}
