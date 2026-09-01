<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Models\Company;


class ApplicantInfoController extends Controller
{
    /**
     * Return contact information for the currently authenticated applicant.
     */
    public function grabApplicantsInfo(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        return response()->json([
            'full_name' => $user->name,
            'phone_number' => $user->phone,
        ]);
    }
}
