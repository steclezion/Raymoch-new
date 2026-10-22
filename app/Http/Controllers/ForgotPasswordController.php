<?php

namespace App\Http\Controllers;
//namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{
    /**
     * Show the form to request a password reset link.
     */
    public function showLinkRequestForm()
    {
        return view('raymoch.auth.forgot-password');
    }

    /**
     * Handle sending the password reset email.
     */

    public function sendResetLinkEmail(Request $request)
    {
        $credentials = $request->validate(['email' => ['required', 'email:rfc', 'max:255']]);

        $status = Password::sendResetLink($credentials);
        $genericMessage = 'If an account matches that email, a secure reset link has been sent.';

        // Do not reveal whether an email address belongs to an account.
        if (in_array($status, [Password::RESET_LINK_SENT, Password::INVALID_USER], true)) {
            return $request->expectsJson()
                ? response()->json(['message' => $genericMessage])
                : back()->with('status', $genericMessage);
        }

        return $request->expectsJson()
            ? response()->json(['message' => __($status)], 422)
            : back()->withErrors(['email' => __($status)]);
    }
}
