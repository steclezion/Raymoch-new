<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BusinessModel;
use App\Models\Country;
use Illuminate\Http\Request;

class DirectoryController extends Controller
{
    public function sectors(Request $request)
    {
        $items = BusinessModel::orderBy('title')->get(['id', 'icon', 'title', 'description']);
        return response()->json(['data' => $items]);
    }

    public function countries(Request $request)
    {
        $items = Country::orderBy('country_name')->get(['id', 'country_code', 'country_name', 'flag_icon']);
        return response()->json(['data' => $items]);
    }
}
