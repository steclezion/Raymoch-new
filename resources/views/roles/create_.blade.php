@extends('layouts_admin.app')
@section('content')
<!-- Content Wrapper. Contains page content -->
<link rel="stylesheet" href="../../plugins/fontawesome-free/css/all.min.css">
<!-- icheck bootstrap -->
<link rel="stylesheet" href="../../plugins/icheck-bootstrap/icheck-bootstrap.min.css">
<!-- Theme style -->
<link rel="stylesheet" href="../../dist/css/adminlte.min.css">
<script src="{{asset('plugins/jquery/jquery.min.js')}}"></script>

@section('content')
<div class="container">

    <form action="{{ isset($role) ? route('roles.update', $role) : route('roles.store') }}" method="POST">
        @csrf
        @if(isset($role)) @method('PUT') @endif

        <div class="mb-3">
            <label for="name" class="form-label">Role Name</label>
            <input type="text" name="name" class="form-control" value="{{ old('name', $role->name ?? '') }}" required>
        </div>

        <div class="mb-3">
            <label>Assign Permissions</label><br>
            @foreach($permissions as $permission)
                <div class="form-check form-check-inline">
                    <input type="checkbox" name="permissions[]" value="{{ $permission->name }}"
                    {{ isset($rolePermissions) && in_array($permission->name, $rolePermissions) ? 'checked' : '' }}
                    class="form-check-input">
                    <label class="form-check-label">{{ $permission->name }}</label>
                </div>
            @endforeach
        </div>

        <button type="submit" class="btn btn-success">{{ isset($role) ? 'Update' : 'Create' }}</button>
        <a href="{{ url('/roles') }}" type="button" class="btn btn-primary"><span class="far fa-arrow-alt-circle-left"> </span> Back</a>

    </form>
</div>
@endsection

