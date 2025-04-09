<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Http\Requests\StoreRoleRequest;




class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();
       // dd($roles);

        return view('roles.index', compact('roles'));
    }

    public function create()
    {
        $permissions = Permission::all();
        // dd( $permissions);
        return view('roles.create', compact('permissions'));
    }

    public function store(StoreRoleRequest $request)
    {

     //   dd($request->all());

        $role = Role::create(['name' => $request->name]);
        $role->syncPermissions($request->permissions);

        return redirect()->route('roles.index')->with('success', 'Role created successfully.');
    }

    public function edit(Role $role)
    {
        $permissions = Permission::all();
        $rolePermissions = $role->permissions->pluck('name')->toArray();

        return view('roles.edit', compact('role', 'permissions', 'rolePermissions'));
    }

    public function update(StoreRoleRequest $request, Role $role)
    {
        $role->update(['name' => $request->name]);

        $permissions = collect($request->permissions ?? [])->filter()->toArray();
        $role->syncPermissions($permissions);

        return redirect()->route('roles.index')->with('success', 'Role updated successfully.');    }

    public function destroy(Role $role)
    {
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }

}
