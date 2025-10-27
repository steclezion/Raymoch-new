<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class CompanyApiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Example list payload (replace with DB)
        return response()->json([
            ['id' => 1, 'CompanyName' => 'BlueWave Solar'],
            ['id' => 2, 'CompanyName' => 'GreenFoods'],
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
        $v = Validator::make($request->all(), [
            'company' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:120',
            'email'   => 'required|email',
            'notes'   => 'nullable|string|max:5000',
            'company_id' => 'nullable'
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }
        // Persist to DB or send to queue/email. For now, log it.
        // UpdateRequest::create([...]);
        Log::info('Company update request', $request->all());

        return response()->json(['ok' => true]);
        return response()->json(['ok' => true]);
    }

    /**
     * Display the specified resource.
     */
    public function show($company)
    {
        // Demo payload; map fields to what your JS expects.
        // Replace with real Company::findOrFail($company) and transform.
        return response()->json([
            'Id' => (int)$company,
            'CompanyName' => 'BlueWave Solar',
            'Sector' => 'Energy',
            'Country' => 'Kenya',
            'City' => 'Nairobi',
            'Stage' => 'Growth',
            'ListingBucket' => 'Verified',
            'VerificationStatus' => 'Verified',
            'Employees' => 120,
            'FoundedYear' => 2016,
            'Description' => 'Solar EPC focused on C&I rooftops in East Africa.',
            'AnnualRevenueUSD' => 5600000,
            'TotalFundingUSD' => 3200000,
            'CTI_Tier' => 'Tier 2',
            'CTI_Score' => 78,
            'DiasporaOwned' => true,
            'WomenLed' => false,
            'YouthLed' => true,
            'HasFinancials' => true,
            'Website' => 'https://bluewavesolar.example',
            'Email' => 'info@bluewavesolar.example',
            'Phone' => '+254 700 123456',
            'LastUpdated' => now()->toDateString(),
            'DataSourcesCount' => 4,
        ]);
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
