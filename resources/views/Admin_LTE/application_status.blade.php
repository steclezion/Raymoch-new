@extends('layouts.app_app')
@section('content')
<meta name="csrf-token" content="{{ csrf_token() }}">
  <!-- start: Css -->

  <link rel="stylesheet" href="{{ asset('plugins/fontawesome-free/css/all.min.css') }}">
  <!-- DataTables -->
  <link rel="stylesheet" href="{{ asset('plugins/datatables-bs4/css/dataTables.bootstrap4.min.css') }}">
  <link rel="stylesheet" href="{{ asset('plugins/datatables-responsive/css/responsive.bootstrap4.min.css') }}">
  <link rel="stylesheet" href="{{ asset('plugins/datatables-buttons/css/buttons.bootstrap4.min.css') }}">
  <!-- Theme style -->
  <link rel="stylesheet" href="{{ asset('dist/css/adminlte.min.css') }}">
  <script src="{{asset('plugins/jquery/jquery.min.js')}}"></script> 

             <div class="card">
              <div class="card-header">
                <h3 class="card-title">Application Status</h3>
              </div>
              <!-- /.card-header -->
              <div class="card-body">
                <table id="example1" class="table table-bordered table-striped">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>ApplicationID</th>
                    <th>Application Status</th>
                    <th>Product Name</th>
                    <th>Supplier Name</th>
                    <th>Supplier contact Name</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody {{  $i=1 }}>
                  @foreach($applications as $application)
               <tr>
                    <td>{{ $i++ }}</td>
                    <td>{{ $application->application_id }}</td>
                    <td>{{ $application->application_status }}</td>
                    <td>{{ $application->product_trade_name }}</td>
                    <td>{{ $application->trade_name  }}</td>
                    <td>{{ $application->first_name." ".$application->middle_name." ".$application->last_name }}</td>
                    <td>   
                    <a href="{{ route('application.update',$application->application_id)  }}"
                    <i class='fas fa-street-view'></i>
                    </a>

                    <a href="{{  route('application.invoice_generate',$application->application_id)  }}"
                    <i class='fas fa-file-invoice-dollar'></i>

                    </a>
                  </td>
                  </tr>
                @endforeach
                  
                  </tbody>
                  <tfoot>
                
                  
                  </tfoot>
                </table>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>


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

<!-- Bootstrap 4 -->
<script src="{{ asset('plugins/bootstrap/js/bootstrap.bundle.min.js') }} "></script>
<!-- DataTables  & Plugins -->
<script src="{{ asset('plugins/datatables/jquery.dataTables.min.js') }}"></script>
<script src="{{ asset('plugins/datatables-bs4/js/dataTables.bootstrap4.min.js') }}"></script>
<script src="{{ asset('plugins/datatables-responsive/js/dataTables.responsive.min.js') }}"></script>
<script src="{{ asset('plugins/datatables-responsive/js/responsive.bootstrap4.min.js') }}"></script>
<script src="{{ asset('plugins/datatables-buttons/js/dataTables.buttons.min.js') }}"></script>
<script src="{{ asset('plugins/datatables-buttons/js/buttons.bootstrap4.min.js') }}"></script>

<script src="{{ asset('plugins/datatables-buttons/js/buttons.html5.min.js') }}"></script>
<script src="{{ asset('plugins/datatables-buttons/js/buttons.print.min.js') }}"></script>
<script src="{{ asset('plugins/datatables-buttons/js/buttons.colVis.min.js') }}"></script>

@endsection