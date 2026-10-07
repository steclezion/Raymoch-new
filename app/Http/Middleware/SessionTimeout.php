<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SessionTimeout
{
    public function handle(Request $request, Closure $next): Response
    {
        // Login, password-reset, and other guest pages must always remain usable.
        if (! Auth::check()) {
            $request->session()->forget('expires_at');

            return $next($request);
        }

        $expiresAt = $request->session()->get('expires_at');

        if ($expiresAt && now()->greaterThan($expiresAt)) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            if ($request->expectsJson()) {
                return response()->json([
                    'ok' => false,
                    'code' => 'SESSION_EXPIRED',
                ], 401);
            }

            // Deliberately do not flash a "Session expired" message.
            return redirect()->route('login');
        }

        // Sliding timeout: authenticated activity extends the session.
        $request->session()->put(
            'expires_at',
            now()->addMinutes((int) config('session.lifetime', 120))
        );

        return $next($request);
    }
}
