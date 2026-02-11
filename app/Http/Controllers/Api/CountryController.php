<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CountryController extends Controller
{
    public function index(Request $request)
    {
        // Adjust column names if yours differ
        $rows = DB::table('countries_all')
            ->select([
                'iso2',          // e.g. "US"
                'name',          // e.g. "United States"
                'calling_code',  // e.g. "1" or "+1"
            ])
            ->whereNotNull('iso2')
            ->whereNotNull('calling_code')
            ->orderByRaw("CAST(REPLACE(calling_code, '+', '') AS UNSIGNED) ASC")
            ->orderBy('name')
            ->get();

        $options = $rows->map(function ($r) {
            $iso2 = strtoupper(trim($r->iso2));
            $name = trim($r->name ?? $iso2);

            $cc = trim((string)$r->calling_code);
            $cc = ltrim($cc); // safe
            if ($cc !== '' && $cc[0] !== '+') $cc = '+' . $cc;

            return [
                'iso2'  => $iso2,
                'name'  => $name,
                'value' => $cc, // IMPORTANT: react-select uses your same shape
            ];
        })->values();

        return response()->json([
            'ok' => true,
            'countries' => $options,
        ]);
    }
}
