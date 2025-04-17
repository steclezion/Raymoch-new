<?php

namespace App\Http\Controllers;

use App\Models\HomeWelcomeThirdPage;
use Illuminate\Http\Request;

class HomeWelcomeThirdPageController extends Controller
{
    public function index()
    {
        $pages = HomeWelcomeThirdPage::latest()->get();
        return view('home_welcome_third_pages.index', compact('pages'));
    }

    public function create()
    {
        return view('home_welcome_third_pages.form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        HomeWelcomeThirdPage::create($request->all());

        return redirect()->route('home-welcome-third-page.index')->with('success', 'Page created successfully.');
    }

    public function edit(HomeWelcomeThirdPage $home_welcome_third_page)
    {
        return view('home_welcome_third_pages.form', ['page' => $home_welcome_third_page]);
    }

    public function update(Request $request, HomeWelcomeThirdPage $home_welcome_third_page)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $home_welcome_third_page->update($request->all());

        return redirect()->route('home-welcome-third-page.index')->with('success', 'Page updated successfully.');
    }

    public function destroy(HomeWelcomeThirdPage $home_welcome_third_page)
    {
        $home_welcome_third_page->delete();

        return redirect()->route('home-welcome-third-page.index')->with('success', 'Page deleted successfully.');
    }
}
