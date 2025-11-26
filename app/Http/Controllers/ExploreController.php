<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ExploreController extends Controller
{
    /** Show Blade that mounts the React page */
    public function index()
    {
        return view('pages.explore_business'); // resources/views/pages/explore_business.blade.php
    }

    /** Fast JSON for countries & sectors from composer.json (cached) */
    public function data()
    {
        $payload = Cache::remember('explore:composer-data', 600, function () {
            $composerPath = base_path('composer.json');
            $raw = @file_get_contents($composerPath);
            $json = $raw ? json_decode($raw, true) : [];
            $extra = $json['extra']['raymoch'] ?? [];
            $countries = $extra['countries'] ?? [];
            $sectors   = $extra['sectors'] ?? [];
            return [
                'countries' => array_values($countries),
                'sectors'   => array_values($sectors),
            ];
        });

        return response()->json([
            'ok' => true,
            'data' => $payload
        ]);
    }
}
