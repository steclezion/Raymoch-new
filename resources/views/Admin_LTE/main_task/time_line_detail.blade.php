@extends('layouts.app')
@section('stylesheets')
@endsection
@section('content')

    <section class="content">
        <div class="container-fluid">
            <div class="col-md-6 col-lg-6 col-sm-7">
                <div class="card card-info">
                    <div class="card-header">
                        <h3 class="card-title">Task Details</h3>
                    </div>
                    <!-- /.card-header -->
                    <!-- form start -->
                    <form>
                        <div class="card-body">
                            <div class="form-group">
                                <label for="exampleInputEmail1">Date:- </label>
                                <label for="exampleInputEmail1">{{$task->start_time}}</label>
                            </div>

                            <div class="form-group">
                                <label for="exampleInputEmail1">Task Category:- </label>
                                <label for="exampleInputEmail1">{{$task->task_category}}</label>
                            </div>

                            <div class="form-group">
                                <label for="exampleInputEmail1">Content:- </label>
                                <label for="exampleInputEmail1">{{$task->content_detail}}</label>
                            </div>

                            <div class="form-group">
                                <label for="exampleInputEmail1">View Related Document :- </label>
                                <a id="received_view" href="{{asset($document->path)}}" target="_blank" data-toggle="tooltip" class="btn btn-info btn-sm"
                                   data-placement="top" title="View the file"><i class="fas fa-book-open"></i></a><br>

                            </div>

                        </div>
                        <!-- /.card-body -->

                        <div class="card-footer">


                        </div>
                    </form>
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
