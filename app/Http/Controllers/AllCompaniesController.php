<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class AllCompaniesController extends Controller
{
    public function index(Request $request)
    {
        $query = Company::query();

        /*
         * React sends query params:
         *   ?q=...&sector=...&country=...&verified=1
         *
         * DB columns:
         *   CompanyName, Sector, Country, VerificationStatus, City, Stage
         */

        // -------- BASE VERIFICATION FILTER --------
        // If verified toggle is ON → only Verified
        // If verified toggle is OFF → only Pending + Unverified
        $verifiedParam = $request->query('verified');  // "1", "true", or null/""/undefined

        if ($verifiedParam === '1' || $verifiedParam === 'true') {
            // Client explicitly wants only VERIFIED companies
            $query->where('VerificationStatus', 'Verified');
        } else {
            // Default: show only NOT YET VERIFIED (Pending or Unverified)
            $query->whereIn('VerificationStatus', ['Pending', 'Unverified']);
        }

        // -------- SECTOR FILTER (?sector=Agriculture) --------
        $sector = $request->query('sector');   // lowercase from React
        if ($sector !== null && $sector !== '') {
            $query->where('Sector', $sector);
        }

        // -------- COUNTRY FILTER (?country=Kenya) --------
        $country = $request->query('country'); // lowercase from React
        if ($country !== null && $country !== '') {
            $query->where('Country', $country);
        }

        // -------- SEARCH FILTER (?q=...) --------
        if ($search = $request->query('q')) {
            $like = '%' . $search . '%';

            $query->where(function ($q) use ($like) {
                $q->where('CompanyName', 'like', $like)
                    ->orWhere('Sector', 'like', $like)
                    ->orWhere('Country', 'like', $like)
                    ->orWhere('City', 'like', $like)
                    ->orWhere('Stage', 'like', $like);
                // Add more columns here if needed (e.g. Description)
            });
        }

        // -------- ORDER + PAGINATION --------
        $companies = $query
            ->orderBy('CompanyName')   // make sure this matches your column name
            ->paginate(20);

        return response()->json([
            'data' => $companies,
        ]);
    }

    public function show($id)
    {
        $company = Company::findOrFail($id);

        return response()->json([
            'data' => $company,
        ]);
    }
}
