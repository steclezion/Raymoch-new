<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Validate_user extends Controller
{
    //
    public function validate_user(Request $request)
    {

        $requests = [1, 2, 3, 5, 7, 11];  // number of attempts to login 
        $result = [];

        for ($index = 0; $index <= 2; $index++) {

            if ($requests[$index] == $requests[$index + 1]) {
                $test = True;
                return array_push($result, $test);
            } else {
                $test = False;
                return array_push($result, $test);
            }
        }
    }
}
