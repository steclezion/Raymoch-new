<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Http\Requests\StoreRoleRequest;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Support\Facades\DB;






class RoleController extends Controller

{
    use ValidatesRequests;

    /**

     * Display a listing of the resource.

     *

     * @return \Illuminate\Http\Response

     */

    function __construct()

    {

        // $this->middleware('permission:role-list|role-create|role-edit|role-delete', ['only' => ['index','store']]);

        // $this->middleware('permission:role-create', ['only' => ['create','store']]);

        // $this->middleware('permission:role-edit', ['only' => ['edit','update']]);

        // $this->middleware('permission:role-delete', ['only' => ['destroy']]);

    }



    /**

     * Display a listing of the resource.

     *

     * @return \Illuminate\Http\Response

     */

    public function index(Request $request)

    {

        $roles = Role::orderBy('id','DESC')->paginate(5);

        return view('roles.index',compact('roles'))

            ->with('i', ($request->input('page', 1) - 1) * 5);

    }



    /**

     * Show the form for creating a new resource.

     *

     * @return \Illuminate\Http\Response

     */

    public function create()

    {

        $permission = Permission::get();

   //     dd($permission);

        return view('roles.create',compact('permission'));

    }



    /**

     * Store a newly created resource in storage.

     *

     * @param  \Illuminate\Http\Request  $request

     * @return \Illuminate\Http\Response

     */

    public function store(Request $request)

    {

        $this->validate($request, [

            'name' => 'required|unique:roles,name',

            'permission' => 'required',

        ]);


    // Create the role
    $role = Role::create(['name' => $request->input('name')]);

   // Convert permission IDs to names before syncing

    $permissionNames = Permission::whereIn('id', $request->input('permission'))->pluck('name');
    $role->syncPermissions($permissionNames);
    return redirect()->route('roles.index')->with('success', 'Role created successfully');



    }

    /**

     * Display the specified resource.

     *

     * @param  int  $id

     * @return \Illuminate\Http\Response

     */

    public function show($id)

    {

        $role = Role::find($id);

        $rolePermissions = Permission::join("role_has_permissions","role_has_permissions.permission_id","=","permissions.id")

            ->where("role_has_permissions.role_id",$id)

            ->get();



        return view('roles.show',compact('role','rolePermissions'));

    }



    /**

     * Show the form for editing the specified resource.

     *

     * @param  int  $id

     * @return \Illuminate\Http\Response

     */

    public function edit($id)

    {

        $role = Role::find($id);

        $permission = Permission::get();

        $rolePermissions = DB::table("role_has_permissions")->where("role_has_permissions.role_id",$id)

            ->pluck('role_has_permissions.permission_id','role_has_permissions.permission_id')

            ->all();




        return view('roles.edit',compact('role','permission','rolePermissions'));

    }



    /**

     * Update the specified resource in storage.

     *

     * @param  \Illuminate\Http\Request  $request

     * @param  int  $id

     * @return \Illuminate\Http\Response

     */

    public function update(Request $request, $id)

    {

        $this->validate($request, [
            'name' => 'required',
            'permission' => 'required',
        ]);

        $role = Role::find($id);
        $role->name = $request->input('name');
        $role->save();

        // Convert IDs to permission names
        $permissionNames = Permission::whereIn('id', $request->input('permission'))->pluck('name');
        $role->syncPermissions($permissionNames);

        return redirect()->route('roles.index')
            ->with('success', 'Role updated successfully');

    }

    /**

     * Remove the specified resource from storage.

     *

     * @param  int  $id

     * @return \Illuminate\Http\Response

     */

    public function destroy($id)

    {

        DB::table("roles")->where('id',$id)->delete();

        return redirect()->route('roles.index')

            ->with('success','Role deleted successfully');

    }

}




// class RoleController extends Controller
// {
//     public function index()
//     {
//         $roles = Role::with('permissions')->get();
//        // dd($roles);

//         return view('roles.index', compact('roles'));
//     }

//     public function create()
//     {
//         $permissions = Permission::all();
//         // dd( $permissions);
//         return view('roles.create', compact('permissions'));
//     }

//     public function store(StoreRoleRequest $request)
//     {

//      //   dd($request->all());

//         $role = Role::create(['name' => $request->name]);
//         $role->syncPermissions($request->permissions);

//         return redirect()->route('roles.index')->with('success', 'Role created successfully.');
//     }

//     public function edit(Role $role)
//     {
//         $permissions = Permission::all();
//         $rolePermissions = $role->permissions->pluck('name')->toArray();

//         return view('roles.edit', compact('role', 'permissions', 'rolePermissions'));
//     }

//     public function update(StoreRoleRequest $request, Role $role)
//     {
//         $role->update(['name' => $request->name]);

//         $permissions = collect($request->permissions ?? [])->filter()->toArray();
//         $role->syncPermissions($permissions);

//         return redirect()->route('roles.index')->with('success', 'Role updated successfully.');    }

//     public function destroy(Role $role)
//     {
//         $role->delete();
//         return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
//     }

// }
