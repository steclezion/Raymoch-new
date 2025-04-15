@extends('layouts_admin.app')



@section('content')
    <section class="content">
        <div class="container-fluid">
            <div class="row">

                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title"><h2>Edit Role</h2></h3>
                            <div class="card-tools">
                                <a href="{{ route('roles.index') }}" class="btn btn-primary">
                                    <i class="fa fa-arrow-alt-circle-left"></i> Back
                                </a>

                            </div>
                        </div>


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




                        <form action="{{ route('roles.update', $role->id) }}" method="POST">
                            @csrf
                            @method('PATCH')

                            <div class="card-body">
                                <div class="form-group">
                                    <label for="name"><strong>Name:</strong></label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        class="form-control"
                                        placeholder="Name"
                                        value="{{ old('name', $role->name) }}"
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
                                                {{ in_array($value->id, $rolePermissions) ? 'checked' : '' }}
                                            >
                                            <label class="form-check-label" for="perm_{{ $value->id }}">
                                                {{ $value->name }}
                                            </label>
                                        </div>
                                    @endforeach
                                </div>

                                <div class="card-footer mt-3">
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-edit"></i> Update
                                    </button>
                                </div>
                            </div>
                        </form>



                        </div>
                    </div>
                </div>
            </div>
        </div>

    </section>






@endsection



