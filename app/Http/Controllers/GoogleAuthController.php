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
        // $googleUser = Socialite::driver('google')->user();
        $googleUser  = Socialite::driver('google')->stateless()->user();
        $find_user = User::where('google_id',  $googleUser->id)->first();


        // Find or create user
        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'password' => bcrypt(12345678)
            ]
        );

//         Auth::login($user);
// // Send notification only if it was newly created
// if ($user->wasRecentlyCreated) {
//     $user->notify(new WelcomeGoogleUser());

// }
// session()->put('expires_at', now()->addMinutes(60));
// return redirect('/dashboard'); // Or wherever you want

$verificationUrl = URL::temporarySignedRoute(
    'verify.email.link',
    now()->addMinutes(60),
    ['user' => $user->id]
);

Mail::to($user->email)->send(new \App\Mail\GoogleVerifyMail($user, $verificationUrl));

return redirect()->route('login')->with('success', 'We sent you a verification email. Please check your inbox.');


    }


    public function verifyEmail(Request $request)
    {
        if (! $request->hasValidSignature()) {
            abort(403, 'Invalid or expired verification link.');
        }

        $user = User::findOrFail($request->user);
        $user->is_verified = true;
        $user->save();

        return redirect()->route('dashboard')->with('success', 'Your email is verified. Welcome to Raymoch!!.');
    }


}
