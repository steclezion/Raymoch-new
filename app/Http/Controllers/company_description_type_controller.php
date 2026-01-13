<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\CompanyDescriptionType;



class company_description_type_controller extends Controller
{
    //
    public function index()
    {
        $types = CompanyDescriptionType::all();
        return view('company_description_types.index', compact('types'));
    }

    public function create()
    {
        return view('company_description_types.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string'
        ]);

        CompanyDescriptionType::create($request->all());

        return redirect()->route('company_description_types.index')->with('success', 'Type added.');
    }

    public function edit($id)
    {
        $type = CompanyDescriptionType::findOrFail($id);
        return view('company_description_types.create', compact('type'))->with('editing', true);
    }

    public function update(Request $request, $id)
    {
        $type = CompanyDescriptionType::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string'
        ]);

        $type->update($request->all());

        return redirect()->route('company_description_types.index')->with('success', 'Type updated.');
    }

    public function destroy($id)
    {
        CompanyDescriptionType::destroy($id);
        return redirect()->route('company_description_types.index')->with('success', 'Type deleted.');
    }
}
