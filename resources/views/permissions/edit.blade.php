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
    <h2>{{ isset($permission) ? 'Edit' : 'Create' }} Permission</h2>
    <form action="{{ isset($permission) ? route('permissions.update', $permission) : route('permissions.store') }}" method="POST">
        @csrf
        @if(isset($permission)) @method('PUT') @endif

        <div class="form-group mb-3">
            <label for="name">Permission Name</label>
            <input type="text" class="form-control" name="name" value="{{ old('name', $permission->name ?? '') }}" required>
        </div>

        <button type="submit" class="btn btn-success">{{ isset($permission) ? 'Update' : 'Create' }}</button>
    </form>
</div>
@endsection
