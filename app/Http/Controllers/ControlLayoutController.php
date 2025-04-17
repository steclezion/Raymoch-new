<?php

namespace App\Http\Controllers;

use App\Models\HomePageWelcome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class ControlLayoutController extends Controller
{
    //
public function index()
{

    $HomePageWelcome = new HomePageWelcome;

    $Selected_Home_Page = DB::select('select * from home_page_welcomes where status = ?', ['active']);
   $Selected_Home_Page_Third = DB::select('select * from home_welcome_third_pages where status = ?', ['active']);
   $Selected_Home_Page_Second_p = DB::select('SELECT * FROM home_welcome_second_pages WHERE status = ? AND title=?',['active','Power Generation'] );
   $Selected_Home_Page_Second_w = DB::select('SELECT * FROM home_welcome_second_pages WHERE status = ? AND title=?',['active','Whole Sale'] );
   $Selected_Home_Page_Second_c = DB::select('SELECT * FROM home_welcome_second_pages WHERE status = ? AND title=?',['active','Construction'] );
   $Selected_Home_Page_Second_h = DB::select('SELECT * FROM home_welcome_second_pages WHERE status = ? AND title=?',['active','Hotel and Dining Services'] );
   $Selected_Home_Page_Second_m = DB::select('SELECT * FROM home_welcome_second_pages WHERE status = ? AND title=?',['active','Manufacturing'] );
   $Selected_Home_Page_Second_r = DB::select('SELECT * FROM home_welcome_second_pages WHERE status = ? AND title=?',['active','Retail'] );
   $Selected_Home_Page_Second_s = DB::select('SELECT * FROM home_welcome_second_pages WHERE status = ? AND title=?',['active','Service'] );
   $Selected_Home_Page_Second_e = DB::select('SELECT * FROM home_welcome_second_pages WHERE status = ? AND title=?',['active','E-Commerce'] );





    return  view('raymoch.pages.index',[

        'HomePageActive' => $Selected_Home_Page,
        'Selected_Home_Page_Second_p' => $Selected_Home_Page_Second_p,
        'Selected_Home_Page_Second_w' => $Selected_Home_Page_Second_w,
        'Selected_Home_Page_Second_c' => $Selected_Home_Page_Second_c,
        'Selected_Home_Page_Second_h' => $Selected_Home_Page_Second_h,
        'Selected_Home_Page_Second_m' => $Selected_Home_Page_Second_m,
        'Selected_Home_Page_Second_r' => $Selected_Home_Page_Second_r,
        'Selected_Home_Page_Second_s' => $Selected_Home_Page_Second_s,
        'Selected_Home_Page_Second_e' => $Selected_Home_Page_Second_e,
        'Selected_Home_Page_Third' =>    $Selected_Home_Page_Third,

        ]);

}

}
