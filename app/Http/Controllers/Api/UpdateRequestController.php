<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class UpdateRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
