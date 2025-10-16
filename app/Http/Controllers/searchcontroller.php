<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class searchcontroller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }


    public function businesses(Request $request)
    {
        $data = $request->validate([
            'q'       => ['nullable', 'string', 'max:120'],
            'country' => ['nullable', 'string', 'max:80'],
        ]);

        $q = $data['q'] ?? '';
        $country = $data['country'] ?? '';

        // TODO: replace this demo dataset with your real Eloquent query.
        // Example Eloquent (uncomment & adjust):
        // $query = Business::query();
        // if ($q)       $query->where('name','LIKE',"%{$q}%");
        // if ($country) $query->where('country',$country);
        // $rows = $query->limit(100)->get(['name','country','sector','capex']);

        $rows = collect([
            ['name' => 'Raymoch Group', 'country' => 'Eritrea', 'sector' => 'Energy', 'capex' => 320000000],
            ['name' => 'Adulis Logistics', 'country' => 'Eritrea', 'sector' => 'Logistics', 'capex' => 85000000],
            ['name' => 'Aruco Manufacturing', 'country' => 'Eritrea', 'sector' => 'Manufacturing', 'capex' => 140000000],
            ['name' => 'Asmara Textiles', 'country' => 'Eritrea', 'sector' => 'Textiles', 'capex' => 60000000],
            ['name' => 'Massawa Port Services', 'country' => 'Eritrea', 'sector' => 'Ports', 'capex' => 210000000],

        ])
            ->when($q, function ($c) use ($q) {
                $needle = Str::lower($q);
                return $c->filter(fn($r) => Str::contains(Str::lower($r['name']), $needle));
            })
            ->when($country, fn($c) => $c->where('country', $country))
            ->values();

        $payload = $rows->map(function ($r) {
            return [
                'name'            => $r['name'],
                'country'         => $r['country'],
                'sector'          => $r['sector'],
                'capex'           => $r['capex'],
                'capex_formatted' => '$ ' . number_format($r['capex'], 0),
            ];
        });

        // Optional: simulate slow network for testing spinner
        // sleep(2);

        return response()->json([
            'ok'   => true,
            'data' => $payload,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
