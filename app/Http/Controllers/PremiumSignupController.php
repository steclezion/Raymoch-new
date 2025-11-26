<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PremiumSignupController extends Controller
{
    //
    public function sendOtp(Request $req)
    {
        $data = $req->validate([
            'name' => 'required|string|max:200',
            'email' => 'required|email',
            'display_name' => 'required|string|max:150',
            'password' => 'required|string|min:9',
            'confirm_password' => 'required|string|same:password',
            'company_name' => 'required|string|max:200',
            'consent' => 'required|boolean',
            'plan' => 'required|string|in:premium',
        ]);

        // store/refresh pending signup
        DB::table('premium_signups')->updateOrInsert(
            ['email' => $data['email']],
            [
                'name' => $data['name'],
                'display_name' => $data['display_name'],
                'company_name' => $data['company_name'],
                // Hash later upon finalization; keep temp salted hash or encrypted blob if you prefer.
                'password_plain' => bcrypt($data['password']), // or encrypt() if you want to re-hash final
                'consent' => $data['consent'] ? 1 : 0,
                'plan' => 'premium',
                'updated_at' => now(),
                'created_at' => now()
            ]
        );

        // create code
        $code = random_int(100000, 999999);
        $expiresAt = Carbon::now()->addMinutes(5);

        DB::table('email_verifications')->updateOrInsert(
            ['email' => $data['email'], 'purpose' => 'premium_signup'],
            ['code' => (string)$code, 'expires_at' => $expiresAt, 'created_at' => now(), 'updated_at' => now()]
        );

        // send email (stub)
        try {
            Mail::to($data['email'])->send(new \App\Mail\OtpCodeMail($code));
        } catch (\Throwable $e) {
            return response()->json(['ok' => false, 'message' => 'Failed to send email'], 500);
        }

        return response()->json(['ok' => true, 'expires' => $expiresAt->toIso8601String()]);
    }

    public function verifyOtp(Request $req)
    {
        $req->validate(['email' => 'required|email', 'code' => 'required|string|size:6']);

        $row = DB::table('email_verifications')
            ->where('email', $req->email)
            ->where('purpose', 'premium_signup')
            ->first();

        if (!$row || $row->code !== $req->code) {
            return response()->json(['ok' => false, 'message' => 'Invalid code'], 422);
        }
        if (Carbon::parse($row->expires_at)->isPast()) {
            return response()->json(['ok' => false, 'message' => 'Code expired'], 410);
        }

        // mark verified flag on premium_signups
        DB::table('premium_signups')->where('email', $req->email)->update(['is_verified' => 1, 'updated_at' => now()]);

        return response()->json(['ok' => true]);
    }
}
