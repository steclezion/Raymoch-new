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
                    <div class="card card-primary ">
                        <div class="card-header">
                            <h3 class="card-title"><strong>Completed Assessment Reports List</strong>
                            </h3>

                        </div>
                        <!-- /.card-header -->
                        <div class="card-body">


                            <div id="example1_wrapper"
                                 class="dataTables_wrapper dt-bootstrap4 no-footer ">
                                <table id="example1"
                                       class="table table-bordered table-striped dataTable no-footer dtr-inline"
                                       role="grid" aria-describedby="example1_info">

                                    <thead>
                                    <tr role="row">
                                        <th class="sorting sorting_asc" tabindex="0"
                                            aria-controls="example1" rowspan="1" colspan="1"
                                            aria-label="Serial Number: activate to sort column descending"
                                            aria-sort="ascending" width="3%">S.N
                                        </th>
                                        <th class="sorting" tabindex="0"
                                            aria-controls="example1" rowspan="1" colspan="1"
                                            aria-label="Title: activate to sort column ascending"
                                            width="15%" id="received"> Assessor
                                        </th>
                                        <th class="sorting sorting_asc" tabindex="0"
                                            aria-controls="example1" rowspan="1" colspan="1"
                                            aria-label="Reference Number: activate to sort column descending"
                                            aria-sort="ascending" width="21%"> Drug Name
                                        </th>
                                        <th class="sorting" tabindex="0"
                                            aria-controls="example1" rowspan="1" colspan="1"
                                            aria-label="Title: activate to sort column ascending"
                                            width="20%" id="subject"> Company
                                        </th>
                                        <th class="sorting" tabindex="0"
                                            aria-controls="example1" rowspan="1" colspan="1"
                                            aria-label="Title: activate to sort column ascending"
                                            width="13%"> Eval. Start Date
                                        </th>
                                        <th class="sorting" tabindex="0"
                                            aria-controls="example1" rowspan="1" colspan="1"
                                            aria-label="Title: activate to sort column ascending"
                                            width="13%" id="received"> End Date
                                        </th>


                                        <th rowspan="1" colspan="1" width="20%">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    @php($i=1)
                                    @foreach($completed_assessment_assignments as $completed_assessment_assignment)
                                        <tr role="row" class="odd">
                                            <td>{{$i++}}</td>
                                            <td>{{$completed_assessment_assignment->first_name}} {{$completed_assessment_assignment->middle_name}}</td>


                                            <td>Drug Name</td>
                                            <td>Company</td>

                                            <td>{{$completed_assessment_assignment->start_time}}</td>
                                            <td>{{$completed_assessment_assignment->end_time}}</td>


                                            <td>


                                                <a href="{{ route('dossier_evaluation_edit',[$completed_assessment_assignment->id])  }}" class="btn btn-info btn-sm"><i class="fas fa-eye"></i> </a>
@if($completed_assessment_assignment->task_status=='completed')
                                                <button
                                                        id="add_to_que_btn"
                                                        class="btn btn-success btn-sm"
                                                        title="Register for Certification"
                                                        onclick="decision_que(this,'add')"
                                                value="{{$completed_assessment_assignment->id}}">
                                                    <i class="fas fa-plus"></i>
                                                </button>
                                                    <button hidden
                                                            id="remove_from_que_btn"
                                                            class="btn btn-danger btn-sm"
                                                            title="Remove from Certification"
                                                            onclick="decision_que(this,'remove')"
                                                            value="{{$completed_assessment_assignment->id}}">
                                                        <i class="fas fa-minus"></i>
                                                    </button>
                                                @else
                                                    <button hidden
                                                            id="add_to_que_btn"
                                                            class="btn btn-success btn-sm"
                                                            title="Register for Certification"
                                                            onclick="decision_que(this,'add')"
                                                            value="{{$completed_assessment_assignment->id}}">
                                                        <i class="fas fa-plus"></i>
                                                    </button>
                                                    <button
                                                            id="remove_from_que_btn"
                                                            class="btn btn-danger btn-sm"
                                                            title="Remove from Certification"
                                                            onclick="decision_que(this,'remove')"
                                                            value="{{$completed_assessment_assignment->id}}">
                                                        <i class="fas fa-minus"></i>
                                                    </button>
    @endif



                                            </td>
                                        </tr>
                                    @endforeach
                                    </tbody>

                                </table>
                            </div> {{-- end div: example1_wrapper--}}


                        </div>
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
        function decision_que(o,command){
            const id=o.value;
            const command_type=command;


                $.ajax({

                    type:'GET',

                    url:"{{ route('decision_que') }}",

                    data:{id:id,command_type:command_type},

                    success:function(data){
                        if(data.queued=='added') {
                            toastr.success('Product Added to Registration Queue')
                            document.getElementById('add_to_que_btn').hidden = true;
                            document.getElementById('remove_from_que_btn').hidden = false;
                        }
                        else if(data.queued=='removed'){
                            toastr.warning('Product Removed From Registration Queue')

                            document.getElementById('add_to_que_btn').hidden = false;
                            document.getElementById('remove_from_que_btn').hidden = true;
                        }
                        else{
                            alert('you have error in supervisor controller')
                        }

                    },
                    error:function (data) {

                        console.log(data);
                    }
                });

        }
    </script>

@endsection
