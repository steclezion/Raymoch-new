<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\TotpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class AuthenticatorController extends Controller
{
    private const PENDING_SECRET = 'authenticator.pending_secret';

    public function page()
    {
        return view('pages.auth.authenticator');
    }

    public function status(Request $request): JsonResponse
    {
        return response()->json([
            'enabled' => (bool) ($request->user()->two_factor_secret && $request->user()->two_factor_confirmed_at),
            'confirmed_at' => $request->user()->two_factor_confirmed_at?->toIso8601String(),
        ]);
    }

    public function begin(Request $request, TotpService $totp): JsonResponse
    {
        $secret = $totp->generateSecret();
        $request->session()->put(self::PENDING_SECRET, Crypt::encryptString($secret));

        return response()->json([
            'secret' => $secret,
            'formatted_secret' => trim(chunk_split($secret, 4, ' ')),
            'provisioning_uri' => $totp->provisioningUri($secret, $request->user()->email),
            'issuer' => 'Raymoch',
            'account' => $request->user()->email,
        ]);
    }

    public function confirm(Request $request, TotpService $totp): JsonResponse
    {
        $validated = $request->validate(['code' => ['required', 'digits:6']]);
        $encrypted = $request->session()->get(self::PENDING_SECRET);
        if (! $encrypted) return response()->json(['message' => 'Start authenticator setup again.'], 422);

        try {
            $secret = Crypt::decryptString($encrypted);
        } catch (\Throwable) {
            $request->session()->forget(self::PENDING_SECRET);
            return response()->json(['message' => 'The setup session expired. Start again.'], 422);
        }

        $step = $totp->verify($secret, $validated['code']);
        if ($step === null) return response()->json(['message' => 'The authenticator code is incorrect. Check the device time and try again.'], 422);

        $request->user()->forceFill([
            'two_factor_secret' => $secret,
            'two_factor_confirmed_at' => now(),
            'two_factor_last_used_step' => $step,
        ])->save();
        $request->session()->forget(self::PENDING_SECRET);

        return response()->json(['enabled' => true, 'message' => 'Authenticator secure sign in is enabled.']);
    }

    public function disable(Request $request, TotpService $totp): JsonResponse
    {
        $validated = $request->validate([
            'password' => ['required', 'current_password'],
            'code' => ['required', 'digits:6'],
        ]);
        $user = $request->user();
        $step = $user->two_factor_secret ? $totp->verify($user->two_factor_secret, $validated['code']) : null;
        if ($step === null) return response()->json(['message' => 'The authenticator code is incorrect.'], 422);

        $user->forceFill([
            'two_factor_secret' => null,
            'two_factor_confirmed_at' => null,
            'two_factor_last_used_step' => null,
        ])->save();

        return response()->json(['enabled' => false, 'message' => 'Authenticator secure sign in is disabled.']);
    }
}
