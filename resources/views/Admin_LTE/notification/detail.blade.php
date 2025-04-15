@extends('layouts.app')
@section('stylesheets')
@endsection
@section('content')

<section class="content">
      <div class="container-fluid">
        <div class="col-md-6 col-lg-6 col-sm-7">
                <div class="card card-info">
                    <div class="card-header">
                        <h3 class="card-title">Notification Details</h3>
                    </div>
                    <!-- /.card-header -->
                    <!-- form start -->
                    <form>
                        <div class="card-body">
                            <div class="form-group">
                                <label for="exampleInputEmail1">From:- </label>
                                <label for="exampleInputEmail1">{{$user->first_name}} {{$user->middle_name}}</label>
                            </div>

                            <div class="form-group">
                                <label for="exampleInputEmail1">Subject:- </label>
                                <label for="exampleInputEmail1">{{$notification->subject}}</label>
                            </div>

                            <div class="form-group">
                                <label for="exampleInputEmail1">Priority:- </label>
                                <label for="exampleInputEmail1">{{$notification->alert_level}}</label>
                            </div>

                            <div class="form-group">
                                <label for="exampleInputEmail1">Detail:- </label>
                                <label for="exampleInputEmail1">{{$notification->data}}</label>
                            </div>

                            @if($document!=null)
                            <div class="form-group">
                                <label for="exampleInputEmail1">Document :- </label>
                               <a href="{{asset($document->path)}}"  target="_blank"
                                                                   data-toggle="tooltip"
                                                                   class="btn btn-info btn-sm"
                                                                   data-placement="top"
                                                                   title="View the file"><i class="fas fa-book-open"></i></a>
                            </div>
                            @endif

                            <div class="form-group">
                                <label for="exampleInputEmail1">Time Sent:- </label>
                                <label for="exampleInputEmail1">{{$data->created_at}} &nbsp;&nbsp;&nbsp;{{$data->created_at->diffForHumans()}}</label>
                            </div>


                        </div>
                        <!-- /.card-body -->

                        <div class="card-footer">
                          <a href="{{url('/Notifications')}}" class="btn btn-primary" role="button"><i class="fas fa-arrow-circle-left" ></i>  Back</a>

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
