<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CountryCodeController extends Controller
{
    public function index(Request $request)
    {
        // ✅ Update column names to match your "country" table: // Example expected columns: // - iso2 (e.g. "US") // - name (e.g. "United States") // - phone_code OR calling_code (e.g. "1" or "+1") 
        $rows = DB::table('countries_all')
            ->select([
                'id', // ✅ include id
                'name',
                DB::raw("COALESCE(tele_code, country_code) as dial"),
            ])
            ->whereNotNull('name')
            ->whereNotNull('tele_code')
            ->orderByDesc('id') // ✅ cleaner syntax
            ->get();

        return response()->json(['ok' => true, 'data' => $rows,]);
    }
}
