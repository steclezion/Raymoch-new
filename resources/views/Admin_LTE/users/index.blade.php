@extends('layouts.app')

@section('stylesheets')
    <link rel="stylesheet" href="{{asset('plugins/datatables-bs4/css/dataTables.bootstrap4.min.css')}}">
    <link rel="stylesheet" href="{{asset('plugins/datatables-responsive/css/responsive.bootstrap4.min.css')}}">
    <link rel="stylesheet" href="{{asset('plugins/datatables-buttons/css/buttons.bootstrap4.min.css')}}">
@endsection
@section('content')

    <section class="content">
        <div class="container-fluid">
            <div class="row">

                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title"><h2>Users Management</h2></h3>
                            <div class="card-tools ">
                                <a class="btn btn-success" href="{{ route('users.create') }}"> Create New User</a>

                            </div>

                        </div>

                        <div class="card-body">
                            <table id="example1"
                                   class="table table-bordered table-striped dataTable no-footer dtr-inline"
                                   role="grid"
                                   aria-describedby="example1_info">

                                <thead>
                                <tr role="row">
                                    <th class="sorting sorting_asc" tabindex="0" aria-controls="example1" rowspan="1"
                                        colspan="1"
                                        aria-label="Supplier Name: activate to sort column descending"
                                        aria-sort="ascending"
                                        width="5%">No
                                    </th>
                                    <th class="sorting sorting_asc" tabindex="0" aria-controls="example1" rowspan="1"
                                        colspan="1"
                                        aria-label="Supplier Name: activate to sort column descending"
                                        aria-sort="ascending"
                                        width="20%">Name
                                    </th>
                                    <th class="sorting sorting_asc" tabindex="0" aria-controls="example1" rowspan="1"
                                        colspan="1"
                                        aria-label="Supplier Name: activate to sort column descending"
                                        aria-sort="ascending"
                                        width="20%">Email
                                    </th>
                                    <th class="sorting sorting_asc" tabindex="0" aria-controls="example1" rowspan="1"
                                        colspan="1"
                                        aria-label="Supplier Name: activate to sort column descending"
                                        aria-sort="ascending"
                                        width="30%">Roles
                                    </th>

                                    <th class="sorting" tabindex="0" aria-controls="example1" rowspan="1" colspan="1"
                                        aria-label="Actions: activate to sort column ascending" width="25%">Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                @foreach ($data as $key => $user)

                                    <tr>

                                        <td>{{ ++$i }}</td>

                                        <td>{{ $user->first_name }} {{ $user->middle_name }}</td>

                                        <td>{{ $user->email }}</td>

                                        <td>

                                            @if(!empty($user->getRoleNames()))

                                                @foreach($user->getRoleNames() as $v)

                                                    <label class="badge badge-success">{{ $v }}</label>

                                                @endforeach

                                            @endif

                                        </td>

                                        <td>

                                            <a class="btn btn-info" href="{{ route('users.show',$user->id) }}">Show</a>

                                            <a class="btn btn-primary"
                                               href="{{ route('users.edit',$user->id) }}">Edit</a>

                                            {!! Form::open(['method' => 'DELETE','route' => ['users.destroy', $user->id],'style'=>'display:inline']) !!}

                                            {!! Form::submit('Delete', ['class' => 'btn btn-danger']) !!}

                                            {!! Form::close() !!}

                                        </td>

                                    </tr>


                                @endforeach
                                </tbody>

                            </table>


                            {{--    {!! $data->render() !!}--}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

@endsection
@section('scripts')
    <!-- DataTables  & Plugins -->
    <script src="{{asset('plugins/datatables/jquery.dataTables.min.js')}}"></script>
    <script src="{{asset('plugins/datatables-bs4/js/dataTables.bootstrap4.min.js')}}"></script>
    <script src="{{asset('plugins/datatables-responsive/js/dataTables.responsive.min.js')}}"></script>
    <script src="{{asset('plugins/datatables-responsive/js/responsive.bootstrap4.min.js')}}"></script>
    <script src="{{asset('plugins/datatables-buttons/js/dataTables.buttons.min.js')}}"></script>
    <script src="{{asset('plugins/datatables-buttons/js/buttons.bootstrap4.min.js')}}"></script>
    <script src="{{asset('plugins/jszip/jszip.min.js')}}"></script>
    <script src="{{asset('plugins/pdfmake/pdfmake.min.js')}}"></script>
    <script src="{{asset('plugins/pdfmake/vfs_fonts.js')}}"></script>
    <script src="{{asset('plugins/datatables-buttons/js/buttons.html5.min.js')}}"></script>
    <script src="{{asset('plugins/datatables-buttons/js/buttons.print.min.js')}}"></script>
    <script src="{{asset('plugins/datatables-buttons/js/buttons.colVis.min.js')}}"></script>
    <script>
        $(function () {
            $("#example1").DataTable({
                "responsive": true, "lengthChange": false, "autoWidth": false,
                "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
            }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
            $('#example2').DataTable({
                "paging": true,
                "lengthChange": false,
                "searching": false,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true,
            });
        });
    </script>

@endsection