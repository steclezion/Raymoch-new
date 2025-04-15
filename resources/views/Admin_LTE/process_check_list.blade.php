@extends('layouts.app')
@section('content')
<link rel="stylesheet" href="{{ asset('plugins/fontawesome-free/css/all.min.css') }}">
  <!-- DataTables -->
  <link rel="stylesheet" href="{{ asset('plugins/datatables-bs4/css/dataTables.bootstrap4.min.css') }}">
  <link rel="stylesheet" href="{{ asset('plugins/datatables-responsive/css/responsive.bootstrap4.min.css') }}">
  <link rel="stylesheet" href="{{ asset('plugins/datatables-buttons/css/buttons.bootstrap4.min.css') }}">
  <link rel="stylesheet" href="{{ asset('plugins/summernote/summernote-bs4.min.css') }}" >
  <!-- CodeMirror -->
  <link rel="stylesheet" href="{{ asset('plugins/codemirror/codemirror.css') }} ">
  <link rel="stylesheet" href="{{ asset('plugins/codemirror/theme/monokai.css') }}">
  <!-- SimpleMDE -->
  <!-- Theme style -->
  <link rel="stylesheet" href="{{ asset('dist/css/adminlte.min.css') }}">
  <script src="{{asset('plugins/jquery/jquery.min.js')}}"></script> 



