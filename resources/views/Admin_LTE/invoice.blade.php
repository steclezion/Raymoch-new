@extends('layouts.app_app')
@section('content')

<meta name="csrf-token" content="{{ csrf_token() }}">
  <!-- start: Css -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{ asset('/app/lib/twitter-bootstrap/4.1.3/css/bootstrap.min.css')}}" >
    <link rel="stylesheet" href="{{ asset('/app/lib/1.10.16/css/jquery.dataTables.min.css')}}" >
    <link rel="stylesheet" href="{{ asset('/app/lib/1.10.19/css/dataTables.bootstrap4.min.css')}}" >
    <script src="{{asset('plugins/jquery/jquery.min.js')}}"></script>
    <link rel="stylesheet" href="{{ asset('plugins/datatables-bs4/css/dataTables.bootstrap4.min.css') }}">
  <link rel="stylesheet" href="{{ asset('plugins/datatables-responsive/css/responsive.bootstrap4.min.css') }}">
  <link rel="stylesheet" href="{{ asset('plugins/datatables-buttons/css/buttons.bootstrap4.min.css') }}">
  <!-- Theme style --
    <div class="container">
    <br>
-->
    <div class="card-header">
                <h3 class="card-title">Invoice Status</h3>
              </div>
              <br/></br>
              <div class="container">
<div class="table-responsive">
 <!--   <a class="btn btn-success" href="javascript:void(0)" id="createNewBook"> Generate Invoice Number </a>-->
 <table class="table table-bordered table-condensed  table-responsive table-hover data-table"  id="example1">
        <thead>
            <tr>
                <th>No</th>
                <th>ID</th>
                <th>ApplicationID</th>
                <th>UserId</th>
                <th>Generic Name</th>
                <th>Product Trade Name </th>
                <th>Company Supplier Name</th>
                <th>Maufacturer Name</th>
                <th>Application Type</th>
                <th>Generated Invoice Number</th>
                <th>Remark</th>
                <th>Amount</th>
                <th width="150px">Action</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    </div>
</div>
   
</div>
    
<script rel="stylesheet" src="{{ asset('/app/lib/ajax/jquery/1.9.1/jquery.js')}}" ></script>
<script rel="stylesheet" src="{{ asset('/app/lib/ajax/jquery-validate/1.19.0/jquery.validate.js')}}" ></script>
<script rel="stylesheet" src="{{ asset('/app/lib/1.10.16/js/jquery.dataTables.min.js')}}" ></script>
<script rel="stylesheet" src="{{ asset('/app/lib/4.1.3/js/bootstrap.min.js')}}" ></script>
<script rel="stylesheet" src="{{ asset('/app/lib/1.10.19/js/dataTables.bootstrap4.min.js')}}" ></script>


@include('layouts.modal_generate_invoice')

          

@endsection