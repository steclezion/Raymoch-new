<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

use Illuminate\Support\Facades\Log;

class BusinessOtpController extends Controller
{

    // POST /signup/business/send-otp

    public function sendOtp(Request $req)
    {
        $req->validate([
            'email' => 'required|email',
            'name'  => 'required|string',
        ]);

        $email = strtolower(trim($req->input('email')));
        $code  = (string) random_int(100000, 999999);

        Cache::put("otp:business:$email", $code, now()->addMinutes(5));

        try {
            Mail::raw("Your Raymoch business signup code is: {$code}", function ($m) use ($email) {
                $m->to($email)
                    ->subject('Raymoch Verification Code')
                    ->from(config('mail.from.address'), config('mail.from.name'))
                    ->replyTo(config('mail.from.address'), config('mail.from.name'));
            });

            return response()->json([
                'ok' => true,
                'expires' => now()->addMinutes(5)->toIso8601String(),
            ]);
        } catch (\Throwable $e) {
            Log::error('OTP mail failed', [
                'to' => $email,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'ok' => false,
                'message' => 'Failed to send OTP. Please try again.',
            ], 500);
        }
    }
    // POST /signup/business/verify-otp
    public function verifyOtp(Request $req)
    {
        $req->validate([
            'email' => 'required|email',
            'code'  => 'required|string|size:6',
        ]);

        $email = strtolower(trim($req->input('email')));
        $input = $req->input('code');
        $key   = "otp:business:$email";
        $saved = Cache::get($key);

        if (!$saved || $saved !== $input) {
            return response()->json(['ok' => false, 'message' => 'Invalid or expired code'], 422);
        }

        // mark verified
        Cache::forget($key);
        Cache::put("otp:business:verified:$email", true, now()->addMinutes(15));

        return response()->json(['ok' => true]);
    }
}