<meta name="csrf-token" content="{{ csrf_token() }}">

   
   <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Checklist for Receiving Registration Applications  </h3><br><br>
                <h3 class="pull-left"> Registration Application Reciept/Verification Check List </h3>
                <div class="card">
        
              <div class="container-fluid">
        <!-- Section one product details  -->
        <div class="card card-default">
          <div class="card-header">
          <h3 class="card-title">Section 1: Product Details</h3>
             <div class="card-tools">
              <button type="button" class="btn btn-tool" data-card-widget="collapse">
                <i class="fas fa-minus"></i>
              </button>
              <button type="button" class="btn btn-tool" data-card-widget="remove">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
              <div class="card-body">
                
                <table class="table table-bordered  table-condensed table-striped">
                  <thead>
                    <tr>
                    <th>Lists</th>
                      <th>Name</th>
                      <th style="width: 40px">check Status</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
            <td>Application ID</td>
                <td>
                @foreach($check_list as $application_id )
               {{  $application_id->application_id }}
               @break
               @endforeach
                </td>
                <td><span class="badge bg-success"><i class="fa fa-check"></i></span></td>
                   </tr>
                    <tr>
                    <td>Generic/Approved Product Name</td>
                      <td >{{ $font_product_name='' }}
                      @foreach( $check_list as $product_name )
                     {{  $product_name->product_name }}
                       @break
                      @endforeach
                      </td>
                      <td> @if($product_name->product_name == '') 
                     $font_product_name='<span class="badge bg-danger"><i class="fa fa-minus"></i></span>'
                      @else <span class="badge bg-success"><i class="fa fa-check"></i></span>  @endif </td>
                    </tr>
                    <tr>
                      <td> Proprietary/Trade name of the product</td>
                      <td>
                      @foreach($check_list as $product_trade_name )
                      {{  $product_trade_name->product_trade_name     }}
                      @break
                      @endforeach
                      </td>
                      <td> @if(  $product_trade_name->product_trade_name == '') 
                     $font_product_name='<span class="badge bg-danger"><i class="fa fa-minus"></i></span>'
                      @else <span class="badge bg-success"><i class="fa fa-check"></i></span>  @endif </td>
                    </tr>
                    <tr>
                      <td>Supplier Name</td>
                      <td>

                      @foreach($check_list as $contact_type )
                      @if(  $contact_type->contact_type=='Supplier'  )
                      {{   $contact_type->trade_name  }}
                      @break
                       @endif
                       @endforeach

                      </td>
                      <td> @if(  $contact_type->trade_name == '') 
                     $font_product_name='<span class="badge bg-danger"><i class="fa fa-minus"></i></span>'
                      @else <span class="badge bg-success"><i class="fa fa-check"></i></span>  @endif </td>
                    </tr>
                      <tr>
                      <td>Supplier Contact Name</td>
                      <td>
                      @foreach($check_list as $contact_type )
                      @if( $contact_type->contact_type == 'Supplier')
                      {{   $contact_type->first_name." ".$contact_type->middle_name." ".$contact_type->last_name  }}
                      @break
                      @endif
                      @endforeach
                      </td>
                      <td> @if(  $contact_type->first_name == '') 
                     $font_product_name='<span class="badge bg-danger"><i class="fa fa-minus"></i></span>'
                      @else <span class="badge bg-success"><i class="fa fa-check"></i></span>  @endif </td>
                    </tr>
                    <tr>
                      <td>Agent Name</td>
                      <td>
                     @foreach ($agent_contact_info as $agent_)
                      {{   $agent_->trade_name }}
                      @break
                     @endforeach
                      </td>
                      <td> @if(  $agent_->trade_name == '') 
                     $font_product_name='<span class="badge bg-danger"><i class="fa fa-minus"></i></span>'
                      @else <span class="badge bg-success"><i class="fa fa-check"></i></span>  @endif </td>
                    </tr>
                      <tr>
                      <td>Agent  Contact Name</td>
                      <td>
                      @foreach ($agent_contact_info as $agent_name)
                      {{   $agent_name->first_name." ".$agent_name->middle_name." ".$agent_name->last_name  }}
                      @break
                     @endforeach
                      </td>
                      <td> @if( $agent_name->first_name == '') 
                     $font_product_name='<span class="badge bg-danger"><i class="fa fa-minus"></i></span>'
                      @else <span class="badge bg-success"><i class="fa fa-check"></i></span>  @endif </td>
                    </tr>

                     <tr>
                      <td>Product Manufacturer</td>
                      <td>
                      @foreach($check_list as $manufacturer )
                      
                      {{   $manufacturer->manufacturer_name }}
                 @break
                      @endforeach
                      </td>
                      <td> @if( $manufacturer->manufacturer_name == '') 
                     $font_product_name='<span class="badge bg-danger"><i class="fa fa-minus"></i></span>'
                      @else <span class="badge bg-success"><i class="fa fa-check"></i></span>  @endif </td>
                    </tr>

                      <tr>
                      <td {{ $i=1 }}>Product Compostion</td>
                      <td>
                      @foreach ($product_composition_info as $product_composition_info_name)

                     Composition Name {{ $i++ }}:{{   $product_composition_info_name->composition_name   }}<br>
                    
                     @endforeach
                      </td>
                      <td> @if( $manufacturer->manufacturer_name == '') 
                     $font_product_name='<span class="badge bg-danger"><i class="fa fa-minus"></i></span>'
                      @else <span class="badge bg-success"><i class="fa fa-check"></i></span>  @endif </td>
                      </tr>

                      <tr>
                      <td {{ $i=1 }}> API Product Manufacturer </td>
                      <td>
                      @foreach ($api_manufacturers_info as $api_manufacturers_info_name)
                      Api-Name {{ $i++ }}:{{  $api_manufacturers_info_name->manufacturer_name   }}<br>
                      @endforeach
                      </td>
                      <td> @if( $api_manufacturers_info_name->manufacturer_name == '') 
                     $font_product_name='<span class="badge bg-danger"><i class="fa fa-minus"></i></span>'
                      @else <span class="badge bg-success"><i class="fa fa-check"></i></span>  @endif </td>
                      </tr>

                      <tr>
                      <td> Dossier and Sample Status</td>
                      <td>
                      @foreach($check_list as $dossier_url)
                      {{  $dossier_url->dossier_url }}
                      @break
                      @endforeach
                      </td>
                      <td> @if( $dossier_url->dossier_url == '') 
                     $font_product_name='<span class="badge bg-danger"><i class="fa fa-minus"></i></span>'
                      @else <span class="badge bg-success"><i class="fa fa-check"></i></span>  @endif </td>
                      </tr>




                      <tr>
                      <td>Type of Registration </td>
                      <td>
                      @foreach($check_list as $track_mode)
                    
                    @if($track_mode->application_type== 1) 
                    $track_mode->fast_track_details = 'Standard Mode'
                    @endif
                  {{  $track_mode->fast_track_details }}
                      @break
                      @endforeach
                      </td>
                      <td>
                       @if( $track_mode->fast_track_details == '') 
                       <span class="badge bg-danger"><i class="fa fa-minus"></i></span>
                      @else 
                      <span class="badge bg-success"><i class="fa fa-check"></i></span> 
                      @endif </td>
                      </tr>
                   
                  </tbody>
                </table>
              </div>
            
            </div>
               </div>
              <!-- /.card-header -->
              <style>
                  th,td {padding: 15px;text-align: left;border: 0.2px solid grey;border-bottom: 1px solid #ddd;}
                  tr { border: 1px dashed black;}
               </style>



















    <!-- Section 3 Specific requirements for fast-track registration-->
          <div class="row">
          <div class="col-12">
            
                <div class="card">
        
              <div class="container-fluid">
        <!-- Section one product details  -->
        <div class="card card-default">
          <div class="card-header">
          <h3 class="card-title">Section 2: General Requirements</h3>
             <div class="card-tools">
              <button type="button" class="btn btn-tool" data-card-widget="collapse">
                <i class="fas fa-minus"></i>
              </button>
              <button type="button" class="btn btn-tool" data-card-widget="remove">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
              <div class="card-body">
                
                <table class="table table-bordered  table-condensed table-striped">
                  <thead>
                    <tr>
                    <th>Lists</th>
                      <th>Name</th>
                      <th style="width: 40px">Yes</th>
                      <th style="width: 40px">No</th>
                      <th style="width: 40px">No Applicable </th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
                     <td>Presence of application letter </td>
                     <td >Application Letter</td>
                     <td ><input type="checkbox"  size="30" hieght="40"  id="applicable_expression_yes" name="applicable_letter" class="form-control"  width="40"/></td>
                     <td ><input type="checkbox"  size="30" hieght="40"  id="applicable_expression_no" name="applicable_letter" class="form-control"  width="40"/></td>
                     <td> </td>
                   </tr>
                    <tr>
                      <td>Presence of manufacturer and manufacturing sites details </td>    
                      <td >Manufacturer Information</td>
                      @if(  $manufacturer->manufacturer_name == '' ) 
                      <td ><input type="checkbox"  size="30" hieght="40"  id="manufacturer_information_yes" name="manufacturer_information" class="form-control"  width="40"/></td>
                      @else 
                      <td ><input type="checkbox"  size="30" hieght="40"  checked disabled  id="manufacturer_information_yes" name="manufacturer_information" class="form-control"  width="40"/></td>
                      @endif
                      <td><input type="checkbox"  size="30" hieght="40"     id="manufacturer_information_no" name="manufacturer_information" class="form-control"  width="40"/></td>
                     
                    </tr>


                          <tr>
       <td>Presence of Local Authorized Agent (LAA) information  </td>
       <td >Local Authorized Agent (LAA) </td>
                      @if(  $agent_->trade_name == '') 
                      <td ><input type="checkbox"  size="30" hieght="40"   id="local_agent_yes" name="local_agent" class="form-control"  width="40"/></td>
                      @else 
                      <td ><input type="checkbox"  size="30" hieght="40"    checked disabled id="local_agent_yes" name="local_agent" class="form-control"  width="40"/></td>
                      @endif
                     
                      <td ><input type="checkbox"  size="30" hieght="40"    id="local_agent_no" name="local_agent" class="form-control"  width="40"/></td>
                      <td ><input type="checkbox"  size="30" hieght="40"    id="local_agent_no" name="local_agent" class="form-control"  width="40"/></td>
                      </tr>

            <tr>
    <td>Presence of the product in the Eritrean List of medicines (ENLM)      <div class="panel-group"> <div class="panel panel-default"> <div class="panel-heading pace-center-simple-lime"> <h4 class="panel-title"> <a class="btn btn-info btn-sm" data-toggle="collapse" href="#collapse3"><b class="fas fa-angle-double-right"> </b> </a></h4></div><div id="collapse3" class="panel-collapse collapse"><div class="panel-body"><span style="color:skyblue">  [If the pharmaceutical product is not listed in the ENLM ensure that the reason for its permit registration is filled in the comment section.] </span></div></div></div> </td>
    <td >Eritrean National List of Medicines</td>
@foreach($product_enlm_list as $list)     @endforeach
                  @if($list->is_enlm === 1)
                      <td ><input type="checkbox"  size="30" hieght="40"  checked disabled id="enlm_yes" name="enlm" class="form-control"  width="40"/></td>
                   @else
                   <td ><input type="checkbox"  size="30" hieght="40"  checked disabled id="enlm_yes" name="enlm" class="form-control"  width="40"/></td>
                    @endif
                    <td ><input type="checkbox"  size="30" hieght="40"  id="enlm_no" name="enlm" class="form-control"  width="40"/></td>
                    <td> </td>

                   </tr>

                      <tr>
                      <td rowspan='5'>Presence of the submitted dossier in CTD format as per the requested format  <div class="panel-group"> <div class="panel panel-default"> <div class="panel-heading pace-center-simple-lime"> <h4 class="panel-title"> <a class="btn btn-info btn-sm" data-toggle="collapse" href="#collapse4"><b class="fas fa-angle-double-right"> </b> </a></h4></div><div id="collapse4" class="panel-collapse collapse"><div class="panel-body"><span style="color:skyblue">  [Please tick the boxes if the relevant modules are available or if certain modules are missing please fill the comment section the acceptable reasons of its absence]</span></div></div></div></div> </td>
                      <td style="text-align: left;">Module I </td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="module_one_yes" name="module_one" class="form-control"  width="40"/></td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="module_one_no" name="module_one" class="form-control"  width="40"/></td>
                      <td> </td>
                      </tr>
                      <tr>
                      <td >Module II </td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="module_two_yes" name="module_two" class="form-control"  width="40"/></td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="module_two_no" name="module_two" class="form-control"  width="40"/></td>
                      <td> </td>
                      </tr>
                      <tr>
                      <td >Module III</td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="module_three_yes" name="module_three" class="form-control"  width="40"/></td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="module_three_no" name="module_three" class="form-control"  width="40"/></td>
                      <td> </td>
                      </tr>
                      <td >Module IV</td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="module_four_yes"  name="module_four" class="form-control"  width="40"/></td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="module_four_no"   name="module_four" class="form-control"  width="40"/></td>
                      <td> </td>
                      </tr>
                      <td >Module V</td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="module_five_yes" name="module_five" class="form-control"  width="40"/></td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="module_five_no"  name="module_five" class="form-control"  width="40"/></td>
                      <td> </td>
                      </tr>

            <tr>
            <td colspan='5'> Remark :
            <textarea    id="summernote"  name="remark" class="form-control"  auto/>
            </textarea>
            </td>

            </tr>


                 
                  </tbody>
                </table>
                </div>
              </div>
            
              </div>
            



  <!-- Section 3 Specific requirements for fast-track registration-->
  <div class="row">
          <div class="col-12">
            
                <div class="card">
        
              <div class="container-fluid">
        <!-- Section one product details  -->
        <div class="card card-default">
          <div class="card-header">
          <h3 class="card-title">Section 3: Specific requirements for fast-track registration</h3>
             <div class="card-tools">
              <button type="button" class="btn btn-tool" data-card-widget="collapse">
                <i class="fas fa-minus"></i>
              </button>
              <button type="button" class="btn btn-tool" data-card-widget="remove">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
              <div class="card-body">
                
                <table class="table table-bordered  table-condensed table-striped">
                  <thead>
                    <tr>
                    <th>Lists</th>
                      <th>Name</th>
                      <th style="width: 40px">Yes</th>
                      <th style="width: 40px">No</th>
                      <th style="width: 40px">No Applicable </th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
            <td>Presence valid marketing authorization/ registration date / prequalification letter</td>
            <td> authorization/ registration date / prequalification letter  </td>
            <td ><input type="checkbox"  size="30" hieght="40"  id="who_prequalification_yes" name="who_prequalification" class="form-control"  width="40"/></td>
            <td ><input type="checkbox"  size="30" hieght="40"  id="who_prequalification_no" name="who_prequalification" class="form-control"  width="40"/></td>
            <td>   </td>
               </tr>

            <tr>
            <td>Presence of the Quality Information Summary (QIS) as approved/ endorsed by the reference authority or WHO                         <div class="panel-group"> <div class="panel panel-default"> 
            <div class="panel-heading pace-center-simple-lime"> <h4 class="panel-title"> <a class="btn btn-info btn-sm" data-toggle="collapse" href="#collapse1"><b class="fas fa-angle-double-right"> </b> </a></h4></div><div id="collapse1" class="panel-collapse collapse"><div class="panel-body"><span style="color:skyblue"> [please ensure that either one of this fields are field] </span></div></div></div></div></td>
            <td> Reference authority   </td>
            <td ><input type="checkbox"  size="30" hieght="40"  id="qis_prequalified_products_yes" name="qis_prequalified_products" class="form-control"  width="40"/></td>
            <td ><input type="checkbox"  size="30" hieght="40"  id="qis_prequalified_products_no" name="qis_prequalified_products" class="form-control"  width="40"/></td>
            <td>   </td>
            </tr>
            <tr>
            <td> Presence of full assessment report from the reference authority or institution  <div class="panel-group"> <div class="panel panel-default"> <div class="panel-heading pace-center-simple-lime"> <h4 class="panel-title"> <a class="btn btn-info btn-sm" data-toggle="collapse" href="#collapse6"><b class="fas fa-angle-double-right"> </b> </a></h4></div><div id="collapse6" class="panel-collapse collapse"><div class="panel-body"><span style="color:skyblue"> [Please ensure that the assessment report is valid] </span></div></div></div></div><br> </td>
            <td> report from the reference authority or institution   </td>
            <td ><input type="checkbox"  size="30" hieght="40"  id="authority_institution_information_yes" name="authority_institution_information" class="form-control"  width="40"/></td>
            <td ><input type="checkbox"  size="30" hieght="40"  id="authority_institution_information_no" name="authority_institution_information" class="form-control"  width="40"/></td>
            <td>   </td>
            </tr>


            <tr>
            <td> Presence of the full inspection reports from the reference authority or institution  <div class="panel-group"> <div class="panel panel-default"> <div class="panel-heading pace-center-simple-lime"> <h4 class="panel-title"> <a class="btn btn-info btn-sm" data-toggle="collapse" href="#collapse7"><b class="fas fa-angle-double-right"> </b> </a></h4></div><div id="collapse7" class="panel-collapse collapse"><div class="panel-body"><span style="color:skyblue"> [Please ensure that the assessment report is valid]</span></div></div></div></div><br></td>
            <td >inspection reports</td>
            <td ><input type="checkbox"  size="30" hieght="40"  id="inspection_report_yes" name="inspection_report" class="form-control"  width="40"/></td>
            <td ><input type="checkbox"  size="30" hieght="40"  id="inspection_report_no" name="inspection_report" class="form-control"  width="40"/></td>
            <td>   </td>
            </tr>


            <tr>
            <td> Presence of the Summary Product Characteristics </td>
            <td > Product Characteristics</td>
            <td ><input type="checkbox"  size="30" hieght="40"  id="Product_Characteristics_yes" name="Product Characteristics" class="form-control"  width="40"/></td>
            <td ><input type="checkbox"  size="30" hieght="40"  id="Product_Characteristics_no" name="Product Characteristics" class="form-control"  width="40"/></td>
            <td>   </td>
            </tr>


              <tr>
            <td> Presence of the Patient information leaflet </td>
            <td >Information for the patient/ user</td>
            <td ><input type="checkbox"  size="30" hieght="40"  id="information_patient_user_yes" name="information_patient_user" class="form-control"  width="40"/></td>
            <td ><input type="checkbox"  size="30" hieght="40"  id="information_patient_user_no" name="information_patient_user" class="form-control"  width="40"/></td>
            <td>   </td>
            </tr>
      

               <tr>
            <td colspan='5'> Remark :
            <textarea    id="summernotee"  name="remark" class="form-control"  auto/>
            </textarea>
            </td>

            </tr>


                 </tbody>
                </table>
                </div>
               </div>
               </div>



  <!-- Section 4 Sample details-->
  <div class="row">
          <div class="col-12">
            
                <div class="card">
        
              <div class="container-fluid">
        <!-- Section one product details  -->
        <div class="card card-default">
          <div class="card-header">
          <h3 class="card-title">Section 4: Sample details</h3>
             <div class="card-tools">
              <button type="button" class="btn btn-tool" data-card-widget="collapse">
                <i class="fas fa-minus"></i>
              </button>
              <button type="button" class="btn btn-tool" data-card-widget="remove">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
              <div class="card-body">
                
                <table class="table table-bordered  table-condensed table-striped">
                  <thead>
                      <tr>
                      <th>Lists</th>
                      <th>Name</th>
                      <th style="width: 40px">Yes</th>
                      <th style="width: 40px">No</th>
                      <th style="width: 40px">No Applicable </th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                      <td>Availability of Product Sample</td>    
                      <td>Availability of Sample</td>
                      @foreach($check_list as $sample_Status ) @break
                      @endforeach
                      @if(  $sample_Status->sample_status == '' ) 
                      <td ><input type="checkbox"  size="30" hieght="40"  id="sample_product_yes" name="sample_product" class="form-control"  width="40"/></td>
                      @else 
                      <td ><input type="checkbox"  size="30" hieght="40"  checked disabled  id="sample_product_yes" name="sample_product_information" class="form-control"  width="40"/></td>
                      @endif
                      <td>
                      <input type="checkbox"  size="30" hieght="40"     id="sample_product_no" name="sample_product_no" class="form-control"  width="40"/>
                      </td>
                      <td> 
                      <input type="checkbox"  size="30" hieght="40"     id="sample_product_not_applicable" name="sample_product_not_applicable" class="form-control"  width="40"/>
                      </td>
                      </tr>
            <tr>
            <td > Number of samples received  </td>
            <td colspan='4' > <input type="text"   palceholder = "How many received?? "size="30" hieght="40"     id="Number_of_sample_received" name="number_of_sample_received" class="form-control"  width="40"/></td>
            </tr>
                   
                      <tr>
                      <td>Number of sample sent conforms with the Sampling schedule</td>
                      <td> Sampling Schedule </td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="sample_scheduled_yes" name="sample_sent" class="form-control"  width="40"/></td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="sample_scheduled_no" name="sample_sent" class="form-control"  width="40"/></td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="sample_scheduled_not_applicable" name="sample_sent" class="form-control"  width="40"/></td>
                     </tr>

                      <tr>
                      <td >Labelling Information</td>
                      <td colspan="4"> Remark <textarea  size="30" hieght="40"  id="labelinfo"  name="label_info" class="form-control"  width="40"/></textarea> </td>
                      </tr>

                      <tr>
<td>Sample net volume or weight</td>
<td>Sample net volume or weight  </td>
<td ><input type="checkbox"  size="30" hieght="40"  id="sample_volume_yes" name="sample_volume" class="form-control"  width="40"/></td>
<td ><input type="checkbox"  size="30" hieght="40"  id="sample_volume_no" name="sample_volume" class="form-control"  width="40"/></td>
<td>Net Wieght:<input  size="30" hieght="40"  id="sampling_net_weight" placeholder="Enter Weight"  name="sampling_net_weight" class="form-control"  width="40"/> </td>
                      </tr>


                      <tr>
                      <td>Availability of packaging inserts</td>
                      <td>Availability of packages</td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="availability_packages_yes" name="availability_packages" class="form-control"  width="40"/></td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="availability_packages_no" name="availability_packages" class="form-control"  width="40"/></td>
                      <td>  </td>
                      </tr>

                          <tr>
                      <td>Samples are manufactured in the same manufacturing<br> premises as that stated in the application form.</td>
                      <td>manufacturing premises as that stated in the application form.</td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="manufacturing_premises_yes" name="manufacturing premises" class="form-control"  width="40"/></td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="manufacturing_premises_no" name="manufacturing premises" class="form-control"  width="40"/></td>
                      </tr>
                    

                           <tr>
                      <td>Samples have at least 60% of their shelf-life <br> remaining at the time of submission.</td>
                      <td>Samples have at least 60% of their shelf-life</td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="sample_shelf_life_yes" name="sample_shelf_life" class="form-control"  width="40"/></td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="sample_shelf_life_no" name="sample_shelf_life" class="form-control"  width="40"/></td>
                      <td>  </td>
                      </tr>

                       <td>Availability of an official certificate of analysis <br>from the manufacturer of the same batch of sample.</td>
                      <td>Availability of an official certificate of analysis</td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="availability_certificate_analysis_yes" name="availability_certificate_analysis" class="form-control"  width="40"/></td>
                      <td ><input type="checkbox"  size="30" hieght="40"  id="availability_certificate_analysis_no" name="availability_certificate_analysis" class="form-control"  width="40"/></td>
                      <td>  </td>
                      </tr>


                  </tbody>
                </table>
                </div>
               </div>
               </div>


 <!--Section 2: General Requirements  -->



                    <div class="row">
          <div class="col-12">
            
                <div class="card">
        
              <div class="container-fluid">
        <!-- Section one product details  -->
        <div class="card card-default">
          <div class="card-header">
          <h3 class="card-title">Section 5: Payment details</h3>
             <div class="card-tools">
              <button type="button" class="btn btn-tool" data-card-widget="collapse">
                <i class="fas fa-minus"></i>
              </button>
              <button type="button" class="btn btn-tool" data-card-widget="remove">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
              <div class="card-body">
                
                <table class="table table-bordered  table-condensed table-striped">
                  <thead>
                  <tr>
                    <th>Lists</th>
                      <th>Name</th>
                      <th style="width: 40px">Yes</th>
                      <th style="width: 40px">No</th>
                      <th style="width: 40px">No Applicable </th>
                    </tr>
                  </thead>
                  <tbody>

                  <tr>
                      <td >Invoice Number</td>
                      <td > Generated Invoice Number  </td>
                  @foreach($check_list as $invoice_number )
                       <!--$invoice_number->invoice_number-->
                      @break
                      @endforeach
                         @if( $invoice_number->invoice_number == '')
                  <td ><input type="checkbox"  size="30" hieght="40"  id="Generated_Invoice_Number_yes" name="Generated_Invoice_Number" class="form-control"  width="40"/></td>
                         @else
                  <td ><input type="checkbox"  size="30" hieght="40"  checked disabled  id="Generated_Invoice_Number_yes" name="Generated_Invoice_Number" class="form-control"  width="40"/></td>
                         @endif
        <td ><input type="checkbox"  size="30" hieght="40"  id="Generated_Invoice_Number_no" name="Generated_Invoice_Number" class="form-control"  width="40"/></td>
                          <td></td>
                      </tr>

                   
                   <tr>
                      <td > Application Fee Paid<br></td>
                      <td > Checking Application Fee</td>
                      @foreach($check_list as $payment_status )@break
                      @endforeach
                      @if( $payment_status->payment_status == '1')
                      <td ><input type="checkbox"  size="30" hieght="40"  checked disabled id="checking_application_fee_yes" name="checking_application_fee" class="form-control"  width="40"/></td>
                      @else
                      <td ><input type="checkbox"  size="30" hieght="40"  id="checking_application_fee_yes" name="checking_application_fee" class="form-control"  width="40"/></td>
                      @endif
                     
                      <td ><input type="checkbox"  size="30" hieght="40"  id="checking_application_fee_no" name="checking_application_fee" class="form-control"  width="40"/></td>
                      <td></td>
                      </tr>


                          <tr>
                      <td >Receipt Number</td>
                       <td > Application Receipt Number</td>
                      @foreach($receipts_info as $receipts_number )
                          
                      @break
                      @endforeach
                      @if(  $receipts_number->receipt_number == '')
                      <td class="icheck-success d-inline"><input type="checkbox"  size="30" hieght="40"   id="Application_Receipt_Number_yes" name="Application_Receipt_Number" class="form-control"  width="40"/></td>
                      @else
                      <td ><input type="checkbox"  size="30" hieght="40"  checked disabled id="Application_Receipt_Number_yes" name="Application_Receipt_Number" class="form-control"  width="40"/></td>
                      @endif
                      
                      <td ><input type="checkbox"  size="30" hieght="40"  id="Application_Receipt_Number_no" name="Application_Receipt_Number" class="form-control"  width="40"/></td>
                      <td></td>
                      </tr>
                   
                  </tbody>
                </table>
                <div class="form-group">
                    <label for="exampleInputEmail1">Assessor Name</label>
                    <input type="text" name="assessor_name"  value=" {{ Auth::user()->first_name." ".Auth::user()->middle_name." ".Auth::user()->last_name }}"class="form-control" id="exampleInputEmail1" placeholder="Enter Assessor Name">
                  </div>


                      <div class="form-group">
                    <label for="exampleInputEmail1">Date</label>
                    <input type="date" name="date"  class="form-control" id="exampleInputEmail1" placeholder="Enter Assessor Name">
                  </div>
              <button class="btn btn-primary"  id="save_processed_check_list" > Save  </button> 
              </div>
              </div>
              </div>
            
              </div>















































              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
        </div>
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


<script>

$(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
  }); 
//applicable_expression
 $('#applicable_expression_yes').click(function () {
if( document.getElementById('applicable_expression_yes').checked==true) 
{ document.getElementById('applicable_expression_no').checked =false}
 });

 $('#applicable_expression_no').click(function () {
if( document.getElementById('applicable_expression_no').checked==true) 
{ document.getElementById('applicable_expression_yes').checked =false}
 });

 //applicable_appendices
 $('#applicable_appendices_yes').click(function () {
if( document.getElementById('applicable_appendices_yes').checked==true) 
{ document.getElementById('applicable_appendices_no').checked =false}
 });

 $('#applicable_appendices_no').click(function () {
if( document.getElementById('applicable_appendices_no').checked==true) 
{ document.getElementById('applicable_appendices_yes').checked =false}
 });


    //local_agent
    $('#applicable_appendices_yes').click(function () {
if( document.getElementById('local_agent_yes').checked==true) 
{ document.getElementById('local_agent_no').checked =false}
 });

 $('#local_agent_no').click(function () {
if( document.getElementById('local_agent_no').checked==true) 
{ document.getElementById('local_agent_yes').checked =false;
  document.getElementById('local_agent_yes').disabled =false;}
 });

   $('#local_agent_yes').click(function () {
if( document.getElementById('local_agent_yes').checked==true) 
{ 
  document.getElementById('local_agent_no').checked =false;
  document.getElementById('local_agent_yes').disabled =true;

  }
 });


    //manufacturer_information
    $('#manufacturer_information_yes').click(function () {
if( document.getElementById('manufacturer_information_yes').checked==true) 
{ document.getElementById('manufacturer_information_no').checked =false;
  document.getElementById('manufacturer_information_yes').disabled=true;}

 });

 $('#manufacturer_information_no').click(function () {
if( document.getElementById('manufacturer_information_no').checked==true) 
{ document.getElementById('manufacturer_information_yes').checked =false;
  document.getElementById('manufacturer_information_yes').disabled=false;}
 });



 //manufacturer_information
 $('#who_prequalification_yes').click(function () {
if( document.getElementById('who_prequalification_yes').checked==true) 
{ document.getElementById('who_prequalification_no').checked =false;
}
 });

 $('#who_prequalification_no').click(function () {
if( document.getElementById('who_prequalification_no').checked==true) 
{ document.getElementById('who_prequalification_yes').checked =false}
 });



//reference_stringent_regulatory
$('#reference_stringent_regulatory_yes').click(function () {
if( document.getElementById('reference_stringent_regulatory_yes').checked==true) 
{ document.getElementById('reference_stringent_regulatory_no').checked =false;
}
 });

 $('#reference_stringent_regulatory_no').click(function () {
if( document.getElementById('reference_stringent_regulatory_no').checked==true) 
{ document.getElementById('reference_stringent_regulatory_yes').checked =false}
 });



  //Enml Lists 
$('#enlm_yes').click(function () {
if( document.getElementById('enlm_yes').checked==true) 
{ document.getElementById('enlm_no').checked =false;
  document.getElementById('enlm_yes').disabled=true;}
 });

 $('#enlm_no').click(function () {
if( document.getElementById('enlm_no').checked==true) 
{ 
  document.getElementById('enlm_yes').checked =false;
  document.getElementById('enlm_yes').disabled=false;
  
  }
 });


     //Module Dossier
$('#module_one_yes').click(function () {
if( document.getElementById('module_one_yes').checked==true) 
{ document.getElementById('module_one_no').checked =false;
}
 });

 $('#module_one_no').click(function () {
if( document.getElementById('module_one_no').checked==true) 
{ document.getElementById('module_one_yes').checked =false}
 });



    //Module Dossier
$('#module_two_yes').click(function () {
if( document.getElementById('module_two_yes').checked==true) 
{ document.getElementById('module_two_no').checked =false;
}
 });

 $('#module_two_no').click(function () {
if( document.getElementById('module_two_no').checked==true) 
{ document.getElementById('module_two_yes').checked =false;
}
 });



//Module Dossier
$('#module_three_yes').click(function () {
if( document.getElementById('module_three_yes').checked==true) 
{ document.getElementById('module_three_no').checked =false}
 });

 $('#module_three_no').click(function () {
if( document.getElementById('module_three_no').checked==true) 
{ document.getElementById('module_three_yes').checked =false}
 });


   //Module Dossier
$('#module_four_yes').click(function () {
if( document.getElementById('module_four_yes').checked==true) 
{ document.getElementById('module_four_no').checked =false;
}
 });

 $('#module_four_no').click(function () {
if( document.getElementById('module_four_no').checked==true) 
{ document.getElementById('module_four_yes').checked =false}
 });

   //Module Dossier
   $('#module_five_yes').click(function () {
if( document.getElementById('module_five_yes').checked==true) 
{ document.getElementById('module_five_no').checked =false;
}
 });

 $('#module_five_no').click(function () {
if( document.getElementById('module_five_no').checked==true) 
{ document.getElementById('module_five_yes').checked =false}
 });





   //Module Dossier ctd formats
   $('#dossier_ctd_format_yes').click(function () {
if( document.getElementById('dossier_ctd_format_yes').checked==true) 
{ document.getElementById('dossier_ctd_format_no').checked =false;
}
 });

 $('#dossier_ctd_format_no').click(function () {
if( document.getElementById('dossier_ctd_format_no').checked==true) 
{ document.getElementById('dossier_ctd_format_yes').checked =false;
}
 });



  // Any other country yes
$('#any_other_country_yes').click(function () {
if( document.getElementById('any_other_country_yes').checked==true) 
{ document.getElementById('any_other_country_no').checked =false;
}
 });


    // Any other country yes
$('#any_other_country_no').click(function () {
if( document.getElementById('any_other_country_no').checked==true) 
{ document.getElementById('any_other_country_yes').checked =false;
}
 });

 $('#dossier_ctd_format_yes').click(function () {
if( document.getElementById('dossier_ctd_format_no').checked==true) 
{ document.getElementById('dossier_ctd_format_yes').checked =false}
 });



      //qis_prequalified_products
      $('#qis_prequalified_products_yes').click(function () {
if( document.getElementById('qis_prequalified_products_yes').checked==true) 
{ document.getElementById('qis_prequalified_products_no').checked =false;
}
 });

 $('#qis_prequalified_products_no').click(function () {
if( document.getElementById('qis_prequalified_products_no').checked==true) 
{ document.getElementById('qis_prequalified_products_yes').checked =false}
 });



       //qis_sra_crp
$('#qis_sra_crp_yes').click(function () {
if( document.getElementById('qis_sra_crp_yes').checked==true) 
{ document.getElementById('qis_sra_crp_no').checked =false;
}
 });

 $('#qis_sra_crp_no').click(function () {
if( document.getElementById('qis_sra_crp_no').checked==true) 
{ document.getElementById('qis_sra_crp_yes').checked =false}
 });


$('#authority_institution_information_yes').click(function () {
if( document.getElementById('authority_institution_information_yes').checked==true) 
{ document.getElementById('authority_institution_information_no').checked =false;
}
 });

 $('#authority_institution_information_no').click(function () {
if( document.getElementById('authority_institution_information_no').checked==true) 
{ document.getElementById('authority_institution_information_yes').checked =false}
 });




$('#inspection_report_yes').click(function () {
if( document.getElementById('inspection_report_yes').checked==true) 
{ document.getElementById('inspection_report_no').checked =false;
}
 });

 $('#inspection_report_no').click(function () {
if( document.getElementById('inspection_report_no').checked==true) 
{ document.getElementById('inspection_report_yes').checked =false}
 });

  $('#healthcare_professionals_smpc_yes').click(function () {
if( document.getElementById('healthcare_professionals_smpc_yes').checked==true) 
{ document.getElementById('healthcare_professionals_smpc_no').checked =false;
}
 });

 $('#healthcare_professionals_smpc_no').click(function () {
if( document.getElementById('healthcare_professionals_smpc_no').checked==true) 
{ document.getElementById('healthcare_professionals_smpc_yes').checked =false;}
 });


 $('#information_patient_user_yes').click(function () {
if( document.getElementById('information_patient_user_yes').checked==true) 
{ document.getElementById('information_patient_user_no').checked =false;
}
 });

 $('#information_patient_user_no').click(function () {
if( document.getElementById('information_patient_user_no').checked==true) 
{ document.getElementById('information_patient_user_yes').checked =false;
}
 });



   $('#ifapplicable_expression_yes').click(function () {
if( document.getElementById('ifapplicable_expression_yes').checked==true) 
{ document.getElementById('ifapplicable_expression_no').checked =false;
}
 });

 $('#ifapplicable_expression_no').click(function () {
if( document.getElementById('ifapplicable_expression_no').checked==true) 
{ document.getElementById('ifapplicable_expression_yes').checked =false}
 });



   $('#public_assessment_inspection_yes').click(function () {
if( document.getElementById('public_assessment_inspection_yes').checked==true) 
{ document.getElementById('public_assessment_inspection_no').checked =false;
}
 });

 $('#public_assessment_inspection_no').click(function () {
if( document.getElementById('public_assessment_inspection_no').checked==true) 
{ document.getElementById('public_assessment_inspection_yes').checked =false;
}
 });

$('#Authority_Information_yes').click(function () {
if( document.getElementById('Authority_Information_yes').checked==true) 
{ document.getElementById('Authority_Information_no').checked =false;
  document.getElementById('Authority_Information_yes').disabled=true;
  }
 });

 $('#Authority_Information_no').click(function () {
if( document.getElementById('Authority_Information_no').checked==true) 
{ document.getElementById('Authority_Information_yes').checked =false;
  document.getElementById('Authority_Information_yes').disabled=false;}
 });


   $('#Generated_Invoice_Number_yes').click(function () {
if( document.getElementById('Generated_Invoice_Number_yes').checked==true) 
{ document.getElementById('Generated_Invoice_Number_no').checked =false;
  document.getElementById('Generated_Invoice_Number_yes').disabled=true;
  }
 });

 $('#Generated_Invoice_Number_no').click(function () {
if( document.getElementById('Generated_Invoice_Number_no').checked==true) 
  { 
  document.getElementById('Generated_Invoice_Number_yes').checked =false;
  document.getElementById('Generated_Invoice_Number_yes').disabled = false;
  }
 });




$('#checking_application_fee_yes').click(function () {
if( document.getElementById('checking_application_fee_yes').checked==true) 
{ 
  
  document.getElementById('checking_application_fee_no').checked =false;
  document.getElementById('checking_application_fee_yes').disabled = true;
  }
 });

 $('#checking_application_fee_no').click(function () {
if( document.getElementById('checking_application_fee_no').checked==true) 
{ document.getElementById('checking_application_fee_yes').checked =false;
  document.getElementById('checking_application_fee_yes').disabled = false;}
 });



$('#Application_Receipt_Number_yes').click(function () {
if( document.getElementById('checking_application_fee_yes').checked==true) 
{ document.getElementById('checking_application_fee_no').checked =false;
  document.getElementById('Application_Receipt_Number_yes').disabled =true;
  }
 });

 $('#Application_Receipt_Number_no').click(function () {
if( document.getElementById('Application_Receipt_Number_no').checked==true) 
{ document.getElementById('Application_Receipt_Number_yes').checked =false;
  document.getElementById('Application_Receipt_Number_yes').disabled =false;}
 });




   $('#required_bridging_yes').click(function () {
if( document.getElementById('required_bridging_yes').checked==true) 
{ document.getElementById('required_bridging_no').checked =false;
}
 });

 $('#required_bridging_no').click(function () {
if( document.getElementById('required_bridging_no').checked==true) 
{ document.getElementById('required_bridging_yes').checked =false}
 });



      $('#Product_Characteristics_yes').click(function () {
if( document.getElementById('Product_Characteristics_yes').checked==true) 
{ document.getElementById('Product_Characteristics_no').checked =false;
}
 });

 $('#Product_Characteristics_no').click(function () {
if( document.getElementById('Product_Characteristics_no').checked==true) 
{ document.getElementById('Product_Characteristics_yes').checked =false}
 });
 

   
   $('#sample_recieved_yes').click(function () {
if( document.getElementById('sample_recieved_yes').checked==true) 
{ document.getElementById('sample_received_no').checked =false;
}
 });

 $('#sample_received_no').click(function () {
if( document.getElementById('sample_received_no').checked==true) 
{ document.getElementById('sample_recieved_yes').checked =false;
}
 });
                    

$('#sample_scheduled_yes').click(function () {
if( document.getElementById('sample_scheduled_yes').checked==true) 
{ document.getElementById('sample_scheduled_no').checked = false;
}
 });

 $('#sample_scheduled_no').click(function () {
if( document.getElementById('sample_scheduled_no').checked==true) 
{ document.getElementById('sample_scheduled_yes').checked =false}
 });
                    
$('#labelinfo_yes').click(function () {
if( document.getElementById('labelinfo_yes').checked==true) 
{ document.getElementById('labelinfo_no').checked =false;
}
 });

 $('#labelinfo_no').click(function () {
if( document.getElementById('labelinfo_no').checked==true) 
{ document.getElementById('labelinfo_yes').checked =false}
 });


$('#availability_packages_yes').click(function () {
if( document.getElementById('availability_packages_yes').checked==true) 
{ document.getElementById('availability_packages_no').checked =false;
}
 });

 $('#availability_packages_no').click(function () {
if( document.getElementById('availability_packages_no').checked==true) 
{ document.getElementById('availability_packages_yes').checked =false}
 });

                    

$('#manufacturing_premises_yes').click(function () {
if( document.getElementById('manufacturing_premises_yes').checked==true) 
{ document.getElementById('manufacturing_premises_no').checked =false;
}
 });

 $('#manufacturing_premises_no').click(function () {
if( document.getElementById('manufacturing_premises_no').checked==true) 
{ document.getElementById('manufacturing_premises_yes').checked =false;
}
 });



                    
  $('#sample_shelf_life_yes').click(function () {
if( document.getElementById('sample_shelf_life_yes').checked==true) 
{ document.getElementById('sample_shelf_life_no').checked =false;
}
 });

 $('#sample_shelf_life_no').click(function () {
if( document.getElementById('sample_shelf_life_no').checked==true) 
{ document.getElementById('sample_shelf_life_yes').checked =false}
 });


    $('#availability_certificate_analysis_yes').click(function () {
if( document.getElementById('availability_certificate_analysis_yes').checked==true) 
{ document.getElementById('availability_certificate_analysis_no').checked =false;
}
 });

 $('#availability_certificate_analysis_no').click(function () {
if( document.getElementById('availability_certificate_analysis_no').checked==true) 
{ document.getElementById('availability_certificate_analysis_yes').checked =false}
 });


  $('#sample_volume_yes').click(function () {
if( document.getElementById('sample_volume_yes').checked==true) 
{ document.getElementById('sample_volume_no').checked =false;
}
 });

 $('#sample_volume_no').click(function () {
if( document.getElementById('sample_volume_no').checked==true) 
{ document.getElementById('sample_volume_yes').checked =false;
}
 });
                    
 
$('#save_processed_check_list').click(function () {

        });
});

$(function () {
$.validator.setDefaults({
  submitHandler: function () {
    alert( "Form successful submitted!" );
    
      
    $.ajax({
        url: "{{ url('/save_check_list') }}",
        type: "POST",
        data: 
        {
         application_id:application_id,
         user_id:user_id,
         
         remark:remark,
        },
        success: function (data) {
          
     document.getElementById('invoice_id').value= data.invoice_generated;
     document.getElementById('rendered_template').innerHTML = data.rendered_template;
     document.getElementById('print_inv').style.display="block";
     document.getElementById('saveBtn').style.display="block";

  var Toast = Swal.mixin({
    toast: true,
    position: 'top-center',
    showConfirmButton: false,
    timer: 6000
  }); 

toastr.success("Invoice Generated successully")



        },
        error: function (data) {
            console.log('Error:', data);
            $('#saveBtn').html('Save Changes');
        }
    });

  }
});
$('#quickForm').validate({
  rules: {  
    email: {
      required: true,
      email: true,
    },
    assessor_name: {
      required: true,
      assessor_name: true,
    },

        date: {
      required: true,
      date: true,
    },
    password: {
      required: true,
      minlength: 5
    },
    terms: {
      required: true
    },
  },
  messages: {
    email: {
      required: "Please enter a email address",
      email: "Please enter a vaild email address"
    },
    date {
      required: "Please enter a valid Date",
  
    },

    assessor_name: {
      required: "Please enter assessor name",
      
    },
    password: {
      required: "Please provide a password",
      minlength: "Your password must be at least 5 characters long"
    },
    terms: "Please accept our terms"
  },
  errorElement: 'span',
  errorPlacement: function (error, element) {
    error.addClass('invalid-feedback');
    element.closest('.form-group').append(error);
  },
  highlight: function (element, errorClass, validClass) {
    $(element).addClass('is-invalid');
  },
  unhighlight: function (element, errorClass, validClass) {
    $(element).removeClass('is-invalid');
  }
});
});

</script>

    
<script rel="stylesheet" src="{{ asset('/app/lib/ajax/jquery/1.9.1/jquery.js')}}" ></script>
<script rel="stylesheet" src="{{ asset('/app/lib/ajax/jquery/3.3.1/jquery.min.js')}}" ></script>

<script rel="stylesheet" src="{{ asset('/app/lib/ajax/jquery-validate/1.19.0/jquery.validate.js')}}" ></script>
<script rel="stylesheet" src="{{ asset('/app/lib/1.10.16/js/jquery.dataTables.min.js')}}" ></script>
<script rel="stylesheet" src="{{ asset('/app/lib/4.1.3/js/bootstrap.min.js')}}" ></script>
<script rel="stylesheet" src="{{ asset('/app/lib/1.10.19/js/dataTables.bootstrap4.min.js')}}" ></script>

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


<script src="{{ asset('plugins/summernote/summernote-bs4.min.js') }}"></script>
<!-- CodeMirror -->
<script src="{{ asset('plugins/codemirror/codemirror.js') }}"></script>
<script src="{{ asset('plugins/codemirror/mode/css/css.js') }}"></script>
<script src="{{ asset('plugins/codemirror/mode/xml/xml.js') }}"></script>
<script src="{{ asset('plugins/codemirror/mode/htmlmixed/htmlmixed.js') }}"></script>
<!-- AdminLTE for demo purposes -->
<script src="{{ asset('dist/js/demo.js"></script>
<!-- Page specific script -->
<script>
  $(function () {
    // Summernote
    $('#summernote').summernote();
    $('#summernotee').summernote();

    // CodeMirror
    CodeMirror.fromTextArea(document.getElementById("codeMirrorDemo"), {
      mode: "htmlmixed",
      theme: "monokai"
    });
  })
</script>



@endsection