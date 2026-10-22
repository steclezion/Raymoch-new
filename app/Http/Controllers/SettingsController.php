<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\View\View;

class SettingsController extends Controller
{
    private const DEFAULTS = [
        'appearance' => 'system',
        'compact_mode' => false,
        'email_security' => true,
        'email_product' => true,
        'email_research' => false,
    ];

    public function page(): View
    {
        return view('pages.settings');
    }

    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar_url' => $user->avatar ? asset('storage/'.$user->avatar) : null,
                'authenticator_enabled' => (bool) ($user->two_factor_secret && $user->two_factor_confirmed_at),
            ],
            'preferences' => array_merge(self::DEFAULTS, $user->settings ?? []),
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email:rfc', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
        ]);

        $user->forceFill($validated)->save();

        return response()->json([
            'message' => 'Account details updated successfully.',
            'user' => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::min(10)->mixedCase()->numbers()],
        ]);

        $request->user()->forceFill([
            'password' => Hash::make($validated['password']),
            'remember_token' => Str::random(60),
        ])->save();

        return response()->json(['message' => 'Your password has been changed securely.']);
    }

    public function updatePreferences(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'appearance' => ['required', Rule::in(['light', 'dark', 'system'])],
            'compact_mode' => ['required', 'boolean'],
            'email_security' => ['accepted'],
            'email_product' => ['required', 'boolean'],
            'email_research' => ['required', 'boolean'],
        ]);

        $validated['email_security'] = true;
        $request->user()->forceFill(['settings' => $validated])->save();

        return response()->json(['message' => 'Preferences saved.', 'preferences' => $validated]);
    }
}
