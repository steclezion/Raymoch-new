<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CountryCodeController extends Controller
{
    public function index(Request $request)
    {
        // ✅ Update column names to match your "country" table:
        // Example expected columns:
        // - iso2 (e.g. "US")
        // - name (e.g. "United States")
        // - phone_code OR calling_code (e.g. "1" or "+1")

        $rows = DB::table('country')
            ->select([
                DB::raw('UPPER(iso2) as iso2'),
                'name',
                DB::raw("COALESCE(phone_code, calling_code, dial_code) as dial"),
            ])
            ->whereNotNull('iso2')
            ->whereNotNull('name')
            ->where(function ($q) {
                $q->whereNotNull('phone_code')
                    ->orWhereNotNull('calling_code')
                    ->orWhereNotNull('dial_code');
            })
            ->orderBy('dial')
            ->orderBy('name')
            ->get();

        return response()->json([
            'ok' => true,
            'data' => $rows,
        ]);
    }
}
