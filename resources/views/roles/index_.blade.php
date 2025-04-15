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
    <a href="{{ route('roles.create') }}" class="btn btn-primary mb-3">Create Role</a>
    <table class="table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Permissions</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($roles as $role)
                <tr>
                    <td>{{ $role->name }}</td>
                    <td>{{ implode(', ', $role->permissions->pluck('name')->toArray()) }}</td>
                    <td>
                        <a href="{{ route('roles.edit', $role) }}" class="btn btn-sm btn-warning">Edit</a>
                        <form action="{{ route('roles.destroy', $role) }}" method="POST" class="d-inline">
                            @csrf @method('DELETE')
                            <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Delete this role?')">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
