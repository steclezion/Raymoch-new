<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => ['nullable', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:8', 'max:72', 'confirmed'],
        ]);

        $user = User::create($data); // password hashed via cast
        Auth::login($user, true);

        return response()->json(['ok' => true, 'redirect' => route('dashboard')]);
    }

    public function login(Request $request)
    {
        $creds = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $remember = filter_var($request->boolean('remember'), FILTER_VALIDATE_BOOLEAN);
        if (!Auth::attempt($creds, $remember)) {
            return response()->json(['ok' => false, 'message' => 'Invalid email or password'], 422);
        }
        $request->session()->regenerate();

        return response()->json(['ok' => true, 'redirect' => route('dashboard')]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['ok' => true, 'redirect' => route('login')]);
    }
}
