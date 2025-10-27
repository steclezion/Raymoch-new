<?php

namespace App\Http\Controllers;

use App\Models\TrialRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class TrialRequestController extends Controller
{
    //

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'first_name'      => ['required', 'string', 'max:100'],
            'last_name'       => ['required', 'string', 'max:100'],
            'business_email'  => ['required', 'email', 'max:255'],
            'phone'           => ['nullable', 'string', 'max:40'],
            'company'         => ['nullable', 'string', 'max:255'],
            'agree_privacy'   => ['required', 'boolean'],
        ]);

        if ($v->fails()) {
            return response()->json([
                'ok' => false,
                'errors' => $v->errors(),
            ], 422);
        }

        $payload = $v->validated();

        // (Optional) prevent duplicates server-side too:
        $dup = TrialRequest::query()
            ->where('business_email', $payload['business_email'])
            ->orWhere(function ($q) use ($payload) {
                if (!empty($payload['phone'])) {
                    $q->where('phone', $payload['phone']);
                }
            })
            ->exists();

        if ($dup) {
            return response()->json([
                'ok' => false,
                'message' => 'Your request is already in the system.',
            ], 409);
        }

        $row = TrialRequest::create([
            'first_name'     => $payload['first_name'],
            'last_name'      => $payload['last_name'],
            'business_email' => $payload['business_email'],
            'phone'          => $payload['phone'] ?? null,
            'company'        => $payload['company'] ?? null,
            'agree_privacy'  => $payload['agree_privacy'],
        ]);

        return response()->json([
            'ok' => true,
            'id' => $row->id,
            'message' => 'Thanks! Your trial request has been received.',
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
