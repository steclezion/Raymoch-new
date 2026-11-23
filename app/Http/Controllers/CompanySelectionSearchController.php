<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompanySelectionSearchController extends Controller
{
    private const SEARCH_VIEW = 'raymoch_business_search_view';

    public function index(Request $request): View
    {
        $filters = $request->validate([
            'sector_id' => ['required', 'integer', 'min:1'],
            'industry_id' => ['nullable', 'integer', 'min:1'],
        ]);

        $sector = DB::table('sectors')->where('id', $filters['sector_id'])->first(['id', 'title', 'icon', 'description']);
        abort_unless($sector, 404);

        $query = DB::table(self::SEARCH_VIEW . ' as business_search')
            ->join('stages', 'business_search.Stage', '=', 'stages.id')
            ->select('business_search.*', 'stages.name as Stage')
            ->where('business_search.sector_id', $filters['sector_id']);
        if (! empty($filters['industry_id'])) $query->where('business_search.industry_id', $filters['industry_id']);

        $companies = $query->orderBy('business_search.country_name')->orderBy('business_search.CompanyName')->get();
        $sectors = DB::table('sectors')->orderBy('title')->get(['id', 'title', 'icon']);

        return view('pages.companies_selection_search', ['selectionSearchBoot' => [
            'sector' => $sector,
            'sectors' => $sectors,
            'companies' => $companies,
        ]]);
    }
}
