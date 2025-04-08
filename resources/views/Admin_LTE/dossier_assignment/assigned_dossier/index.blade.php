
@extends('layouts.app')

@section('stylesheets')


<link rel="stylesheet" href="{{asset('plugins/datatables-bs4/css/dataTables.bootstrap4.min.css')}}">
<link rel="stylesheet" href="{{asset('plugins/datatables-responsive/css/responsive.bootstrap4.min.css')}}">
<link rel="stylesheet" href="{{asset('plugins/datatables-buttons/css/buttons.bootstrap4.min.css')}}">
@endsection

@section('content')
@include('layouts.master_js')
<section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
                <div class="card">
                            <div class="card-header">
                              <h3 class="card-title">Assigned Dossiers List</h3>
                            </div>
                            <!-- /.card-header -->
                            <div class="card-body">
                              <div id="example1_wrapper" class="dataTables_wrapper dt-bootstrap4 no-footer ">
                              <table id="example1" class="table table-bordered table-striped dataTable no-footer dtr-inline" role="grid" aria-describedby="example1_info">

                                  <thead>
                                      <tr role="row">
                                      <th class="sorting sorting_asc" tabindex="0" aria-controls="example1" rowspan="1" colspan="1" aria-label="Supplier Name: activate to sort column descending" aria-sort="ascending" width="5%">S.N</th>
                                      <th class="sorting sorting_asc" tabindex="0" aria-controls="example1" rowspan="1" colspan="1" aria-label="Supplier Name: activate to sort column descending" aria-sort="ascending" width="20%">Dossier Ref. Num</th>
                                      <th class="sorting" tabindex="0" aria-controls="example1" rowspan="1" colspan="1" aria-label="Country: activate to sort column ascending" width="20%">Path</th>
                                      <th class="sorting" tabindex="0" aria-controls="example1" rowspan="1" colspan="1" aria-label="Address: activate to sort column ascending" width="20%">Product Name</th>
                                      <th class="sorting" tabindex="0" aria-controls="example1" rowspan="1" colspan="1" aria-label="Actions: activate to sort column ascending" width="20%">Actions</th></tr>
                                      </thead>
                                      <tbody>
                                        @php($i=1)
                                      @foreach($assigned_dossiers as $assigned)
                                      <tr role="row" class="odd">
                                        <td>{{$i++}}</td>
                                        <td tabindex="0" class="dtr-control sorting_1">{{$assigned->dossier_ref_num}}</td>
                                        <td>{{$assigned->path}}</td>
                                        <td>{{$assigned->description}}</td>
                                        <td>

                                            <a href="{{ route('dossier_evaluation_edit',[$assigned->dossier_assignment_id])  }}" class="btn btn-info"><i class="fas fa-eye"></i>Details</a>

                                        </td>
                                      </tr>
                                      @endforeach
                                    </tbody>

                               </table>
                            </div>
                           </div>
                         </div>
                            <!-- /.card-body -->
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
