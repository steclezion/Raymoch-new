<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
     return view('raymoch.auth.login');
    }

    public function loginPost(Request $request)
    {
        $request->validate([
                   'email' => 'required|email',
                   'password' => "required",
                           ]);



          if (Auth::attempt(["email"=>$request->email,"password"=>$request->password]))
          {
          return redirect()->route('dashboard', 'You have logged in!');
          //return redirect()->intended('dashboard', 'You have logged in!');
         // return redirect('/dashboard'); // Or wherever you want
          }
           return redirect()->back()->with("error","The email address or password you entered is incorrect. Please try again!!");

        }




   Public function logout()
    {
      Auth::logout();
      return redirect()->route('login');
    }

    public function register()
    {
      return view('raymoch.auth.register');
    }


    public function registerPost(Request $request)
    {
    $request->validate([
      'name' => 'required',
      'email' => 'required|email|unique:users,email',
      'password' => "required|confirmed|min:6",

    ]);
  // dd($request->all());
 $user = User::create([
    "name" => $request->name,
     "email" => $request->email,
     "password" => Hash::make($request->password),
    "remember_token" => $request->_token
    ]);
//dd($user);
 Auth::login($user);
return redirect()->route('dashboard')->with('Success','User registered successfuly');


    }
    public function dashboard(Request $request)
    {

    return view('Admin_LTE.dashboard');

    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
