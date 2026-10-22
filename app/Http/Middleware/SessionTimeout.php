<?php

namespace App\Http\Middleware;

use App\Services\Auth\LoginActivityService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SessionTimeout
{
    public function __construct(private readonly LoginActivityService $activity)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::check()) {
            return $next($request);
        }

        if ($this->activity->isExpired($request)) {
            $acknowledgement = $this->activity->logout($request);
            if ($request->expectsJson() || $request->is('auth/activity/*')) {
                return response()->json([...$acknowledgement, 'code' => 'LOGIN_INACTIVITY_TIMEOUT'], 401);
            }
            return redirect('/');
        }

        return $next($request);
    }
}
