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

class CompanyInfosController extends Controller
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
        $classifications = CompanyClassification::where('status', 'active')->orderBy('business_type')->get();
        $countries = Country::orderBy('name')->get();

        return view('companyinfos.edit', compact('companyinfo', 'classifications', 'countries'))->with('editing', true);
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
            'country_id' => 'required|exists:countries,id',
            'website' => 'nullable|string|max:255|url',
            'founder_name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'location' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'first_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4048',
            'second_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4048',
            'third_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4048',
        ]);

        $data = $request->only([
            'company_title',
            'tagline',
            'status',
            'classification_id',
            'country_id',
            'website',
            'founder_name',
            'description',
            'location',
            'email'
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



    public function search(Request $request)
    {
        $query = CompanyInfos::query()
            ->leftJoin('company_classifications', 'companyinfos.classification_id', '=', 'company_classifications.id')
            ->select(
                'companyinfos.*',
                'company_classifications.industry',
                'company_classifications.business_type',
                'company_classifications.status as classification_status',
                'company_classifications.id as classification_id'
            );






        $classifications = CompanyClassification::select('industry', DB::raw('MIN(id) as id'))
            ->groupBy('industry')
            ->orderBy('industry')
            ->get();


        $classifications_query = CompanyClassification::select('*')
            ->where('industry', $request->industry)
            ->orderBy('industry')
            ->get();





        // Basic search by company title
        if ($request->filled('company_title')) {
            $query->where('company_title', 'LIKE', '%' . $request->company_title . '%');
        }

        // Advanced search filters
        if ($request->filled('website')) {
            $query->where('website', 'LIKE', '%' . $request->website . '%');
        }

        if ($request->filled('founder_name')) {
            $query->where('founder_name', 'LIKE', '%' . $request->founder_name . '%');
        }

        if ($request->filled('industry')) {

            foreach ($classifications_query as $classification) {
                $query->orWhere('company_classifications.id', '=', $classification->id);
            }

            //    $query->where('classification_id', '=',  $request->industry );


        }

        $results = $query->paginate(1)->withQueryString();


        foreach ($results as $company) {
            $imageUrl_ = asset('storage/' . $company->first_picture);
            $imageUrl__ = asset('storage/' . $company->second_picture);
            $imageUrl___ = asset('storage/' . $company->third_picture);

            $product_result = "<section id='searched_content'>
       <div class='container'>
           <div class='row g-4 gx-5'>
               <div class='col-lg-3'>
                   <div class='me-lg-3'>
                       <a href='#' class='bg-color text-light d-block p-3 px-4 rounded-10px mb-3 relative'>
                           <h4 class='mb-0'> $company->company_title </h4>
                           <i class='icofont-long-arrow-right absolute abs-middle fs-24 end-20px'></i>
                       </a>
                   </div>
               </div>

               <div class='col-lg-9'>
                   <div class='row g-4 gx-5'>
                       <div class='col-lg-6'>
                           <h3><span class='id-color-2'>$company->tagline </span></h3>
                       </div>

                       <div class='col-lg-6'>
                           <div class='row g-4'>
                               <div class='col-sm-6'>

                                       <img src='{$imageUrl_}' class='w-100 rounded-1' alt=''>

                               </div>
                               <div class='col-sm-6'>

                                       <img src='{$imageUrl__}' class='w-100 rounded-1' alt=''>

                                  <br>
                                       <img src='{$imageUrl___}' class='w-100 rounded-1' alt=''>

                               </div>
                           </div>
                       </div>
                   </div>

                   <div class='spacer-double'></div>";

            $result_company_details = DB::table('companyinfos')
                ->join('company_descriptions', 'companyinfos.id', '=', 'company_descriptions.companyinfo_id')
                ->where('companyinfos.id', '=', $company->id)
                ->select('companyinfos.*', 'company_descriptions.*', 'company_descriptions.description_type as destype', 'company_descriptions.description as des')
                ->get();




            $product_result .=  " <div class='row g-4'>
                   <div class='col-lg-12'> <h2 class='mb-0'> <span class='id-color-2'>Infos...</span></h2> </div>";

            foreach ($result_company_details as $details) {

                $product_result .= " <div class='col-lg-4 col-md-6 wow fadeInRight' data-wow-delay='.0s'>
                                <div class='relative h-100 bg-color text-light padding30 rounded-1'>
                                    <div>
                                        <h4>$details->destype</h4>
                                        <p class='mb-0'>$details->des</p>
                                    </div>
                                </div>
                            </div>";
            }


            $product_result .= "</div>";

            $product_result .= "

           </div>
       </div>
   </section>";
        }

        // Step 1: Get all industries for select filters (optional, you already do)
        $classifications = CompanyClassification::select('industry')->distinct()->orderBy('industry')->get();
        $countries = Country::orderBy('name')->get();

        $no_results = $results->isEmpty();

        if ($results->isEmpty()) {
            $product_result = "<div class='alert alert-warning text-center'>
        <strong>No data found.</strong> Please try a different search.
    </div>";
        }

        return view('raymoch.pages.project_business', compact('product_result', 'results', 'classifications', 'countries', 'no_results'));
    }


    public function search_query(Request $request, $industry = null)
    {
        $product_result = '';

        // Step 1: Get all industries for select filters (optional, you already do)
        $classifications = CompanyClassification::select('industry', DB::raw('MIN(id) as id'))
            ->groupBy('industry')
            ->orderBy('industry')
            ->get();

        $countries = Country::orderBy('name')->get();

        $query = CompanyInfos::query();
        $companyinfos = $query->paginate(1); // 15 record per page for full viewing and navigation


        if ($industry == 'Natural+Resources-Environmental') {
            $industry = $request->input('Natural Resources/Environmental');
        } // e.g., from a search form


        if ($industry == ' ConstructionUtilitiesContracting') {
            $industry = $request->input(' Construction/Utilities/Contracting');
        } // e.g., from a search form


        $results = DB::table('companyinfos')
            ->join('company_classifications', 'companyinfos.classification_id', '=', 'company_classifications.id')
            ->where('company_classifications.industry', 'LIKE', "%{$industry}%")
            ->select('companyinfos.*', 'company_classifications.industry')
            ->paginate(1)
            ->withQueryString();




        foreach ($results as $company) {
            $imageUrl_ = asset('storage/' . $company->first_picture);
            $imageUrl__ = asset('storage/' . $company->second_picture);
            $imageUrl___ = asset('storage/' . $company->third_picture);

            $product_result = "<section id='searched_content'>
       <div class='container'>
           <div class='row g-4 gx-5'>
               <div class='col-lg-3'>
                   <div class='me-lg-3'>
                       <a href='#' class='bg-color text-light d-block p-3 px-4 rounded-10px mb-3 relative'>
                           <h4 class='mb-0'> $company->company_title </h4>
                           <i class='icofont-long-arrow-right absolute abs-middle fs-24 end-20px'></i>
                       </a>
                   </div>
               </div>

               <div class='col-lg-9'>
                   <div class='row g-4 gx-5'>
                       <div class='col-lg-6'>
                           <h2><span class='id-color-2'>$company->tagline </span></h2>
                       </div>

                       <div class='col-lg-6'>
                           <div class='row g-4'>
                               <div class='col-sm-6'>

                                       <img src='{$imageUrl_}' class='w-100 rounded-1' alt=''>

                               </div>
                               <div class='col-sm-6'>

                                       <img src='{$imageUrl__}' class='w-100 rounded-1' alt=''>

                                  <br>
                                       <img src='{$imageUrl___}' class='w-100 rounded-1' alt=''>

                               </div>
                           </div>
                       </div>
                   </div>

                   <div class='spacer-double'></div>";

            $result_company_details = DB::table('companyinfos')
                ->join('company_descriptions', 'companyinfos.id', '=', 'company_descriptions.companyinfo_id')
                ->where('companyinfos.id', '=', $company->id)
                ->select('companyinfos.*', 'company_descriptions.*', 'company_descriptions.description_type as destype', 'company_descriptions.description as des')
                ->get();




            $product_result .=  " <div class='row g-4'>
                   <div class='col-lg-12'> <h2 class='mb-0'> <span class='id-color-2'>Infos...</span></h2> </div>";

            foreach ($result_company_details as $details) {

                $product_result .= " <div class='col-lg-4 col-md-6 wow fadeInRight' data-wow-delay='.0s'>
                                <div class='relative h-100 bg-color text-light padding30 rounded-1'>
                                    <div>
                                        <h4>$details->destype</h4>
                                        <p class='mb-0'>$details->des</p>
                                    </div>
                                </div>
                            </div>";
            }


            $product_result .= "</div>";

            $product_result .= "

           </div>
       </div>
   </section>";
        }

        if ($results->isEmpty()) {
            $product_result = "<div class='alert alert-warning text-center'>
        <strong>No data found.</strong> Please try a different search.
    </div>";
        }


        return view('raymoch.pages.project_business', compact('product_result', 'results', 'classifications', 'companyinfos', 'countries'));
    }

















    public function power_generation(Request $request)
    {
        $product_result = '';

        // Step 1: Get all industries for select filters (optional, you already do)
        $classifications = CompanyClassification::select('industry', DB::raw('MIN(id) as id'))
            ->groupBy('industry')
            ->orderBy('industry')
            ->get();

        $countries = Country::orderBy('name')->get();

        $query = CompanyInfos::query();
        $companyinfos = $query->paginate(1); // 15 record per page for full viewing and navigation


        $industry = $request->input('Natural Resources/Environmental'); // e.g., from a search form

        $results = DB::table('companyinfos')
            ->join('company_classifications', 'companyinfos.classification_id', '=', 'company_classifications.id')
            ->where('company_classifications.industry', 'LIKE', "%{$industry}%")
            ->select('companyinfos.*', 'company_classifications.industry')
            ->paginate(1)
            ->withQueryString();




        foreach ($results as $company) {
            $imageUrl_ = asset('storage/' . $company->first_picture);
            $imageUrl__ = asset('storage/' . $company->second_picture);
            $imageUrl___ = asset('storage/' . $company->third_picture);

            $product_result = "<section id='searched_content'>
       <div class='container'>
           <div class='row g-4 gx-5'>
               <div class='col-lg-3'>
                   <div class='me-lg-3'>
                       <a href='#' class='bg-color text-light d-block p-3 px-4 rounded-10px mb-3 relative'>
                           <h4 class='mb-0'> $company->company_title </h4>
                           <i class='icofont-long-arrow-right absolute abs-middle fs-24 end-20px'></i>
                       </a>
                   </div>
               </div>

               <div class='col-lg-9'>
                   <div class='row g-4 gx-5'>
                       <div class='col-lg-6'>
                           <h3><span class='id-color-2'>$company->tagline </span></h3>
                       </div>

                       <div class='col-lg-6'>
                           <div class='row g-4'>
                               <div class='col-sm-6'>

                                       <img src='{$imageUrl_}' class='w-100 rounded-1' alt=''>

                               </div>
                               <div class='col-sm-6'>

                                       <img src='{$imageUrl__}' class='w-100 rounded-1' alt=''>

                                  <br>
                                       <img src='{$imageUrl___}' class='w-100 rounded-1' alt=''>

                               </div>
                           </div>
                       </div>
                   </div>

                   <div class='spacer-double'></div>";

            $result_company_details = DB::table('companyinfos')
                ->join('company_descriptions', 'companyinfos.id', '=', 'company_descriptions.companyinfo_id')
                ->where('companyinfos.id', '=', $company->id)
                ->select('companyinfos.*', 'company_descriptions.*', 'company_descriptions.description_type as destype', 'company_descriptions.description as des')
                ->get();




            $product_result .=  " <div class='row g-4'>
                   <div class='col-lg-12'> <h2 class='mb-0'> <span class='id-color-2'>Infos...</span></h2> </div>";

            foreach ($result_company_details as $details) {

                $product_result .= " <div class='col-lg-4 col-md-6 wow fadeInRight' data-wow-delay='.0s'>
                                <div class='relative h-100 bg-color text-light padding30 rounded-1'>
                                    <div>
                                        <h4>$details->destype</h4>
                                        <p class='mb-0'>$details->des</p>
                                    </div>
                                </div>
                            </div>";
            }


            $product_result .= "</div>";

            $product_result .= "

           </div>
       </div>
   </section>";
        }


        return view('raymoch.pages.project_business', compact('product_result', 'results', 'classifications', 'companyinfos', 'countries'));
    }
}
