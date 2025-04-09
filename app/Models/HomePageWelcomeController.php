<?php
namespace App\Http\Controllers;

use App\Models\HomePageWelcome;
use App\Http\Requests\StoreHomePageWelcomeRequest;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Facades\Storage;



class HomePageWelcomeController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $data = HomePageWelcome::latest();
            return DataTables::of($data)
                ->addColumn('action', function($row){
                    return '
                        <button class="btn btn-sm btn-primary editBtn" data-id="'.$row->id.'">Edit</button>
                        <button class="btn btn-sm btn-danger deleteBtn" data-id="'.$row->id.'">Delete</button>
                    ';
                })
                ->rawColumns(['action'])
                ->make(true);
        }

        return view('home_page_welcome.index');
    }

    public function store(StoreHomePageWelcomeRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('first_picture')) {
            $data['first_picture'] = $request->file('first_picture')->store('uploads', 'public');
        }

        if ($request->hasFile('second_picture')) {
            $data['second_picture'] = $request->file('second_picture')->store('uploads', 'public');
        }

        $record = HomePageWelcome::create($data);

        return response()->json(['success' => true, 'message' => 'Record created successfully!']);
    }

    public function update(StoreHomePageWelcomeRequest $request, $id)
    {
        $record = HomePageWelcome::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('first_picture')) {
            $data['first_picture'] = $request->file('first_picture')->store('uploads', 'public');
        }

        if ($request->hasFile('second_picture')) {
            $data['second_picture'] = $request->file('second_picture')->store('uploads', 'public');
        }

        $record->update($data);

        return response()->json(['success' => true, 'message' => 'Record updated successfully!']);
    }

    public function destroy($id)
    {
        $record = HomePageWelcome::findOrFail($id);
        $record->delete();

        return response()->json(['success' => true, 'message' => 'Record deleted successfully!']);
    }
}
