<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompanySelectionController extends Controller
{
    private const BUSINESS_SEARCH_VIEW = 'raymoch_business_search_view';

    public function index(Request $request): View
    {
        $filters = $request->validate([
            'sector_id' => ['required', 'integer', 'min:1'],
            'industry_id' => ['nullable', 'integer', 'min:1'],
        ]);

        $query = DB::table(self::BUSINESS_SEARCH_VIEW)
            ->where('sector_id', $filters['sector_id']);

        if (! empty($filters['industry_id'])) {
            $query->where('industry_id', $filters['industry_id']);
        }

        $companies = $query
            ->orderBy('country_name')
            ->orderBy('CompanyName')
            ->get();

        return view('pages.companies_selection', [
            'selectionBoot' => [
                'sector_id' => (string) $filters['sector_id'],
                'industry_id' => isset($filters['industry_id'])
                    ? (string) $filters['industry_id']
                    : '',
                'companies' => $companies,
                'total' => $companies->count(),
            ],
        ]);
    }
}
