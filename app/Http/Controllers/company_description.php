<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CompanyInfos;
use App\Models\CompanyDescription;
use Illuminate\Support\Facades\DB;
use App\Models\CompanyDescriptionType;


class company_description extends Controller
{

public function index()
{
   // $descriptions =  CompanyDescription::with('companyinfos')->get();

    $descriptions = DB::table('company_descriptions')
    ->join('companyinfos', 'company_descriptions.companyinfo_id', '=', 'companyinfos.id')
    ->select(
        'company_descriptions.*',
        'companyinfos.company_title',
        'companyinfos.tagline',
        'companyinfos.status'
    )
    ->get();

    return view('company-description.index', compact('descriptions'));
}

public function create()
{
    $companies = CompanyInfos::all();
    $descriptionTypes = CompanyDescriptionType::where('status', 'active')->get(); // or all()

    return view('company-description.create', compact('companies', 'descriptionTypes'));
}

public function store(Request $request)
{
    $request->validate([
        'companyinfo_id' => 'required|exists:companyinfos,id',
        'description_type.*' => 'required|string|max:255',
        'description.*' => 'required|string|max:1000',
    ]);

     // Check for duplicate types
     if (count($request->description_type) !== count(array_unique($request->description_type))) {
        return redirect()->back()
            ->withInput()
            ->withErrors(['description_type' => 'Each description type must be unique.']);
    }

    foreach ($request->description_type as $index => $type) {
        CompanyDescription::create([
            'companyinfo_id' => $request->companyinfo_id,
            'description_type' => $type,
            'description' => $request->description[$index]
        ]);
    }

    return redirect()->route('descriptions.index')->with('success', 'Descriptions saved!');
}



// public function edit($companyId, $descriptionId)
// {

//     $companyinfo = CompanyInfos::findOrFail($companyId);
//     $companies = CompanyInfos::all();
//     $descriptions = Companydescription::where('companyinfo_id', $companyId)->get();

//     return view('company-description.edit', compact('companyinfo', 'companies', 'descriptions'))->with('editing', true);

// }


public function edit($companyId)
{
    $companyinfo = CompanyInfos::findOrFail($companyId);
    $companies = CompanyInfos::all();
    $descriptions = CompanyDescription::where('companyinfo_id', $companyId)->get();
    $descriptionTypes = CompanyDescriptionType::where('status', 'active')->get(); // 👈 load dynamic options

    return view('company-description.edit', compact('companyinfo', 'companies', 'descriptions', 'descriptionTypes'))
           ->with('editing', true);
}


public function update(Request $request, $companyId)
{
    $request->validate([
        'companyinfo_id' => 'required|exists:companyinfos,id',
        'description_type.*' => 'required|string|max:255',
        'description.*' => 'required|string|max:1000',
    ]);
 // Check for duplicate types
 if (count($request->description_type) !== count(array_unique($request->description_type))) {
    return redirect()->back()
        ->withInput()
        ->withErrors(['description_type' => 'Each description type must be unique.']);
}

    // Delete old descriptions
    CompanyDescription::where('companyinfo_id', $companyId)->delete();

    // Insert new ones
    foreach ($request->description_type as $index => $type) {
        CompanyDescription::create([
            'companyinfo_id' => $request->companyinfo_id,
            'description_type' => $type,
            'description' => $request->description[$index]
        ]);
    }

    return redirect()->route('descriptions.index')->with('success', 'Company descriptions updated!');
}



public function destroy($id)
{
   // dd($id);
    $description = CompanyDescription::findOrFail($id);
    $description->delete();

    return redirect()->route('descriptions.index')->with('success', 'Description deleted successfully!');
}




}
