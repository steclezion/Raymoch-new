<?php
namespace App\Http\Controllers;

use App\Http\Requests\StoreHomePageWelcomeRequest;
use App\Models\HomePageWelcome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HomePageWelcomeController extends Controller
{
    public function index()
    {
        return view('home_page_welcomes.index');
    }

    public function show(HomePageWelcome $homePageWelcome)
    {
        return response()->json($homePageWelcome);
    }



public function update(StoreHomePageWelcomeRequest $request, HomePageWelcome $homePageWelcome)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string|max:2575',
        'first_picture' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
        'second_picture' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
        'status' => 'required|string',
    ]);




    $data = $request->validated();

    if (strtolower($data['status']) === 'active') {
     $data_active_update = DB::table('home_page_welcomes')
                                 ->where('id','!=', $request->id)
                                 ->update(['status' =>'inactive']);

    }

    // Handle first picture update
    if ($request->hasFile('first_picture')) {
        // Delete old image if exists
        if ($homePageWelcome->first_picture) {
            Storage::disk('public')->delete($homePageWelcome->first_picture);
        }

        // Save new file
        $validated['first_picture'] = $request->file('first_picture')->store('welcome_images', 'public');
    }

    // Handle second picture update
    if ($request->hasFile('second_picture')) {
        if ($homePageWelcome->second_picture) {
            Storage::disk('public')->delete($homePageWelcome->second_picture);
        }
      $validated['second_picture'] = $request->file('second_picture')->store('welcome_images', 'public');
    }

    // Update the database record
    $homePageWelcome->update($validated);



    return response()->json(['success' => true]);
}



    public function data()
    {
        $data = HomePageWelcome::latest()->get();
        return response()->json(['data' => $data]);
    }



    public function store(StoreHomePageWelcomeRequest $request)
    {
        $data = $request->validated();
      //  dd($data);

   if ($request->hasFile('first_picture')) {
         //   $data['first_picture'] = $request->file('first_picture')->store('welcome_images', 'public');
            try {
                $data['first_picture'] = $request->file('first_picture')->store('welcome_images', 'public');
                 } catch (\Exception $e) {
                return response()->json([
                    'message' => 'The First picture failed to upload----.',
                    'error' => $e->getMessage()
                ], 422);
            }
        }

        // if ($request->hasFile('second_picture')) {
        //     $data['second_picture'] = $request->file('second_picture')->store('welcome_images', 'public');
        // }

        if ($request->hasFile('second_picture')) {
            try {
                $data['second_picture'] = $request->file('second_picture')->store('welcome_images', 'public');
                 } catch (\Exception $e) {
                return response()->json([
                    'message' => 'The second picture failed to upload.',
                    'error' => $e->getMessage()
                ], 422);
            }
        }


       $post  =  HomePageWelcome::create($data);

        if (strtolower($data['status']) === 'active') {
            $data_active_update = DB::table('home_page_welcomes')
                ->where('id', '!=', $post->id)
                ->update(['status' => 'inactive']);
        }


        return response()->json(['success' => true]);
    }



    public function destroy(HomePageWelcome $homePageWelcome)
    {
        if ($homePageWelcome->first_picture) {
            Storage::disk('public')->delete($homePageWelcome->first_picture);
        }
        if ($homePageWelcome->second_picture) {
            Storage::disk('public')->delete($homePageWelcome->second_picture);
        }

        $homePageWelcome->delete();

        return response()->json(['success' => true]);
    }
}
