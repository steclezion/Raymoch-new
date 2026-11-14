<?php

namespace App\Http\Middleware;

use App\Services\ExpiredTrialUserService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureTrialUserIsActive
{
    public function __construct(private readonly ExpiredTrialUserService $expiredTrials) {}

    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        if ($user && $user->type_of_account === 'trial' && (! $user->trial_ends_at || $user->trial_ends_at->isPast())) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            $this->expiredTrials->purge();

            return $request->expectsJson()
                ? response()->json(['message' => 'Your trial has expired.', 'code' => 'TRIAL_EXPIRED'], 401)
                : redirect('/')->with('status', 'Your trial has expired.');
        }

        return $next($request);
    }
}
