@extends('layouts_admin.app')
@section('content')
    <section class="content">
        <div class="container-fluid">
            <div class="row">

                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title"><h2> Create Roles</h2></h3>
                            <div class="card-tools">

                                <a href="{{ route('roles.index') }}"> Back</a>

                            </div>
                        </div>
                        <!-- /.card-header -->


                        @if (count($errors) > 0)

                            <div class="alert alert-danger">

                                <strong>Whoops!</strong> There were some problems with your input.<br><br>

                                <ul>

                                    @foreach ($errors->all() as $error)

                                        <li>{{ $error }}</li>

                                    @endforeach

                                </ul>

                            </div>

                        @endif




                        <div class="card-body">
                            <form action="{{ route('roles.store') }}" method="POST">
                                @csrf

                                <div class="form-group">
                                    <label for="name">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        class="form-control"
                                        placeholder="Name"
                                        value="{{ old('name') }}"
                                    >
                                </div>

                                <div class="form-group mt-3">
                                    <strong>Permission:</strong><br>

                                    @foreach($permission as $value)
                                        <div class="form-check">
                                            <input
                                                type="checkbox"
                                                name="permission[]"
                                                value="{{ $value->id }}"
                                                class="form-check-input"
                                                id="perm_{{ $value->id }}"
                                            >
                                            <label class="form-check-label" for="perm_{{ $value->id }}">
                                                {{ $value->name }}
                                            </label>
                                        </div>
                                    @endforeach
                                </div>

                                <div class="card-footer mt-3">
                                    <button type="submit" class="btn btn-success">Submit</button>
                                </div>
                            </form>                    </div>

                        </div>

                    </div>
                </div>

            </div>








@endsection
