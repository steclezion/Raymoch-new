<?php
namespace App\Http\Controllers;
use App\Models\CompanyClassification;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;
class CompanyClassificationController extends Controller
{
    public function index()
    {
        $classifications = CompanyClassification::all();
        return view('company_classifications.index', compact('classifications'));
    }

    public function create()
    {
        return view('company_classifications.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'industry' => 'required|string|max:255',
            'business_type' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string'
        ]);

        CompanyClassification::create($request->all());

        return redirect()->route('company_classifications.index')->with('success', 'Created successfully.');
    }

    public function edit($id)
    {
        $classification = CompanyClassification::findOrFail($id);
        return view('company_classifications.create', compact('classification'))->with('editing', true);
    }

    public function update(Request $request, $id)
    {
        $classification = CompanyClassification::findOrFail($id);

        $request->validate([
            'business_type' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string'
        ]);

        $classification->update($request->all());

        return redirect()->route('company_classifications.index')->with('success', 'Updated successfully.');
    }

    public function destroy($id)
    {
        CompanyClassification::destroy($id);
        return redirect()->route('company_classifications.index')->with('success', 'Deleted successfully.');
    }



    public function import(Request $request)
    {
        $request->validate([
            'import_file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        try {
            $data = \Maatwebsite\Excel\Facades\Excel::toCollection(null, $request->file('import_file'));

            $rows = $data[0]; // First sheet

            foreach ($rows as $row) {
                $industry = $row[0] ?? null;

                for ($i = 1; $i <= 13; $i++) {
                    $businessType = $row[$i] ?? null;

                    if ($industry && $businessType) {
                        \App\Models\CompanyClassification::create([
                            'industry' => $industry,
                            'business_type' => $businessType,
                            'description' => '',
                            'status' => 'active',
                        ]);
                    }
                }
            }

            return back()->with('success', 'Import completed successfully.');

        } catch (\Throwable $e) {
            return back()->with('error', 'Import failed: ' . $e->getMessage());
        }
    }

}
