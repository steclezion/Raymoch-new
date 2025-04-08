<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Notifications\WelcomeGoogleUser;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

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

        // if(!is_null($find_user) )
        // {
        //         Auth::login($find_user);
        // }
        // else
        // {
        //     $user = User::Create(
        //         [   'email' => $googleUser->getEmail(),
        //             'name' => $googleUser->getName(),
        //             'google_id' => $googleUser->getId(),
        //             'avatar' => $googleUser->getAvatar(),
        //             'password' => bcrypt(12345678)
        //         ]
        //     );
        //     Auth::login($user);

        // return redirect('/dashboard'); // Or wherever you want
        // }
         //dd($find_google_id );

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

        Auth::login($user);
// Send notification only if it was newly created
if ($user->wasRecentlyCreated) {
    $user->notify(new WelcomeGoogleUser());
}
        return redirect('/dashboard'); // Or wherever you want

    }


}
