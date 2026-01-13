<?php

namespace App\Http\Controllers;

use App\Models\TrialRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class TrialRequestController extends Controller
{
    //

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name'     => ['required', 'string', 'max:100'],
            'last_name'      => ['required', 'string', 'max:100'],
            'business_email' => ['required', 'email', 'max:255'],
            'phone'          => ['nullable', 'string', 'max:40'],
            'company'        => ['nullable', 'string', 'max:255'],
            'agree_privacy'  => ['required', 'boolean'],
        ]);

        // Create the request
        $trial = TrialRequest::create([
            'first_name'     => $data['first_name'],
            'last_name'      => $data['last_name'],
            'business_email' => $data['business_email'],
            'phone'          => $data['phone'] ?? null,
            'company'        => $data['company'] ?? null,
            'agree_privacy'  => $data['agree_privacy'],
        ]);

        // Generate a 6-digit code and store it w/ expiry
        $code = random_int(100000, 999999);
        $trial->verification_code = (string)$code;         // For production, hash this
        $trial->code_expires_at   = Carbon::now()->addMinutes(15);
        $trial->save();

        // Send email (simple)
        Mail::raw(
            "Your Raymoch verification code is: {$code}\nThis code expires in 15 minutes.",
            function ($message) use ($trial) {
                $message->to($trial->business_email)
                    ->subject('Your verification code');
            }
        );

        return response()->json([
            'ok'       => true,
            'message'  => 'Request created and code sent.',
            'redirect' => route('trial.verify.page', ['email' => $trial->business_email]),
        ], 201);
    }

    public function verifyCode(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'code'  => ['required', 'string', 'max:10'],
        ]);

        $trial = TrialRequest::where('business_email', $data['email'])
            ->latest('id')
            ->first();

        if (!$trial) {
            return response()->json([
                'ok' => false,
                'message' => 'We could not find your request.',
            ], 404);
        }

        if (!$trial->verification_code || !$trial->code_expires_at) {
            return response()->json([
                'ok' => false,
                'message' => 'No code has been generated yet.',
            ], 400);
        }

        if (Carbon::now()->greaterThan($trial->code_expires_at)) {
            return response()->json([
                'ok' => false,
                'message' => 'The code has expired. Please submit again.',
            ], 422);
        }

        if ($data['code'] !== $trial->verification_code) {
            return response()->json([
                'ok' => false,
                'message' => 'Invalid code. Please try again.',
            ], 422);
        }

        // Mark verified and clear code
        $trial->verified_at = Carbon::now();
        $trial->verification_code = null;
        $trial->code_expires_at = null;
        $trial->save();

        return response()->json([
            'ok' => true,
            'message' => 'Verified.',
            'redirect' => route('trial.success.page'),
        ]);
    }


    public function checkExisting(Request $request)
    {
        $data = $request->validate([
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
        ]);

        $exists = false;

        if (!empty($data['email'])) {
            $exists = TrialRequest::where('business_email', $data['email'])->exists();
        }

        if (!$exists && !empty($data['phone'])) {
            $exists = TrialRequest::where('phone', $data['phone'])->exists();
        }

        if ($exists) {
            return response()->json([
                'exists'  => true,
                'message' => 'Your request is already in the system.',
            ], 200);
        }

        return response()->json([
            'exists'  => false,
            'message' => 'No existing request found.',
        ], 200);
    }
}
