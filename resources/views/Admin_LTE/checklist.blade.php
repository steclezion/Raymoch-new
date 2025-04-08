@extends('layouts.app_app')
@section('content')

<meta name="csrf-token" content="{{ csrf_token() }}">



    <link rel="stylesheet" href="{{ asset('/app/lib/twitter-bootstrap/4.1.3/css/bootstrap.min.css')}}" >
    <link rel="stylesheet" href="{{ asset('/app/lib/1.10.16/css/jquery.dataTables.min.css')}}" >
    <link rel="stylesheet" href="{{ asset('/app/lib/1.10.19/css/dataTables.bootstrap4.min.css')}}" >
    <script src="{{asset('plugins/jquery/jquery.min.js')}}"></script>
    <link rel="stylesheet" href="{{ asset('plugins/datatables-bs4/css/dataTables.bootstrap4.min.css') }}">
  <link rel="stylesheet" href="{{ asset('plugins/datatables-responsive/css/responsive.bootstrap4.min.css') }}">
  <link rel="stylesheet" href="{{ asset('plugins/datatables-buttons/css/buttons.bootstrap4.min.css') }}">
  <!-- Theme style --> 
  <!-- Font Awesome -->
  <link rel="stylesheet" href="{{ asset('plugins/fontawesome-free/css/all.min.css') }}">
  <!-- daterange picker -->
  <link rel="stylesheet" href="{{ asset('plugins/daterangepicker/daterangepicker.css')}}">
  <!-- iCheck for checkboxes and radio inputs -->
  <link rel="stylesheet" href="{{ asset('plugins/icheck-bootstrap/icheck-bootstrap.min.css')}}">
  <!-- Bootstrap Color Picker -->
  <link rel="stylesheet" href="{{ asset('plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css')}}">
  <!-- Tempusdominus Bootstrap 4 -->
  <link rel="stylesheet" href="{{ asset('plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css')}}">
  <!-- Select2 -->
  <link rel="stylesheet" href="{{ asset('plugins/select2/css/select2.min.css')}}">
  <link rel="stylesheet" href="{{ asset('plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css')}}">
  <!-- Bootstrap4 Duallistbox -->
  <link rel="stylesheet" href="{{ asset('plugins/bootstrap4-duallistbox/bootstrap-duallistbox.min.css')}}">
  <!-- BS Stepper -->
  <link rel="stylesheet" href="{{ asset('plugins/bs-stepper/css/bs-stepper.min.css')}}">
  <!-- dropzonejs -->
  <link rel="stylesheet" href="{{ asset('plugins/dropzone/min/dropzone.min.css') }}">

 <!-- iCheck -->

 
 <!-- iCheck -->
            <div class="card card-info">
              <div class="card-header">
                <h3 class="card-title">Application check List </h3>
 <div id="rendered_check_list">
 </div>
<div class="col-md-offset-2 col-sm-8">
                     <button style="display:none"  id="generate_application_number"  class="btn btn-primary btn-sm" id="saveBtn" value="create">Generate Application Number
                     </button>
 </div>
 </div>
               



  <div class="card">
            
              <!-- /.card-header -->
              <div class="card-body">
                <table id="example1" class="table table-bordered table-striped">
                  <thead>
                  <tr>
                    <th {{ $i=0 }}>ID</th>
                    <th>ApplicationID</th>
                    <th>Application Status</th>
                    <th>Product Name</th>
                    <th>Supplier Name</th>
                    <th>Supplier contact Name</th>
                    <th>Payment Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody {{ $i=1 }}>
                  @foreach($applications as $application)
               <tr>
                    <td>{{ $i++ }}</td>
                    <td>{{ $application->application_id }}</td>
                    <td>{{ $application->application_status }}</td>
                    <td>{{ $application->product_trade_name }}</td>
                    <td>{{ $application->trade_name  }}</td>
                   <td>{{ $application->first_name." ".$application->middle_name." ".$application->last_name }}</td>
                    <td>@if($application->payment_status === 1) <span class="badge bg-success">Done</span>  @else <span class="badge bg-warning">Inprogress</span> @endif</td>
                    <td>   
                    @if($application->payment_status === 1)
                    <a href="{{ route('application.checklist',$application->application_id)  }}"
                    <i class='fas fa-street-view'></i>
                    </a>
                    @else
                    <span class="badge bg-danger"> Incomplete</span>
                    @endif
                  </button>
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



 



	function check_list(e){
        var application_id  = e;
       
        $.ajax({
          url: "{{ url('/get_checklist_value') }}",
          type: "POST",
          data: 
          {
            application_id:application_id,
          
          },
          success: function (data) {
            
       document.getElementById('rendered_check_list').innerHTML= data.rendered_html;
       document.getElementById('generate_application_number').style.display = "block";
     
      
          },
          error: function (data) {
              console.log('Error:', data);
              $('#saveBtn').html('Save Changes');
          }
      });
     
}


$(function () {
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
    });


});

</script>




<script rel="stylesheet" src="{{ asset('/app/lib/ajax/jquery/1.9.1/jquery.js')}}" ></script>
<script rel="stylesheet" src="{{ asset('/app/lib/ajax/jquery-validate/1.19.0/jquery.validate.js')}}" ></script>
<script rel="stylesheet" src="{{ asset('/app/lib/1.10.16/js/jquery.dataTables.min.js')}}" ></script>
<script rel="stylesheet" src="{{ asset('/app/lib/4.1.3/js/bootstrap.min.js')}}" ></script>

          

@endsection