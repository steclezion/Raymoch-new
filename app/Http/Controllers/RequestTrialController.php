<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RequestTrialController extends Controller
{
    public function show()
    {
        return view('pages.marketing.request-trial'); // simple blade mounting your React RequestTrial or plain form
    }

    // If you post trial requests via API already, you may not need the store here.
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'  => ['required', 'string', 'max:191'],
            'email' => ['required', 'email', 'max:191'],
            'note'  => ['nullable', 'string', 'max:2000'],
        ]);

        // TODO: persist, notify, etc.
        return back()->with('status', 'Thanks! We will reach out soon.');
    }
}
