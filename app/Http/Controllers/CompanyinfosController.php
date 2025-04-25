<?php

namespace App\Http\Controllers;

use App\Models\CompanyClassification;
use App\Models\companyinfos;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\ImageManager;

class CompanyinfosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {


        $companyinfos = DB::table('companyinfos')
            ->join('company_classifications', 'companyinfos.classification_id', '=', 'company_classifications.id')
            ->select(
                'companyinfos.*',
                'company_classifications.industry',
                'company_classifications.business_type'
            )
            ->get();
        return view('companyinfos.index', compact('companyinfos'));

    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $classifications = CompanyClassification::where('status', 'active')
        ->select('*')
        ->distinct()
        ->get();
        
        $countries = Country::orderBy('name')->get();

        return view('companyinfos.create', compact(['classifications', 'countries']));

    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
       // dd($request->all());

        $request->validate([
            'company_title' => 'required|string|max:255',
            'tagline' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'classification_id' => 'required|exists:company_classifications,id',
        ]);

        $data = $request->all();

        $manager = new ImageManager(new GdDriver());

        foreach (['first_picture', 'second_picture', 'third_picture'] as $field) {
            if ($request->hasFile($field)) {
                $uploaded = $request->file($field);

                $image = $manager->read($uploaded)->resize(800, 800, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });

                $filename = time() . '_' . $field . '.' . $uploaded->getClientOriginalExtension();
                Storage::disk('public')->put("company_images/{$filename}", (string) $image->encode());

                $data[$field] = "company_images/{$filename}";
            }
        }




        CompanyInfos::create($data);


        return redirect()->route('companyinfos.index')->with('success', 'Company info created with classification and resized images!');

    }

    /**
     * Display the specified resource.
     */
    public function show(companyinfos $companyinfos)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CompanyInfos $companyinfo)
    {
        $classifications = CompanyClassification::where('status', 'active')->get();

        return view('companyinfos.edit', compact('companyinfo', 'classifications'))->with('editing', true);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CompanyInfos $companyinfo)
    {
        $request->validate([
            'company_title' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
            'classification_id' => 'required|exists:company_classifications,id',
            'first_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4048',
            'second_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4048',
            'third_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4048',
        ]);

        $data = $request->only([
            'company_title',
            'tagline',
            'status',
            'classification_id'
        ]);

        $manager = new ImageManager(new GdDriver());

        foreach (['first_picture', 'second_picture', 'third_picture'] as $field) {
            if ($request->hasFile($field)) {
                $uploaded = $request->file($field);

                $image = $manager->read($uploaded)->resize(800, 800, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });

                $filename = time() . '_' . $field . '.' . $uploaded->getClientOriginalExtension();
                Storage::disk('public')->put("company_images/{$filename}", (string) $image->encode());

                $data[$field] = "company_images/{$filename}";
            }
        }

        $companyinfo->update($data);

        return redirect()->route('companyinfos.index')->with('success', 'Company info updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CompanyInfos $companyinfo)
    {
        $companyinfo->delete();
        return redirect()->route('companyinfos.index')->with('success', 'Company info deleted!');
    }
}
