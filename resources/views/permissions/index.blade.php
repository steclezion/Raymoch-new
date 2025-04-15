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

<section class="content">
    <div class="container-fluid">
        <div class="row">

            <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><h2>Permission Management</h2></h3>

    <a href="{{ route('permissions.create') }}" class="btn btn-primary mb-3">Create New Permission</a>
    <div class="card-body">
        <table id="example1" class="table table-bordered table-striped dataTable no-footer dtr-inline"
               role="grid"
               aria-describedby="example1_info">
        <thead>
            <tr>
                <th>Name</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($permissions as $permission)
                <tr>
                    <td>{{ $permission->name }}</td>
                    <td>
                        <a href="{{ route('permissions.edit', $permission) }}" class="btn btn-warning btn-sm">Edit</a>
                        <form action="{{ route('permissions.destroy', $permission) }}" method="POST" class="d-inline">
                            @csrf @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Delete this permission?')">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
</div>
</div>
</div>
</div>
</div>

</div>
@endsection
