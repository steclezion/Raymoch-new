<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google\Client as GoogleClient; // composer require google/apiclient:^2.15
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;


class OneTapController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function login(Request $request)
    {
        $token = $request->input('credential');

        $client = new GoogleClient(['client_id' => env('GOOGLE_CLIENT_ID')]);
        $payload = $client->verifyIdToken($token);
        if (!$payload) return response()->json(['ok' => false], 401);

        $email = $payload['email'] ?? null;
        $name  = $payload['name'] ?? 'Google User';
        $sub   = $payload['sub'] ?? null; // google unique ID

        $user = User::firstOrCreate(
            ['email' => $email],
            ['name' => $name, 'email_verified_at' => now(), 'password' => bcrypt(Str::random(32)), 'google_id' => $sub]
        );
        Auth::login($user, true);

        return response()->json(['ok' => true]);
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
