<?php

namespace App\Http\Controllers;

class PolicyController extends Controller
{
    public function privacy()
    {
        return view('pages.policies.privacy');   // create these blade files
    }

    public function terms()
    {
        return view('pages.policies.terms');
    }

    public function cookies()
    {
        return view('pages.policies.cookies');
    }
}
