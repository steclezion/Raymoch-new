<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    //

    public function options(Request $request)
    {
        // Adjust column names if your countries table differs
        // Common: id, name (or country_name)
        $countries = DB::table('countries')
            ->select('id', 'country_name as name')
            ->orderBy('name', 'asc')
            ->get();

        $sectors = DB::table('sectors')
            ->select('id', 'name')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'ok' => true,
            'countries' => $countries,
            'sectors' => $sectors,
        ]);
    }
}
