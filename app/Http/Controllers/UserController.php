<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Controllers\Controller;


class UserController extends Controller
{

    // public function index(Request $request)

    // {

    //     $data = User::orderBy('id','DESC')->get();

    //     return view('users.index',compact('data'))

    //         ->with('i', ($request->input('page', 1) - 1) * 5);

    // }

    public function index()
    {
        $users = User::with('roles')->paginate(10);
        return view('users.index', compact('users'));
    }
    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $roles = Role::all();
        return view('users.create', compact('roles'));
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(UserStoreRequest $request)
    {
        $data = $request->validated();

        $data['password'] = Hash::make($data['password']); // Always hash password
        $user = User::create($data);

        if ($request->has('roles')) {
            $user->assignRole($request->roles);
        }

        return redirect()->route('users.index')->with('success', 'User created successfully!');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $roles = Role::all();
        $userRoles = $user->roles->pluck('name')->toArray();

        return view('users.edit', compact('user', 'roles', 'userRoles'));
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UserUpdateRequest $request, User $user)
    {
        $data = $request->validated();

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']); // If password is empty, don't update it
        }

        $user->update($data);

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        return redirect()->route('users.index')->with('success', 'User updated successfully!');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index')->with('success', 'User deleted successfully!');
    }
}




    // public function create()

    // {

    //     $roles = Role::pluck('name','name')->all();

    //     return view('users.create',compact('roles'));

    // }


    // public function store(Request $request)

    // {


    //     $input = $request->all();

    //     $input['password'] = Hash::make($input['password']);



    //     $user = User::create($input);

    //     $user->assignRole($request->input('roles'));



    //     return redirect()->route('users.index')

    //         ->with('success','User created successfully');

    // }



    // public function show($id)

    // {

    //     $user = User::find($id);

    //     return view('users.show',compact('user'));

    // }


    // public function edit($id)

    // {

    //     $user = User::find($id);

    //     $roles = Role::pluck('name','name')->all();

    //     $userRole = $user->roles->pluck('name','name')->all();



    //     return view('users.edit',compact('user','roles','userRole'));

    // }


    // public function update(Request $request, $id)

    // {





    //     $input = $request->all();

    //     if(!empty($input['password'])){

    //         $input['password'] = Hash::make($input['password']);

    //     }else{

    //         $input = Arr::except($input,array('password'));

    //     }



    //     $user = User::find($id);

    //     $user->update($input);

    //     DB::table('model_has_roles')->where('model_id',$id)->delete();



    //     $user->assignRole($request->input('roles'));



    //     return redirect()->route('users.index')

    //         ->with('success','User updated successfully');

    // }


//}
