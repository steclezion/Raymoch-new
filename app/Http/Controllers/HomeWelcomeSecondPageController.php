<?php

namespace App\Http\Controllers;

use \Log;
use App\Http\Requests\StoreHomeWelcomeSecondPageRequest;
use App\Models\HomeWelcomeSecondPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
//use Illuminate\Support\Facades\Log;

class HomeWelcomeSecondPageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //

        $pages = HomeWelcomeSecondPage::orderBy('id', 'asc')->get();
        return view('home_welcome_second_page.index', compact('pages'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return view('home_welcome_second_page.create');
    }

    /**
     * Store a newly created resource in storage.
     */


    public function store(StoreHomeWelcomeSecondPageRequest $request)
    {
        $data = $request->validated();

        try {
            if ($request->hasFile('picture')) {
                $data['picture'] = $request->file('picture')->store('second_welcome_images', 'public');
            }

            HomeWelcomeSecondPage::create($data);

            return redirect()
                ->route('home-welcome-second-page.index')
                ->with('success', 'Entry created successfully.');

        } catch (\Exception $e) {

            // Log the error (optional for debugging)
            logger()->error('File upload or save failed: ' . $e->getMessage());
            return redirect()
                ->back()
                ->withInput()
                ->with('danger', 'Failed to upload image or save entry. Please try again.');
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(HomeWelcomeSecondPage $homeWelcomeSecondPage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(HomeWelcomeSecondPage $homeWelcomeSecondPage)
    {
        return view('home_welcome_second_page.edit', compact('homeWelcomeSecondPage'));
    }

    /**
     * Update the specified resource in storage.
     */
   public function update(StoreHomeWelcomeSecondPageRequest $request, HomeWelcomeSecondPage $homeWelcomeSecondPage)
{
        $data = $request->validated();

 try {
        if ($request->hasFile('picture')) {
            // Delete old picture if exists
            if ($homeWelcomeSecondPage->picture) {
                Storage::disk('public')->delete($homeWelcomeSecondPage->picture);
            }

            // Try uploading new one
            $data['picture'] = $request->file('picture')->store('second_welcome_images', 'public');
        }

        $homeWelcomeSecondPage->update($data);

        return redirect()
            ->route('home-welcome-second-page.index')
            ->with('success', 'Entry updated successfully.');
    } catch (\Exception $e) {
        dd(logger()->error('Update failed: ' . $e->getMessage()) );

        return redirect()
            ->route('home-welcome-second-page.index')
            ->with('danger', 'Failed to update entry. Please try again.');
    }
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HomeWelcomeSecondPage $homeWelcomeSecondPage)
    {
        if ($homeWelcomeSecondPage->picture) {
            Storage::disk('public')->delete($homeWelcomeSecondPage->picture);
        }
        $homeWelcomeSecondPage->delete();

        return redirect()->route('home-welcome-second-page.index')->with('success', 'Entry deleted successfully.');
    }
}
