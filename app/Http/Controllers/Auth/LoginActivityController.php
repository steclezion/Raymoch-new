<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\LoginActivityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoginActivityController extends Controller
{
    public function status(Request $request, LoginActivityService $activity): JsonResponse
    {
        return response()->json($activity->status($request));
    }

    public function touch(Request $request, LoginActivityService $activity): JsonResponse
    {
        return response()->json($activity->touch($request));
    }

    public function expire(Request $request, LoginActivityService $activity): JsonResponse
    {
        return response()->json($activity->logout($request));
    }
}
