<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        api: __DIR__ . '/../routes/api.php',    // <-- make sure this line exists
        channels: __DIR__ . '/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //


    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
        $exceptions->render(
            function (
                AuthenticationException $exception,
                Request $request
            ) {
                if ($request->is('api/*') || $request->expectsJson()) {
                    return response()->json([
                        'message' => 'Your secure session could not be confirmed. Please sign in again to continue.',
                    ], 401);
                }

                return null;
            }
        );
    })->create();
