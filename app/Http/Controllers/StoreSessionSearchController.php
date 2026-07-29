<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StoreSessionSearchController extends Controller
{
    public function store(Request $request)
    {
        $filters = [
            'keyword' => $request->input('keyword', ''),
            'region' => $request->input('region', 'all'),
            'country' => $request->input('country', 'all'),
            'state' => $request->input('state', 'all'),
            'city' => $request->input('city', 'all'),
            'sector' => $request->input('sector', ''),
            'industry' => $request->input('industry', 'all'),
            'verification' => $request->boolean('verification') ? 'ON' : 'OFF',
        ];

        session(['previous_search_filters' => $filters]);

        return response()->json([
            'ok' => true,
            'data' => $filters,
            'url' => $this->buildUrl($filters),
        ]);
    }

    public function current()
    {
        $filters = session('previous_search_filters', [
            'keyword' => '',
            'region' => 'all',
            'country' => 'all',
            'state' => 'all',
            'city' => 'all',
            'sector' => '',
            'industry' => 'all',
            'verification' => 'OFF',
        ]);

        return response()->json([
            'ok' => true,
            'data' => $filters,
            'url' => $this->buildUrl($filters),
        ]);
    }

    private function buildUrl(array $filters): string
    {
        $params = [];

        foreach ($filters as $key => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            $params[$key] = $value;
        }

        $params['from'] = 'explore';

        return '/companies?' . http_build_query($params);
    }
}
