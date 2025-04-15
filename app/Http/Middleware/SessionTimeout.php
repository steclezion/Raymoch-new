<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class SessionTimeout
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */

    public function handle($request, Closure $next)
    {
        if (session()->has('expires_at') && now()->greaterThan(session('expires_at'))) {
            Auth::logout();
            session()->flush();
            return redirect()->route('login')->with('message', 'Session expired. Please login again.');
        }

        return $next($request);
    }
}
