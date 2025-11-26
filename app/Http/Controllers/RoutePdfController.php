<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;
use Barryvdh\DomPDF\Facade\Pdf;


class RoutePdfController extends Controller
{
    //

    public function export()
    {
        $routes = collect(Route::getRoutes())->map(function ($route) {
            return [
                'method'     => implode('|', $route->methods()),
                'uri'        => $route->uri(),
                'name'       => $route->getName(),
                'action'     => $route->getActionName(),
                'middleware' => implode(', ', $route->middleware()),
            ];
        });

        $pdf = Pdf::loadView('pdf.routes', ['routes' => $routes]);
        return $pdf->download('laravel_routes.pdf');
    }
}
