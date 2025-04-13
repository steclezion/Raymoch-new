@extends('layouts_admin.app')
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
                        <h3 class="card-title"><h2>Role Management</h2></h3>
                        {{-- @can('role-create') --}}
                            <div class="card-tool ">
                                <a class="btn btn-primary float-left" href="{{ route('roles.create') }}"> Create New Role</a>
                            </div>
                        {{-- @endcan --}}
                    </div>
                    <!-- /.card-header -->


                    <div class="card-body">
                        <table id="example1" class="table table-bordered table-striped dataTable no-footer dtr-inline"
                               role="grid"
                               aria-describedby="example1_info">



                            <thead>
                            <tr role="row">
                                <th class="sorting sorting_asc" tabindex="0" aria-controls="example1" rowspan="1"
                                    colspan="1"
                                    aria-label="Supplier Name: activate to sort column descending" aria-sort="ascending"
                                    width="10%">No
                                </th>
                                <th class="sorting sorting_asc" tabindex="0" aria-controls="example1" rowspan="1"
                                    colspan="1"
                                    aria-label="Supplier Name: activate to sort column descending" aria-sort="ascending"
                                    width="10%">Name
                                </th>

                                <th class="sorting sorting_asc" tabindex="0" aria-controls="example1" rowspan="1"
                                colspan="1"
                                aria-label="Supplier Name: activate to sort column descending" aria-sort="ascending"
                                width="10%">Permission
                            </th>


                                <th class="sorting" tabindex="0" aria-controls="example1" rowspan="1" colspan="1"
                                    aria-label="Actions: activate to sort column ascending" width="10%">Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody>


                            @foreach ($roles as $key => $role)

                                <tr>

                                    <td>{{ ++$i }}</td>

                                    <td>{{ $role->name }}</td>
                                    <td>
                                        @foreach($role->permissions as $permission)
                                            <span class="badge bg-info text-dark">{{ $permission->name }}</span>
                                        @endforeach
                                    </td>

                                    <td>

                                        <a class="btn btn-info btn-sm" href="{{ route('roles.show',$role->id) }}">Show</a>

                                        {{-- @can('role-edit') --}}


                                            <a class="btn btn-warning btn-sm"
                                               href="{{ route('roles.edit',$role->id) }}">Edit</a>
                                        {{-- @endcan


                                        @can('role-delete') --}}

                                        <form action="{{ route('roles.destroy', $role->id) }}" method="POST" style="display:inline">
                                            @csrf
                                            @method('DELETE')
                                            <button
                                                type="submit"
                                                class="btn btn-danger btn-sm"
                                                onclick="return confirm('Are you sure you want to delete this role?')"
                                            >
                                                Delete
                                            </button>
                                        </form>




                                        {{-- @endcan --}}
                                    </td>

                                </tr>

                            @endforeach
                            </tbody>
                        </table>


                        {{--            {!! $roles->render() !!}--}}

                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection
