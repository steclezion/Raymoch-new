<?php

namespace App\Http\Controllers;

use App\Models\CompanyClassification;
use App\Models\companyinfos;
use Illuminate\Http\Request;
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
        $companyinfos = CompanyInfos::all();
        return view('companyinfos.index', compact('companyinfos'));
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $classifications = CompanyClassification::where('status', 'active')->get();
        return view('companyinfos.create', compact('classifications'));

    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        $data = $request->all();
      //  $manager = new ImageManager('imagick');
        $manager = new ImageManager(new GdDriver());

        foreach (['first_picture', 'second_picture', 'third_picture'] as $field) {
            if ($request->hasFile($field)) {
                $uploaded = $request->file($field);

                // Read & resize image
                $image = $manager->read($uploaded)->resize(800, 600, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });

                // Encode and store
                $filename = time() . '_' . $field . '.' . $uploaded->getClientOriginalExtension();
                Storage::disk('public')->put("company_images/{$filename}", (string) $image->encode());

                $data[$field] = "company_images/{$filename}";
            }
        }

        CompanyInfos::create($data);
        return redirect()->route('companyinfos.index')->with('success', 'Company info created with resized images!');
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
        return view('companyinfos.edit', compact('companyinfo'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CompanyInfos $companyinfo)
    {
        $data = $request->all();
        //  $manager = new ImageManager('imagick');
          $manager = new ImageManager(new GdDriver());

          foreach (['first_picture', 'second_picture', 'third_picture'] as $field) {
              if ($request->hasFile($field)) {
                  $uploaded = $request->file($field);

                  // Read & resize image
                  $image = $manager->read($uploaded)->resize(800, 600, function ($constraint) {
                      $constraint->aspectRatio();
                      $constraint->upsize();
                  });

                  // Encode and store
                  $filename = time() . '_' . $field . '.' . $uploaded->getClientOriginalExtension();
                  Storage::disk('public')->put("company_images/{$filename}", (string) $image->encode());

                  $data[$field] = "company_images/{$filename}";
              }
          }

        $companyinfo->update($data);
        return redirect()->route('companyinfos.index')->with('success', 'Company info updated!');
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
