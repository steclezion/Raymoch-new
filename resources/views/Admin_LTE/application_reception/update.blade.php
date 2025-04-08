@extends('layouts.app_app')
@section('content')

<meta name="csrf-token" content="{{ csrf_token() }}">
  <!-- start: Css -->

  <!-- -->

<link rel="stylesheet" href="{{ asset('/app/lib/twitter-bootstrap/4.1.3/css/bootstrap.min.css')}}" >
<link rel="stylesheet" href="{{asset('plugins/datatables-bs4/css/dataTables.bootstrap4.min.css')}}">
<link rel="stylesheet" href="{{asset('plugins/datatables-responsive/css/responsive.bootstrap4.min.css')}}">
<link rel="stylesheet" href="{{asset('plugins/datatables-buttons/css/buttons.bootstrap4.min.css')}}">
<link rel="stylesheet" href="{{asset('plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css')}}">

<!--<link rel="stylesheet" href="{{ asset('3.3.6/bootstrap.min.css')}}" >-->
<link rel="stylesheet" href="{{ asset('/app/lib/1.10.16/css/jquery.dataTables.min.css')}}" >
<link rel="stylesheet" href="{{ asset('/app/lib/1.10.19/css/dataTables.bootstrap4.min.css')}}" >
    <!-- Select2 -->
<link rel="stylesheet" href="{{ asset('plugins/select2/css/select2.min.css')}}" >
<link rel="stylesheet" href="{{ asset('plugins/select2/css/select2.min.css')}}" >
<link rel="stylesheet" href="{{ asset('plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css')}}" >

<link rel="stylesheet" href="{{asset('plugins/select2/css/select2.min.css')}}">

<link rel="stylesheet" href="{{asset('plugins/toastr/toastr.min.css')}}">

<!-- plugins -->
<script rel="javascript" src="{{ asset('/app/lib/ajax/jquery/1.9.1/jquery.js')}}" ></script>
<script rel="javascript" src="{{ asset('/app/lib/ajax/jquery-validate/1.19.0/jquery.validate.js')}}" ></script>
<script rel="javascript" src="{{ asset('/app/lib/1.10.16/js/jquery.dataTables.min.js')}}" ></script>
<script rel="javascript" src="{{ asset('/app/lib/4.1.3/js/bootstrap.min.js')}}" ></script>
<script rel="javascript" src="{{ asset('/app/lib/1.10.19/js/dataTables.bootstrap4.min.js')}}" ></script>
<script rel="javascript" src="{{ asset('plugins/toastr/toastr.min.js')}}" ></script>
<script rel="javascript" src="{{ asset('plugins/sweetalert2/sweetalert2.min.js')}}" ></script>
<!-- Select2 -->

<script rel="stylesheet" src="{{ asset('plugins/select2/js/select2.full.min.js')}}" ></script>
<script src="{{asset('plugins/jquery/jquery.min.js')}}"></script>
<!-- Content Wrapper. Contains page content -->
<!-- Content Header (Page header) -->
    <!-- MultiStep Form -->


   
<div class="container-fluid" id="grad1">
    <div class="row justify-content-center mt-0">
        <div class="col-11 col-md-5 col-md-7 col-lg-10 text-center p-0 mt-3 mb-2">
        <div  class="alert alert-success align-content-sm-center" id="app_id" >@foreach($application_check_wizard as $app)  {{ $app->application_id  }}    @endforeach
</div>
            <div class="card px-0 pt-4 pb-0 mt-3 mb-3"  id="app_color">
                <h2><strong>Application Reception Process
 </strong></h2>
                <p>Fill all form fields to go to the next step</p>
                <input type="hidden" value="{{ Auth::user()->id }}" id="user_id" />
                <div class="row">
                    <div class="col-md-12 mx-0">
                        <form id="msform">
                            <!-- progressbar -->
                            <ul id="progressbar">
                               <li  @php if(in_array('0',$explode)) { echo "class='active'"; }  else  {}    @endphp   id="Application_Type" ><strong class="fas fa-supple">Application Type</strong></li>
                                <li @if(in_array('1',$explode))  class="active"  @else    @endif   id="supplier" class="fas fa-supple"><strong class="fas fa-supple" >Company Supplier</strong></li>
                                <li @if(in_array('2',$explode))  class="active"  @else    @endif   id="Agent"  class="fas fa-supple"><strong>Agent</strong></li>
                                <li @if(in_array('3',$explode))  class="active"  @else    @endif   id="product_details" class="fas fa-supple"><strong>Product Details</strong></li>
                                <li @if(in_array('5',$explode))  class="active"  @else    @endif   id="product_composition" class="fas fa-supple"><strong>Product Composition</strong></li>
                                <li  @if(in_array('4',$explode)) class="active"  @else    @endif   id="product_manufacturers" class="fas fa-supple"><strong>Product Manufacturers</strong></li>
                                <li @if(in_array('6',$explode))  class="active"  @else    @endif   id="product_manufacturers_api" class="fas fa-supple"><strong> API Product Manufacturers</strong></li>
                                <li @if(in_array('7',$explode))  class="active"  @else    @endif   id="dossier_sample" class="fas fa-supple"><strong> Dossier Link and Sample</strong></li>
                                <li @if(in_array('8',$explode))  class="active"  @else    @endif   id="decleration" class="fas fa-supple"><strong> Declaration</strong></li>
                                <li @if(in_array('9',$explode))  class="active"  @else    @endif   id="confirm"><strong>Finish</strong></li>
                              
                            </ul> <!-- fieldsets -->
                                 <!------------------------------   -->
                                 <!---------------------------------------------------------------------------------------------------------   -->

 @foreach($applications_status as $applications)  @endforeach  
 @foreach($country_contact_info as $country_contact_info)  @endforeach  
 @php if($applications->trade_name == '')  $action_button ='save_supplier_info';   else  $action_button='update_supplier_info'  @endphp
 
<input class="form-control" id="generated_application_id" type="hidden" name="Application_ID"  value="{{ $applications->application_id}}" />


   
          <fieldset  @php if(in_array('0',$explode)) { echo "style='display:none'"; }  else  {}    @endphp  id="type_application">

<div class="form-card">
<h2 class="fs-title">Application Type</h2>
<div class="row">
<div class="col-sm-3">
<label>New Application </label>  
</div>
<div class="col-sm-9"> 
<input class="form-control" checked disabled style="width:20px;position:float:left;"  id="app_new_application" type="radio" name="Application_type"   />

<div class="input-group mb-3"  style="width:20;position:float:left;" >
<select  style="display:none"   class="form-control" name="new_application_mode" id="new_application_mode"  required  onchange="start_applications(this.value)">
<option value="0" disable="true" selected="true">  </option>
<option value="1"> Standard Mode </option>

@foreach ($fast_track_applications as $key => $value)
<option value="2_{{ $value->name }}">Fast Track Mode {{ $value->name }}</option>
@endforeach
</select>
</div>
</div>

@foreach($application_check_wizard as $app)
<div  class="alert alert-success align-content-sm-center" id="" > Application ID: {{ $app->application_id  }} </div>
<br><br><br><br>
@if($app->application_type == 1)  
<div  class="alert alert-warning align-content-sm-center" id="" > Application Type: {{ 'Standard Mode'.$app->fast_track_details  }}    </div>
@else 
<div  class="alert alert-warning align-content-sm-center" id="" > Application Type: {{ 'Fast Track Mode'.$app->fast_track_details  }}    </div>
@endif
@endforeach

<div class="col-sm-3" hidden>
<label >Renew Application </label>  
</div>
<div class="col-sm-9" hidden> 
<input class="form-control"  style="width:20px;position:float:left;"  id="app_renewal_application" type="radio" name="Application_type"   />
<div class="input-group mb-3"  style="position:float:left;" >
<select    style="display:none" class="form-control" name="app_renew_new_application_mode" id="app_renew_new_application_mode"  required  onchange="start_applications(this.value)">
<option value="0" disable="true" selected="true"> </option>
<option value="1"> Standard Mode </option>
@foreach ($fast_track_applications as $key => $value)
<option value="2_{{ $value->name }}">Fast Track Mode {{ $value->name }}</option>
@endforeach
</select>

</select>
</div>
</div>   

<span style="display:none" ><label class="form-control">Applications for Variations </label>  <input class="form-control" id="app_variations" type="radio" name="Application_type"  /></span>


<div   style="display:none"class="col-sm-3">
<label >Request fast track/abridged registration </label>  
</div>
<div class="col-sm-9"  style="display:none">           
<input style="width:20px;position:float:left;"  class="form-control" id="app_fast_track_mode" type="radio" name="Application_type"  />

<div class="input-group mb-3"  style="width:200px;position:float:left;" >
<select  style="display:none" class="form-control" name="track_mode" id="app_select_mode"  required>
<option value="0" disable="true" selected="true"> Select Application Mode </option>
@foreach ($fast_track_applications as $key => $value)
<option value="{{$value->id}}">{{ $value->name }}</option>
@endforeach
</select>
</div>

</div>


</div>

       </div>
               

<input id="application_type_id"   name="application_type_name"    value=""   hidden/>
<input id="application_id"   name="application_name"    value=""  hidden/>
<span  id="appicaiton_save"  style="display:none"> <input   type="button" class="save action-buttonn" value="Save"    id="save_application_info"       ></span>
<span  id="applicaion_updatee"  style="display:none"> <input type="button" class="save action-update" value="Update"    id="update_application_info"      ></span>

<input type="button" name="next" class="next action-button" value="Next Step"  id="next_button_application"   />
                       
                       
</fieldset>


<!------------------------------------------------------------------------  -->

 <fieldset   @if(in_array('1',$explode))  style="display:none"    @else     @endif   id="supplier_wizard">



 <div class="container">   
    <div class="row">
    <div class="col-sm-6" style="background-color:lightgrey;">
    <lable> New Applicant  </label> 
    <input   id="new_applicant_update" type="radio"   name="check_trade"  > 
    <input   id="new_applicant" type="radio"  hidden name="check_trade"  > 
    </div>
    <div class="col-sm-6" style="background-color:lightgrey;">
    <lable> Registered Applicant  </label> 
    <input id="old_applicant_update"   type="radio"    name="check_trade"  /> 
    <input id="old_applicant"   type="radio"  hidden  name="check_trade"  /> 
    </div>
    </div>
    </div>
                                   
<div class="form-card"  style="font-family: "Times New Roman", Times, serif;">
<div class="row"  style="display:none" id="General_Supplier">
<div class="col-12 col-sm-6">
<h2 class="fs-title"> Applicant Information </h2>
<label> Bussiness Name</label>
<input class="form-control" type="text" name="trade_name"  value="{{ $applications->trade_name  }}" placeholder="Trade Name"  id="cs_trade_name"/>

<div style="display:block"   id="cs_tradename_exits">  
<label> Select Trade Name</label>   
<select class="form-control select2bs4" style="width: 100%;"  name="trade_names" id="trade_names"  required  onchange="check_trade_name(this.value)">
<option  selected="true"></option>
@foreach ($company_suppliers as $key => $value)
<option value="{{$value->trade_name}}">{{  $value->trade_name   }}  </option>
@endforeach
</select>
</div>         

<!--                                                               -->         
<div class="input-group mb-3">
<label> Country</label> 
<select class="form-control select2bs4" style="width: 100%;"  name="country_id" id="css_country"  onchange="fetch_tele(this.value,'cs_response_tele','{{url('/get_tele_code/tele_code')}}')"  required>
<option value="{{ @$applications->countryid  }}"><i style="color:red" >  {{ @$applications->country_name   }}     </i></option>
@foreach ($countries as $key => $value)
<option value="{{ $value->id }}">{{ $value->country_name }}</option>
@endforeach
</select>
</div>
                                    <label> City</label>
                                    <input class="form-control" id="cs_city" type="text" name="city"   value="{{ $applications->customer_city }}"  placeholder="City"  required>
                                    <label> State</label>
                                    <input class="form-control" id="cs_state"type="text" name="state" placeholder="State"  value="{{ $applications->Supplier_state }}"  /> 
                                    <label> Address line one</label>
                                    <input class="form-control" id="cs_address_line_one" type="text" name="address_line_one" placeholder="Address Line One" value="{{ $applications->Supplier_line_one_address }}" />
                                    <label> Address line two</label>
                                    <input class="form-control" id="cs_address_line_two" type="text" name="address_line_two" placeholder="Address Line Two"  value="{{ $applications->Supplier_line_two_address }}"/>
                                    <div id="cs_response_email"></div>
                                    <div id="cs_response_email_success" class="alert alert-success" style="display:none"></div>
		                            <div id="cs_response_email_danger" class="alert alert-danger" style="display:none"></div>
                                    <div id="cs_response_email_warning" class="alert alert-warning" style="display:none"></div>  
                                    <label> Email </label>
                                    <input class="form-control"  value="{{ $applications->email_supplier  }}" onkeyup="Email_Validate(this.value,'{{url('/Validate/email/customer_supply')}}','cs_response_email','{{ $action_button }}','cs_email')" id="cs_email" type="email" name="email" placeholder="Email" />
                                    <i class="fas fa-phone" id="cs_response_tele"> {{ $applications->customer_country_code }}    </i> 
                                    <label> Tele </label>
                                    <input class="form-control" id="cs_tele" type="text" name="telephone" placeholder="Tele"  value="{{ $applications->telephone_supplier }}" />
                                    <div id="cs_institutional_response_email"></div>
                                    <div id="cs_institutional_response_email_success" class="alert alert-success" style="display:none"></div>
		                            <div id="cs_institutional_response_email_danger" class="alert alert-danger" style="display:none"></div>
                                    <div id="cs_institutional_response_email_warning" class="alert alert-warning" style="display:none"></div>
                                    <label> Institutional Email </label>
                                    <input class="form-control" id="cs_institutional_email" type="email"   value="{{ $applications->institutional_email  }}"   name="institutional_email" placeholder="Institutional Email" onkeyup="Email_Validate(this.value,'{{url('/Validate/email/customer_supply')}}','cs_institutional_response_email','{{ $action_button }}','cs_institutional_email')"/> 
                                    
                                    
                                    <!--Validate URL from the backend section -->
                <div id="cs_response_website_url"></div>
                <div id="cs_response_website_url_danger" class="alert alert-danger" style="display:none"></div>
                <div id="cs_response_website_url_warning" class="alert alert-warning" style="display:none"></div>
                <div id="cs_response_website_url_success" class="alert alert-success" style="display:none"></div>
                <input class="form-control" id="cs_website_url" type="url" name="websete_url" placeholder="Website URL"  value=" {{ $applications->cs_webiste_url }} "onkeyup="valdiate_url(this.value,'cs_response_website_url','{{url('/Validate/url/customer_supply')}}','{{ $action_button }}')" /> 
                                   
                                   
                </div>

 <!--Contact Person Information />-->

                                    <div class="col-12 col-sm-6"> 
                                    <h2 class="fs-title">Applicant Contact Person</h2> 
                                    <label>First Name </label>
                                    <input class="form-control" id="cont_first_name" type="text" name="first_name" placeholder="First Name" value=" {{ $applications->cont_first_name }}"  required>
                                    <label> Middle Name</label>
                                    <input class="form-control" id="cont_middle_name" type="text" name="middle_name" placeholder="Middle Name"  value=" {{ $applications->cont_middle_name }}"  required>
                                    <label>Last Name </label>
                                    <input class="form-control" id="cont_last_name" type="text" name="last_name" placeholder="Last Name"   value=" {{ $applications->cont_last_name }} "  required>
                                    <label> Country</label>
                                    <div class="input-group mb-3">
                                    <select class="form-control" name="country_id" id="cont_country"  required  onchange="fetch_tele(this.value,'cont_response_tele','{{url('/get_tele_code/tele_code')}}')">
                                    <option value="{{ $country_contact_info->countryid }}" disable="true" selected="true"> @if( $country_contact_info->contact_country_name != '') {{ $country_contact_info->contact_country_name }}  @else '' @endif </option>
                                    @foreach ($countries as $key => $value)
                                   <option value="{{$value->id}}">{{ $value->country_name }}</option>
                                    @endforeach
                                    </select>
                                    </div>
                                    <label>City </label>
                                    <input class="form-control" id="cont_city"type="text" name="city" placeholder="City"   value=" {{ $applications->cont_city }} "  /> 
                                    <label>Address line one </label>
                                    <input class="form-control" id="cont_address_line_one" type="text" name="address_line_one" placeholder="Address Line One"    value=" {{ $applications->cont_line_one_address }} "  />
                                    <label>Address line two </label>
                                    <input class="form-control" id="cont_address_line_two" type="text" name="address_line_two" placeholder="Address Line Two"     value=" {{ $applications->cont_line_two_address }} "  />
                                    <div id="cont_response_email"></div>
                                    <div id="cont_response_email_success" class="alert alert-success" style="display:none"></div>
		                            <div id="cont_response_email_danger" class="alert alert-danger" style="display:none"></div>
                <div id="cont_response_email_warning" class="alert alert-warning" style="display:none"></div>
                <label>Email</label>
                <input class="form-control" id="cont_email" type="email" name="email" placeholder="Email"   onkeyup="Email_Validate(this.value,'{{url('/Validate/email/customer_contact')}}','cont_response_email','{{ $action_button }}','cont_email')"   value=" {{ $applications->email }} "  />
                <i class="fas fa-phone" id="cont_response_tele"> @if($country_contact_info->International_dialing != '') {{ $country_contact_info->International_dialing }}  @else '' @endif  </i> 
                <label> Tele</label>
                <input  class="form-control" id="cont_tele" type="text" name="telephone" placeholder="Tele"   value=" {{ $applications->cont_telephone }} "  />
                <div id="cont_response_website_url"></div>
                <div id="cont_response_website_url_danger" class="alert alert-danger" style="display:none"></div>
                <div id="cont_response_website_url_warning" class="alert alert-warning" style="display:none"></div>
    <div id="cont_response_website_url_success" class="alert alert-success" style="display:none"></div>
    <label> Website Url</label>
    <input class="form-control" id="cont_webiste_url" type="url" name="webiste_url" placeholder="Website URL"  onkeyup="valdiate_url(this.value,'cont_response_website_url','{{url('/Validate/url/customer_supply')}}','{{ $action_button }}')"    value=" {{ $applications->cont_url }} " />
    <label> Position</label>
    <input class="form-control" id="cont_position" type="text" name="position" placeholder="Position"   value=" {{ $applications->cont_position }} "  />
                                    </div>
                                    </div>
                                    </div> 
                         

<input id="contact_id"   name="contact_id"    value="{{ $applications->cont_id}}"   hidden/>
<input id="supplier_id"   name="supplier_id"    value="{{ $applications->company_suppliers_id}} "  hidden/>
@if($applications->trade_name == '')  
<span   id="cs_save"  style="display:block"> <input type="button" class="save action-buttonn"  value="Save"  id="save_supplier_info"       ></span>
@else
<span   id="cs_save" style="display:block"> <input type="button" class="save action-update" value="Update"    id="update_supplier_info"      ></span>
@endif

<input  type="button" name="previous" class="previous action-button-previous" value="Previous" />
<input  type="button" name="next" class="next action-button" id="cs_next_button" value="Next Step"   >
<!--<button type="button" class="btn btn-danger toastrDefaultError">Launch Error Toast </button>  -->                      
          
                         
                         
                          </fieldset>

                          <!------------------------------   -->

 @php
 if($agent_name == 1) 
 {foreach($agent_contact_info as $agent_contact_info) {} foreach($agent_contact_County_info as $agent_contact_County_info)  {}  $agent_trade_name=$agent_contact_info->business_name;$agent_state=$agent_contact_info->agent_state;$agent_address_line_one=$agent_contact_info->agent_address_line_one;$agent_address_line_two=$agent_contact_info->agent_address_line_two;$agent_city=$agent_contact_info->agent_city;$agent_postal_code=$agent_contact_info->agent_postal_code;$agent_country_code=$agent_contact_info->agent_country_code;$agent_telephone=$agent_contact_info->agent_telephone;$agent_webiste_url=$agent_contact_info->agent_webiste_url;$agent_email = $agent_contact_info->agent_email;$agent_cont_id= $agent_contact_info->cont_id;$agent_id= $agent_contact_info->agent_id;$agent_contact_person_first_name=$agent_contact_info->cont_first;$agent_contact_person_middle_name=$agent_contact_info->cont_middle;$agent_contact_person_last_name=$agent_contact_info->cont_last;$agent_contact_person_position=$agent_contact_info->cont_position;$agent_contact_person_city=$agent_contact_info->cont_city;$agent_contact_person_address_line_one=$agent_contact_info->cont_line_one;$agent_contact_person_address_line_two=$agent_contact_info->cont_line_two;$agent_contact_person_postal_code=$agent_contact_info->cont_postal_code;$agent_contact_person_telephone=$agent_contact_info->cont_tele;$agent_contact_person_webiste_url=$agent_contact_info->cont_url;$agent_contact_person_email=$agent_contact_info->cont_email;}
 else
 {$agent_cont_id= '';$agent_id= '';$agent_trade_name='';$agent_state="";$agent_address_line_one="";$agent_address_line_two="";$agent_city="";$agent_postal_code="";$agent_country_code="";$agent_telephone="";$agent_webiste_url="";$agent_email="";$agent_contact_person_first_name="";$agent_contact_person_middle_name="";$agent_contact_person_last_name="";$agent_contact_person_position="";$agent_contact_person_city="";$agent_contact_person_address_line_one="";$agent_contact_person_address_line_two="";$agent_contact_person_postal_code="";$agent_contact_person_telephone="";$agent_contact_person_webiste_url="";$agent_contact_person_email="";}
 @endphp
 
 @php if($agent_name == 1)  $action_button_ag ='update_agent_info';   else  $action_button_ag='save_agent_info';  @endphp
 
 <fieldset    @if(in_array('2',$explode))    style="display:none"    @else    @endif   id="Agent_wizard">
                        
 @php
 if($agent_name == 1) 
 {foreach($agent_contact_info as $agent_contact_info) {} foreach($agent_contact_County_info as $agent_contact_County_info)  {}
 }

 @endphp


    <div class="form-card">

    <div class="container">   
    <div class="row">
    <div class="col-12 col-sm-6"> 
    <h2 class="fs-title">Local Authorized Agent</h2> 
    <label> Agent Business Name</label>
    <input class="form-control" id="ag_trade_name" type="text" name="ag_trade_name"  value="{{   $agent_trade_name }}"      required>
                                    
                                   
                                   <!--  <div class="input-group mb-3">
                                      <input list="ag_trade_named">
                                     <datalist id="ag_trade_name" >
                                      @foreach ($agents as $key => $value)
                                       <option value="{{ $value->trade_name }}">
                                       @endforeach
                                       </datalist>
                                               </div>-->
                                
                                 <div class="input-group mb-3">
                                    <label> Country  </label>
                                    <select class="form-control" name="country_id" id="ag_country"  required  onchange="fetch_tele(this.value,'age_response_tele','{{url('/get_tele_code/tele_code')}}')">
                                    <!--<option value="0" disable="true" selected="true">Select Country</option>-->
                                    <option value="68">Eritrea</option>
                                    </select>
                                    </div>
                                    <label> Postal Code  </label>
                                    <input class="form-control" value="{{ $agent_postal_code}}"  id="ag_postal_code" type="text" name="postal_code" value=""  required>
                                    <label> City  </label>
                                    <input class="form-control"  value="{{$agent_city}}" id="ag_city" type="text" name="city" value=" "    required>
                                    <label> State  </label>
                                    <input class="form-control"  value="{{$agent_state}}" id="ag_state"type="text" name="state" value="" /> 
                                    <label> Address line one   </label>
                                    <input class="form-control" value="{{$agent_address_line_one}}" id="ag_address_line_one" type="text" name="address_line_one" value="" />
                                    <label> Address line two  </label>
                                    <input class="form-control" value="{{$agent_address_line_two}}" id="ag_address_line_two" type="text" name="address_line_two"  value="" />
                                    <div id="age_response_email"></div>
                                    <div id="ag_response_email_success" class="alert alert-success" style="display:none"></div>
		                            <div id="ag_response_email_danger" class="alert alert-danger" style="display:none"></div>
                                    <div id="ag_response_email_warning" class="alert alert-warning" style="display:none"></div>
                                    <label> Email  </label>
                                    <input value="{{ $agent_email }}"class="form-control" id="ag_email" type="email" value="" name="email"  onkeyup="Email_Validate(this.value,'{{url('/Validate/email/local_agent')}}','ag_response_email','{{  $action_button_ag  }}','ag_email')"/>
                                    <i class="fas fa-phone" id="age_response_tele">+291</i> 
                                    <label> Tele  </label>
                                    <input class="form-control"   value="{{ $agent_telephone   }}" id="ag_tele" type="text" min="0" value="" name="telephone"  />
                                    
                                    
                <div id="age_response_website_url"></div>
                <div id="age_response_website_url_danger" class="alert alert-danger" style="display:none"></div>
                <div id="age_response_website_url_warning" class="alert alert-warning" style="display:none"></div>
                <div id="age_response_website_url_success" class="alert alert-success" style="display:none"></div>
                <label> Web site Url </label>
                <input class="form-control" id="ag_website_url"  value="{{ $agent_webiste_url }}" placeceholder="Website URL"   onkeyup="valdiate_url(this.value,'age_response_website_url','{{url('/Validate/url/customer_supply')}}','{{  $action_button_ag  }}')"/>
                
                </div>
                       <!--Contact Person Information />-->
                       <div class="col-12 col-sm-6"> 
                                   <h2 class="fs-title">Local Authorized Contact Agent</h2> 
                                    <label> First Name  </label>
                                    <input value="{{ $agent_contact_person_first_name }}" class="form-control" id="cont_ag_first_name" type="text" name="first_name" placeholder="First Name"   required>
                                    <label> Middle Name </label>
                                    <input value="{{ $agent_contact_person_middle_name }}" class="form-control" id="cont_ag_middle_name" type="text" name="middle_name" placeholder="Middle Name"   required>
                                    <label> Last Name  </label>
                                    <input value="{{ $agent_contact_person_last_name }}" class="form-control" id="cont_ag_last_name" type="text" name="last_name" placeholder="Last Name"   required>
                                    <label> Country  </label>
                                    <div class="input-group mb-3">
                                    <select class="form-control" name="country_id" id="cont_ag_country_id"  required   onchange="fetch_tele(this.value,'cont_age_response_tele','{{url('/get_tele_code/tele_code')}}')">
                                   <!-- <option value="0" disable="true" selected="true">Select Country</option>-->
                                    <option value="68">Eritrea</option>
                                    </select>
                                    </div>
                                    <label> City  </label>
                                    <input value="{{ $agent_contact_person_city}}" class="form-control" id="cont_ag_city"type="text" name="city" value="" /> 
                                    <label> Address line one  </label>
                                    <input value="{{ $agent_contact_person_address_line_one }}" class="form-control" id="cont_ag_address_line_one" type="text" name="address_line_one"  value="" />
                                    <label> Address line two  </label>
                                    <input value="{{ $agent_contact_person_address_line_two }}" class="form-control" id="cont_ag_address_line_two" type="text" name="address_line_two" value="" />

                                    <div id="cont_ag_response_email"></div>
                                    <div id="cont_ag_response_email_success" class="alert alert-success" style="display:none"></div>
		                            <div id="cont_ag_response_email_danger" class="alert alert-danger" style="display:none"></div>
                                    <div id="cont_ag_response_email_warning" class="alert alert-warning" style="display:none"></div>
                                    <label> Email </label>
                                    <input value="{{ $agent_contact_person_email }}" class="form-control" id="cont_ag_email" type="email" name="email" placeholder="Email"  onkeyup="Email_Validate(this.value,'{{url('/Validate/email/customer_contact')}}','cont_ag_response_tele','{{$action_button_ag}}','cont_ag_email')" />
                                    <i class="fas fa-phone" id="cont_age_response_tele">+291</i> 
                                    <label> Tele  </label>
                                    <input value="{{ $agent_contact_person_telephone }}" class="form-control" id="cont_ag_tele"  name="telephone" placeholder="Tele"   type="number" min="0"/>

                <div id="cont_age_response_website_url"></div>
                <div id="cont_age_response_website_url_danger" class="alert alert-danger" style="display:none"></div>
                <div id="cont_age_response_website_url_warning" class="alert alert-warning" style="display:none"></div>
                <div id="cont_age_response_website_url_success" class="alert alert-success" style="display:none"></div>
                <label> Web Site Url  </label>     
         <input class="form-control" value="{{  $agent_contact_person_webiste_url}}"  id="cont_ag_webiste_url" type="url" name="webiste_url" value=""  onkeyup="valdiate_url(this.value,'cont_age_response_website_url','{{url('/Validate/url/customer_supply')}}','{{ $action_button_ag }}' )" />
         <label> Position  </label> 
         <input class="form-control" value="{{ $agent_contact_person_position }}" id="cont_ag_position" type="text" name="position" value="" />  </div> 
            </div>
            </div>
            </div>

<input id="agent_contact_id"   name="contact_name_agent"    value="{{ $agent_cont_id }}"   hidden/>
<input id="agent_id"   name="agent_name"    value="{{ $agent_id }}"  hidden/>


@if($agent_name==0) 
<span  id="ag_save"  style="display:block"> <input type="button" class="save action-buttonn" value="Save"    id="save_agent_info"       ></span>
@else
<span  id="ag_update"  style="display:block"> <input type="button" class="save action-update" value="Update"    id="update_agent_info"      ></span>
@endif
                    <input type="button" name="previous" class="previous action-button-previous" value="Previous" />
                    <input   type="button" name="next" class="next action-button" value="Next Step"  id="agent_next_button" />


                            </fieldset>

                  <!--------------------------------   -->

<fieldset   @if(in_array('3',$explode))     style="display:none"    @else    @endif   id="product_details_wizard">

 @php
 if($product_trade_name== 1)   
 {
     
     foreach($product_details as $product_details) {} 
     
        $product_trade_name =  $product_details->product_trade_namme;
        $medicine_id  =      $product_details->generic_product_name;
        $generic_id  =        $product_details->medicine_id;

        $dosage_name  =      $product_details->dosage_name;
        $dosage_id  =        $product_details->dosage_id;

        $route_administration_id =   $product_details->route_id;
        $route_administration_name = $product_details->route_name;

        $description =               $product_details->description;

        $strength_amount =           $product_details->strength_amount;
        $strength_unit =             $product_details->strength_unit;

        $pharmaco_therapeutic_classification = $product_details->pharmaco_therapeutic_classification;

        $storage_condition =         $product_details->storage_condition;
        $shelf_life_amount =         $product_details->shelf_life_amount;

        $shelf_life_unit =           $product_details->shelf_life_unit;
        $proposed_shelf_life_amount = $product_details->proposed_shelf_life_amount;

        $proposed_shelf_life_unit =   $product_details->proposed_shelf_life_unit;
        $proposed_shelf_life_after_reconstitution_amount = $product_details->proposed_shelf_life_after_reconstitution_amount;

        $proposed_shelf_life_after_reconstitution_unit =  $product_details->proposed_shelf_life_after_reconstitution_unit;
        $visual_description =        $product_details->visual_description;
        $commercial_presentation =   $product_details->commercial_presentation;;
        $container =                 $product_details->container;
        $packaging =                   $product_details->packaging;
        $category_use =              $product_details->category_use;
        $medicine_id = $product_details->medicine_id;

 }
else{
        $product_trade_name = '';
        $medicine_id  =  '';
        $dosage_name  = '';
        $dosage_id  = '';
        $generic_id  =  '';
        $route_administration_id = '' ;
        $route_administration_name ='';
        $description = '';
        $strength_amount = '';
        $strength_unit = '';
        $pharmaco_therapeutic_classification = '';
        $storage_condition ='';
        $shelf_life_amount = '';
        $shelf_life_unit = '';
        $proposed_shelf_life_amount = '';
        $proposed_shelf_life_unit = '';
        $proposed_shelf_life_after_reconstitution_amount = '';
        $proposed_shelf_life_after_reconstitution_unit = '';
        $visual_description = '';
        $commercial_presentation ='';
        $container = '';
        $packaging = '';
        $category_use =  '';
        $medicine_id = '';
        



}



@endphp
   
   
   <div class="form-card">
    <h2 class="fs-title">Product Details </h2>
    <div class="container">   
    <div class="row">
    
    <div class="col-12 col-sm-6">
    <label >Generic/Approved/International Non-proprietary Name(s): </label>  
    <select  style="display:block" class="form-control"   id="generic_approved_name"   name="Application_type" required  onchange="get_other_value(this.value,'generic_approved_name_other')">
    <option value="{{  $generic_id }}" disable="true" selected="true">{{ $medicine_id}}</option>
     @foreach ($medicines as $key => $value)
     <option value="{{$value->id}}">{{ $value->product_name }}</option>
     @endforeach
     </select>
     <br>

 <div style="display:none;color:orange"  id="international_name" >
  <label>Generic/Approved/International Non-proprietary Name(s) (if Other): </label>  
    &nbsp;&nbsp;
    <input class="form-control" id="generic_approved_name_other"   type="text" name="generic_approved_name"   />
</div>



            <label>Proprietary/Trade name of the product </label>  
            &nbsp;&nbsp;
            <input class="form-control" id="product_trade_name"  type="text" name="product_trade_name"   value="{{  $product_trade_name  }}"   />
     
            
            
            <label>Dosage Forms </label>  
             &nbsp;&nbsp;
            <select  style="display:block" class="form-control" id="dosage_form_id"  name="dosage_form_id"  required>
                                    <option value="{{$dosage_id}}" disable="true" selected="true">{{$dosage_name}}</option>
                                    @foreach ($dosage_forms as $key => $value)
                                   <option value="{{$value->id}}">{{ $value->name }}</option>
                                    @endforeach
                                    </select>  
                                    <br>
            <label>Route administration </label>  
            <select  style="display:block" class="form-control" id="route_administration_id" name="route_administration_id"    required>
            <option value="{{ $route_administration_id }}"  disable="true" selected="true">{{$route_administration_name}}</option>
            @foreach ($route_administrations as $key => $value)
            <option value="{{$value->id}}">{{ $value->name }}</option>
            @endforeach
            </select>

            <label>Description </label>  
            <input class="form-control" id="description" type="text" name="description"    value="{{$description}}" required/>
            
            <label>Strength Amount </label>  
            <input class="form-control" id="strength_amount" type="number" name="strength_amount" required  value="{{$strength_amount}}" />
            
            <label>Strength Unit</label>  
            <!--<input class="form-control" id="strength_unit" type="text" name="strength_unit"  required/>-->
            <select  style="display:block" id="strength_unit" type="text" name="strength_unit" class="form-control"   required >
            <option value="{{$strength_unit}}" disable="true" selected="true"><b style="color:red">{{$strength_unit}}</b></option>
            <option value="ml">Mililiter</option>
            <option value="mg">Miligram</option>
            </select>
            <br>
            <label>Storage Condition</label>  
            <input value="{{$storage_condition}}" class="form-control" id="storage_condition" type="text" name="storage_condition"  required/>
            
            <label>Shelf life Amount</label>  
            <input class="form-control" value="{{$shelf_life_amount}}"  id="shelf_life_amount" type="number"  placeholder="Days"   name="shelf_life_amount"  required/>
            
            <label>Shelf life Unit</label>  
             <input class="form-control"  value="{{$shelf_life_unit}}" id="shelf_life_unit" type="number" name="shelf_life_unit"  required/>
            
             <div class="row">
               
                    <div class="col-sm-6">
                      <!-- radio -->
                      <div class="form-group">
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="radio1"  id="months">
                          <label class="form-check-label">Months</label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="radio1"  id="years"checked>
                          <label class="form-check-label">Years</label>
                        </div>
                     
                      </div>
                    </div>
                  </div>

     </div>
     
     
             <div class="col-12 col-sm-6">
             <label>Pharmacotherapeutic Classification (Anatomic-Therapeutic Classification system):</label>  
             <input class="form-control"   value="{{$pharmaco_therapeutic_classification}}" id="pharmaco_therapeutic_classification" type="text" name="pharmaco_therapeutic_classification"  required/>


            <label>Proposed Shelf Life Amount</label>  
            <input class="form-control" value="{{$proposed_shelf_life_amount}}"   id="proposed_shelf_life_amount" type="text" name="proposed_shelf_life_amount"  required/>
            
            <label>Proposed Shelf life Unit</label>  
            <!--<input class="form-control"   value="{{$proposed_shelf_life_unit}}"  id="proposed_shelf_life_unit" type="text" name="proposed_shelf_life_unit"  placeholder="in-months" required/>-->
            <select  style="display:block" class="form-control" id="proposed_shelf_life_unit"  name="proposed_shelf_life_unit"  required  onchange="proposed_shelf(this.value,)">
            <option  selected="true"  value="{{$proposed_shelf_life_unit}}" > <i style="color:red"> {{ $proposed_shelf_life_unit }} <i></option>
            <option value="Month" >Month</option>
            <option value="Years" >Years</option>
            <option value="not_applicable"  >Not Applicable</option>
            </select>
            
            <label>Proposed Shelf Life After Reconstitution Amount</label>  
            <input class="form-control"    value="{{$proposed_shelf_life_after_reconstitution_amount}}" id="proposed_shelf_life_after_reconstitution_amount" type="text" name="proposed_shelf_life_after_reconstitution_amount"  required/>
            
            <!--<label>Proposed Shelf Life After Reconstitution Unit</label>  
            <input class="form-control"   id="proposed_shelf_life_after_reconstitution_unit" type="text" name="proposed_shelf_life_after_reconstitution_unit"  required/>
            -->
            <label>Proposed Shelf Life After Reconstitution Unit</label>  
            <!--<input class="form-control" id="proposed_shelf_life_after_reconstitution_unit" type="text" name="proposed_shelf_life_after_reconstitution_unit"  required/> -->
            <select  style="display:block" class="form-control" id="proposed_shelf_life_after_reconstitution_unit"  name="proposed_shelf_life_after_reconstitution_unit"  required  onchange="proposed_shelf(this.value,)">
            <option selected="true" value="{{$proposed_shelf_life_after_reconstitution_unit}}"> {{$proposed_shelf_life_after_reconstitution_unit}} </option>
            <option value="Days" >Days</option>
            <option value="Months"  >Months</option>
            </select>




            <label>Visual Description</label>  
            <input class="form-control" id="visual_description"    value="{{$visual_description}}" type="text" name="visual_description" required />
            
            <label>Commercial Presentation</label>  
            <input class="form-control" id="commercial_presentation" type="text"  value="{{$commercial_presentation}}" name="commercial_presentation"  required/>
            
            <label>Container</label>  
            <input class="form-control" id="container" type="text" name="container"   value="{{$container}}" required />
            
            <label>Packaging</label>  
            <input class="form-control" id="packaging" type="text" name="packaging"    value="{{$packaging}}" required />
            
            <label>Category of Use </label>  
             &nbsp;&nbsp;
            <select  style="display:block" class="form-control" id="category_use"  name="category_use"  required>
            <option  value="{{$category_use}}" disable="true" selected="true">{{$category_use}}</option>
            <option  value="POM (Prescription only medicine)" >POM (Prescription only medicine) </option>
            <option value="P (Pharmacy Medicine)">   P (Pharmacy Medicine)  </option>
            <option value= "OTC (Over The Counter medicine)" >OTC (Over The Counter medicine)  </option>
            </select>
            </div>
            </div>
            </div>
            </div>
         
<input id="product_detail_master_id"   name="product_detail_name"    value="{{ $medicine_id }}"   hidden/>

@if($product_trade_name == '')   
<span  id="product_detail_save"  style="display:block"> <input type="button" class="save action-buttonn" value="Save"    id="save_product_detail_info"       ></span>
@else
<span  id="product_detail_update"  style="display:block"> <input type="button" class="save action-update" value="Update"    id="update_product_detail_info"      ></span>
@endif
<input type="button" name="previous" class="previous action-button-previous" value="Previous" />

<input type="button" name="next" class="next action-button" value="Next Step"  id="product_detail_next_button" />
                 

</fieldset>



<!------------------------------------------------------------------------------------------>


<fieldset  @php if(in_array('5',$explode)) { echo "style='display:none'"; }  else  {}    @endphp  id="composition_pro">
        
        
        @php
        if($product_composition_name == 1)   
        {
       
            foreach($product_composition_info as $composition_info) {}
           $composition_name=$composition_info->composition_name;
           $medical_product_id = $composition_info->medical_product_id;
           $quantity=$composition_info->quantity;
           $reason=$composition_info->reason;
           $reference_standard=$composition_info->reference_standard;
           $type=$composition_info->type;
           $id= $composition_info->id;
        }
       
       
       else{
           $composition_name='';
           $medical_product_id = '';
           $quantity='';
           $reason='';
           $reference_standard='';
           $type='';
           $id='';
       
       }
        @endphp
       
                <div class="form-card">
                <h2 class="fs-title">Product Compostion</h2>
                    
       <div class="container">
                                      <!--  <div class="form-group">
                                         <label>Name INN</label>
                                          <select class="form-control select2" id="name_inn" style="width: 100%;">
                                          @foreach ($apis as $key => $value)
                                          <option value="{{$value->id}}">{{ $value->api_name }}</option>
                                           @endforeach
                                           <option value="other">Other</option>
                                           </select>
                                           </div>-->
         <div style="display:block"><span style="display:none" id="id_update_compostion"> {{$id}}</span>
                   <label>Name (INN)</label>  
                   <input class="form-control"  value="{{ $composition_name }}" id="name_inn_text_composition" type="text" name="name_inn_text_composition"  />   
                   </div>   
                   <label>Quantity</label>  
                   <input class="form-control"  value="{{ $quantity }}" id="quantity_composition" type="text" name="quantity_composition"  />
                   
                   <label>Reason for Inclusion</label>  
                   <input class="form-control"  value="{{ $reason }}" id="reason_inclusion_composition" type="text" name="reason_inclusion_composition"  />
                 
                   <label>Reference Standard</label>  
                   <input class="form-control"  value="{{ $reference_standard}}" id="reference_standard_composition" type="text" name="reference_standard_composition"  />
                 
                   <label>Composition Type</label>  
           <div class="col-9"> 
           <select class="form-control" id="composition_type_composition" name="composition_type_composition">
           <option   value="{{ $type }}">  {{ $type }} </option>
           <option  value="API">API (s),  </option>
           <option value="Excipients" > Excipients </option>
           <option value="Solvents"> Solvents      </option>
           </select>
           </div>
           <br/>
       
           
          
           @if($product_composition_name == 0)   
           <span  id="createNewCompostion_save"  style="display:block"> 
           <input type="button" class="save action-buttonn" value="Add"    id="createNewCompostion_save"       >
           </span>
           <span  id="createNewCompostion_update"  style="display:none"> 
           <input type="button" class="save action-update" value="Update"    id="createNewCompostion_update"       >
           </span>
           @else
           <span  id="createNewCompostion_save"  style="display:none"> 
           <input type="button" class="save action-buttonn" value="Add"    id="createNewCompostion_save"       >
           </span>
           <span  id="createNewCompostion_update"  style="display:block"> 
           <input type="button" class="save action-update" value="Update"    id="createNewCompostion_update"       >
           </span>
           @endif
           <br/>  <br/>
           <div class="container">
           <div class="table-responsive" style="display:block">          
           <table class="table"  id="table_product_compostion">
           
           <thead>
           <tr>
                        <th>ID</th>   
                        <th>ApplicationID</th>
                       <th>Name (INN)</th>
                       <th>Qauntity</th>
                       <th>Reason for Inclusion</th>
                       <th>Reference Standard</th>
                       <th>Composition Type</th>
                       <th>Action</th>
                    </tr>
               </thead>
               @if($product_composition_name == 1) 
               <tbody id='renderd_product_composition_table' {{ $i=1 }}>
               @foreach($product_composition_info as $product_composition)
             <tr>
                        <th>{{ $i++ }}</th>   
                        <th>{{ $product_composition->application_id  }}</th>
                       <th>{{ $product_composition->composition_name}}</th>
                       <th>{{ $product_composition->quantity }}</th>
                       <th>{{ $product_composition->reason }}</th>
                       <th>{{ $product_composition->reference_standard }}</th>
                       <th>{{ $product_composition->type}}</th>
                     
                      
                       <th> 
                <a href='#' class='btn btn-danger btn-sm' value='{{ $product_composition->application_id }}'  onclick='Delete_manufacture('{{ $product_composition->id }}')' ><i class='fas fa-trash'></i></a>
                </th>
            </tr>
            @endforeach
               </tbody>
               @else
               <tbody id='renderd_product_composition_table' >
               </tbody>
               @endif
           </table>
       </div>
       </div>
       
       
       </div>
             </div>
       
       
                           <input type="button" name="previous" class="previous action-button-previous" value="Previous" />
                           <input type="button" name="next" class="next action-button" value="Next Step"   id="next_composition" />
                                   </fieldset>

<!---------------  ------------------------------------------------------------>
 <fieldset  @if(in_array('4',$explode))    style="display:none"    @else    @endif   id="product_manufacturers_wizard">


 @php
 if($manufacturers_name == 1)   
 {

     foreach($product_manufacturers_info as $product_manufacturers) {}
    $manufacturer_name=   $product_manufacturers->manufac_name;
  //$medical_product_id = $product_manufacturers->medical_product_id;
    $city=                $product_manufacturers->city;
    $country_id=                $product_manufacturers->country_id;
    $country_name=                $product_manufacturers->country_name;
    $state=              $product_manufacturers->state;
    $addressline_one  =  $product_manufacturers->addressline_one;
    $addressline_two  =  $product_manufacturers->addressline_two ;
    $telephone=        $product_manufacturers->telephone;
    $country_code=        $product_manufacturers->country_code;
    $webiste_url=        $product_manufacturers->webiste_url;
    $email=        $product_manufacturers->email;
    $activity=        $product_manufacturers->activity;
    $block=        $product_manufacturers->block;
    $unit=        $product_manufacturers->unit;
    $postal_code= $product_manufacturers->postal_code;
    $manuf_id = $product_manufacturers->manufac_id;
 }


else{
    
    $manufacturer_name=  "";
    $medical_product_id ="";
    $country_id="";
    $country_name= "";
    $city="";
    $state= "";
    $addressline_one  =  "";
    $addressline_two  = "";
    $telephone="";
    $country_code= "";
    $webiste_url=  "";
    $email= "";
    $activity= "";
    $block= "";
    $unit="";
    $postal_code="";
    $manuf_id = "";

}
 @endphp


  <div class="form-card">
  <div class="container">
  <h2 class="fs-title">Product Manufacturer 
  
  <span class="badge"  id="id_for_update" style="display:none">{{ $manuf_id }}</span> 
  
  </h2>
  </div>

    <div class="container">  
    <div class="form-group"> 
    <div class="row">
    
    <div class="col-12 col-sm-6">
    <label>Name</label>  
        <input class="form-control" id="manufacturer_name" type="text" name="manufacturer_name"  value="{{ $manufacturer_name}}" />
        <label>Country</label>  
        <select class="form-control" name="manufacturer_country_id" id="manufacturer_country"  required>
                       <option  value="{{ $country_id }}" disable="true" selected="true">{{ $country_name }}</option>
                        @foreach ($countries as $key => $value)
                        <option value="{{$value->id}}">{{ $value->country_name }}</option>
                        @endforeach
        </select>
        <label>Postal Code</label>  
        <input class="form-control" id="manufacturer_postal_code" type="text" name="manufacturer_postal_code" value="{{ $postal_code }}" />
      
        <label>Telephone</label>  
        <input class="form-control" id="manufacturer_tele" type="text" name="manufacturer_tele"  value="{{ $telephone }}" />

        <label>City</label>  
        <input class="form-control" id="manufacturer_city" type="text" name="manufacturer_city" value="{{ $city }}"  />
        
        <label>Unit</label>  
        <input class="form-control" id="manufacturer_unit" type="text" name="manufacturer_unit" value="{{ $unit }}" />
        
        <label>Block</label>  
        <input class="form-control" id="manufacturer_block" type="text" name="manufacturer_block"  value="{{ $block }}"  />
        
    </div>
<div class="col-12 col-sm-6">
        <label>State</label>  
        <input class="form-control" id="manufacturer_state" type="text" name="manufacturer_state"  value="{{ $state }}" />
      
        <label>address Line one</label>  
        <input class="form-control" id="manufacturer_add_line_one" type="text" name="manufacturer_add_line_one"  value="{{ $addressline_one }}" />
      
        <label>Address Line Two</label>  
        <input class="form-control" id="manufacturer_add_line_two" type="text" name="manufacturer_add_line_two"  value="{{ $addressline_two }}" />
 
     <label>Website URL</label>  
        <input class="form-control" id="manufacturer_url" type="url" name="manufacturer_url"  value="{{ $webiste_url }}" />
      
        <label>Email</label>  
        <input class="form-control" id="manufacturer_email" type="email" name="manufacturer_email"  value="{{ $email }}" />
        
        <label>Activity</label>  
        <textarea class="form-control" id="manufacturer_activity" type="text" name="manufacturer_state" value="{{ $activity }}" >{{ $activity }} </textarea>  
    
    </div>
    </div>
    </div>
    </div>
    <br/>
    
  
 @if($manufacturers_name == 0)   
 
    <span  id="product_manufacturer_save"  style="display:block"> 
    <input type="button" class="save action-buttonn" value="Add"    id="save_product_manufacturer_save"       ></span>

      <span  id="product_manufacturer_update"  style="display:none"> 
    <input type="button" class="save action-update" value="Update"    id="updates_product_manufacturer_update"       ></span>
@else
<span  id="product_manufacturer_save"  style="display:none"> 
    <input type="button" class="save action-buttonn" value="Add"    id="save_product_manufacturer_save"       ></span>

    <span  id="product_manufacturer_update"  style="display:block"> 
    <input type="button" class="save action-update" value="Update"    id="updates_product_manufacturer_update"       ></span>
@endif


    <div class="container">
    <div class="table-responsive" style="display:block">          
     <table class="table" id="table_product_manufacturer"  >
    
    <thead>
    <tr style="color:orange;bg-color:black">
                <th>ID</th>
                <th>Application ID</th>
                <th>Name</th>
                <th>Country</th>
                <th>Postal Code</th>
                <th>Telephone</th>
                <th>State</th>
                <th>Address Ln1</th>
                <th>Address Ln2</th>
                <th>Website URL</th>
                <th>Activity</th>
                <th>block</th>
                <th>Unit</th>
                <th>Email</th>
                <th>City</th>
                <th width="300px">Action</th>
            </tr>
        </thead>
        @if($manufacturers_name == 1)   
        <tbody id='renderd_manufacturer_table' >
        @foreach($product_manufacturers_info as $products) 
        <tr>
                <th>{{$products->manu_id}}</th>
                <th>{{$products->application_id}}</th>
                <th>{{$products->manufac_name}}</th>
                <th>{{$products->country_name}}</th>
                <th>{{$products->postal_code}}</th>
                <th>{{$products->telephone}}</th>
                <th>{{$products->state}}</th>
                <th>{{$products->addressline_one}}</th>
                <th>{{$products->addressline_one}}</th>
                <th>{{$products->webiste_url}}</th>
                <th>{{$products->activity}}</th>
                <th>{{$products->block}}</th>
                <th>{{$products->unit}}</th>
                <th>{{$products->email}}</th>
                <th>{{$products->city}}</th>
                <th width="300px">Action</th>
        </tr>


        @endforeach
         </tbody>
         @else
         <tbody id='renderd_manufacturer_table' >
         </tbody>
         @endif
    </table>
</div>
</div>


      </div>


                    <input type="button" name="previous" class="previous action-button-previous" value="Previous" />
                    <input type="button" name="next" class="next action-button" value="Next Step"  id="product_manufacturer_next_button" />
                            </fieldset>

<!-------------------                        ---->
                          

<!---------------  ------------------------------------------------------------>

        <fieldset  @php if(in_array('',$explode)) { echo "style='display:none'"; }  else  {}    @endphp     id="product_manufacturers_api_wizard">
        <div class="form-card">
        <h2 class="fs-title">API Product Manufacturer</h2>

    <div class="container">  
    <div class="form-group"> 
    <div class="row">
    
    <div class="col-12 col-sm-6">
    <label>Name</label>  
        <input class="form-control" id="manufacturer_api_name" type="text" name="manufacturer_name"  />
        <label>Country</label>  
        <select class="form-control" name="manufacturer_api_country_id" id="manufacturer_api_country"  required>
                       <option value="0" disable="true" selected="true">=== Select Country ===</option>
                        @foreach ($countries as $key => $value)
                        <option value="{{$value->id}}">{{ $value->country_name }}</option>
                        @endforeach
        </select>
        <br/> 
           
        <label>Postal Code</label>  
        <input class="form-control" id="manufacturer_api_postal_code" type="text" name="manufacturer_api_postal_code"  />
      
        <label>Telephone</label>  
        <input class="form-control" id="manufacturer_api_tele" type="text" name="manufacturer_tele"  />

        <label>City</label>  
        <input class="form-control" id="manufacturer_api_city" type="text" name="manufacturer_api_city"  />
      
    </div>
<div class="col-12 col-sm-6">
        <label>State</label>  
        <input class="form-control" id="manufacturer_api_state" type="text" name="manufacturer_api_state"  />
      
        <label>address Line one</label>  
        <input class="form-control" id="manufacturer_api_add_line_one" type="text" name="manufacturer_api_add_line_one"  />
      
        <label>Address Line Two</label>  
        <input class="form-control" id="manufacturer_api_add_line_two" type="text" name="manufacturer_api_add_line_two"  />
 
     <label>Website URL</label>  
        <input class="form-control" id="manufacture_api_website_url" type="url" name="manufacturer_api_url"  />
      
        <label>Email</label>  
        <input class="form-control" id="manufacturer_api_email" type="email" name="manufacturer_api_email"  />
    
    </div>
    </div>
    </div>
    </div>
    <br/>
    
    <span  id="product_manufacturer_api_save"  style="display:block"> <input type="button" class="save action-buttonn" value="Add"    id="save_product_manufacturer_api_save"       ></span>
    <div class="container">
    <div class="table-responsive" style="display:block">          
     <table class="table">
    
    <thead>
    <tr>
                <th>ID</th>
                <th>ApplicationID</th>
                <th>Name</th>
                <th>Country</th>
                <th>Postal Code</th>
                <th>Telephone</th>
                <th>City</th>
                <th>State</th>
                <th>Address Ln1</th>
                <th>Address Ln2</th>
                <th>Website URL</th>
                <th>Email</th>
                <th width="300px">Action</th>
            </tr>
        </thead>
        <tbody id='renderd_manufacturer_api_table' >
        </tbody>
    </table>
</div>
</div>


      </div>


                    <input type="button" name="previous" class="previous action-button-previous" value="Previous" />
                    <input type="button" name="next" class="next action-button" value="Next Step"  id="product_manufacturer_api_next_button" />
                    </fieldset>


<!-------------------                        ---->
<fieldset @if(in_array('7',$explode))   style="display:none"   @else    @endif  id="dossier_sample_wizard"> 
        
         <div class="form-card">
         <h2 class="fs-title">Dossier and Sample Status</h2>
             
<div class="container">
<div class="row">
    <div class="col-sm-3">         
            <label>Dossier </label>  
    </div>
    <div class="col-sm-9">
            <input class="form-control" id="dossier_id" type="url" name="dossier_id"  
            Placeholder="Please zip the entire dossier and paste single link " />
    </div>
    <div class="col-sm-3">
        <label>Sample Status</label>  
        </div>
        <div class="col-sm-9">
            <input style="width:20px;position:float:left;" class="form-control" id="sample_status" type="checkbox" name="sample_status"  />
          </div>
           </div>

    
    <span  id="dossier_sample_id"  style="display:block"> 
    <input type="button" class="save action-buttonn" value="Save"    id="dossier_sample_save"       ></span>
    <span  id="dossier_update"  style="display:none"> 
    <input type="button" class="save action-update" value="Update"    id="dossier_sample_update"       ></span>
    
 

</div>
      </div>


                    <input type="button" name="previous" class="previous action-button-previous" value="Previous" />
                    <input type="button" name="next" class="next action-button" value="Next Step"   id="next_dossier_Status"   style="displa:none"/>
                            </fieldset>
                          

<!---------------  ------------------------------------------------------------>



<!-------------------                        ---->
<fieldset  @if(in_array('8',$explode))   style="display:none"   @else    @endif  id="decleration_wizard" >
        
         <div class="form-card">
         <h2 class="fs-title">Decleration </h2>
             
<div class="container">
                             
<style>
p.decleration 
{
    padding: 10px;
    text-align: justify;
    font-weight: bold;
    font-family: "Times New Roman", Times, serif;
}
</style>
              <!-- Default box -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Declaration  </h3>

          <div class="card-tools">
            <button type="button" class="btn btn-tool" data-card-widget="collapse" title="Collapse">
              <i class="fas fa-minus"></i>
            </button>
            <!--<button type="button" class="btn btn-tool" data-card-widget="remove" title="Remove">
              <i class="fas fa-times"></i>
            </button>-->
          </div>
        </div>
        <div class="card-body">

<p class="decleration"> 
I, the undersigned certify that all the information in this form and all accompanying documentation submitted to Eritrea for the registration of (name, strength and dosage form of the product) manufactured at (name and address of manufacturer) is true and correct. I further certify that I have examined the following statements and I attest to their correctness:- 
</P>

<p class="decleration">
1.	The current edition of the WHO Guidelines on good manufacturing Practices (GMP) for pharmaceuticals products or equivalent guideline is applied in full in all premises involved in the manufacture of this medicine. 
<br/>
2.	The formulation per dosage form correlates with the master formula and with the batch manufacturing record. 
<br/>
3.	The manufacturing procedure is exactly as specified in the master formula and batch manufacturing record.
<br/>
4.	Each batch of all starting materials is either tested or certified (in accompanying certificate of analysis for that batch) against the full specifications in the accompanying documentation and must comply fully with those specifications before it is released for manufacturing purposes. 
<br/>
5.	All batches of the active pharmaceutical ingredient(s) are obtained from the source(s) specified in the accompanying documentation. 
<br/>
6.	No batch of active pharmaceutical ingredient(s) will be used unless a copy of the batch certificate established by the manufacturer is available. 
<br/>
7.	Each batch of the container/closure system is tested or certified against the full specifications in the accompanying documentation and complies fully with those specifications before released for the manufacturing purposes. 
<br/>
8.	Each batch of the finished product is either tested, or certified (in an accompanying certificate of analysis for that batch), against the full specifications in the accompanying documentation and complies fully with release specifications before released for sale. 
<br/>
9.	The person releasing the product is an authorized person as defined by the WHO Guidelines on good manufacturing Practices (GMP) for pharmaceuticals products
<br/>
10.	The procedures for control of the finished product have been validated. The assay method has been validated for accuracy, precision, specificity and linearity. 
<br/>
11.	All the documentation referred to in this application is available for review during GMP inspection. 
<br/>
12.	Clinical trials (where applicable) were conducted in accordance with ICH, WHO or equivalent guidelines for Good Clinical Practice, 
<br/>
I also agree that: 
<br/>
13.	As a holder of marketing authorization/registration of the product I will adhere to Eritrean National Pharmacovigilance Policy requirements for handling adverse reactions. 
<br/>
14.	As holder of registration I will adhere to Eritrean requirements for handling batch recalls of the products.
<br/>
            </p>
          
            <div class="row">
            <div class="col-sm-3">
            <input style="width:20px;position:float-center;" class="form-control" id="i_agree" type="checkbox" name="i_agree"   />
            </div>
         
         <div class="col-sm-3">
         <label>I agree</label>  
        </div>

      
           </div>

             <div class="col-12 col-sm-6">
     
        <input class="form-control" id="decleration_name" type="text" name="decleration_name" placeholder="Name:"  />
        <input class="form-control" id="qualification" type="text" name="qualification"  placeholder="Qualification:" />
        <input class="form-control" id="position_in_the_company" type="text" name="Position_in_the_company" Placeholder="Position in the company"  />
        <input class="form-control" id="Signature" type="text" name="Signature"  Placeholder="Signature" />
        <input class="form-control" id="Date_decleration" type="date" name="Date"  />
        <textarea class="form-control" id="OfficialSeal: " type="text" name=": " Placeholder="Officialstamp" /></textarea>
    </div>
        </div>
        <!-- /.card-body -->
        <div class="card-footer">
          NMFA 
          @php
          $t=time();
          echo date("Y-m-d",$t);
      @endphp

          
        </div>
        <!-- /.card-footer-->
      </div>
           

    
    <span  id="decleration_id"  style="display:none"> 
    <input type="button" class="save action-buttonn" value="Save"    id="decleration_save"       ></span>
    <span  id="decleration_on__update"  style="display:none"> 
    <input type="button" class="save action-update" value="Update"    id="decleration_sample_update"       ></span>
    
 

</div>
      </div>


                    <input type="button" name="previous" class="previous action-button-previous" value="Previous" />
                    <input type="button" name="next" class="next action-button" value="Next Step"   id="next_decleration" />
                            
                            </fieldset>
                          

<!---------------  -----------------------------------------------------------

 

                            <fieldset  @if(in_array('8',$explode))    style="display:none"   @else    @endif>
                                <div class="form-card">
                                    <h2 class="fs-title">Payment Information</h2>
                                    <div class="radio-group">
                                        <div class='radio' data-value="credit"><img src="https://i.imgur.com/XzOzVHZ.jpg" width="200px" height="100px"></div>
                                        <div class='radio' data-value="paypal"><img src="https://i.imgur.com/jXjwZlj.jpg" width="200px" height="100px"></div> <br>
                                    </div> <label class="pay">Card Holder Name*</label> <input type="text" name="holdername" placeholder="" />
                                    <div class="row">
                                        <div class="col-9"> <label class="pay">Card Number*</label> <input type="text" name="cardno" placeholder="" /> </div>
                                        <div class="col-3"> <label class="pay">CVC*</label> <input type="password" name="cvcpwd" placeholder="***" /> </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-3"> <label class="pay">Expiry Date*</label> </div>
                                        <div class="col-9"> 
                                        <select class="list-dt" id="month" name="expmonth">
                                                <option selected>Month</option>
                                                <option>January</option>
                                                <option>February</option>
                                                <option>March</option>
                                                <option>April</option>
                                                <option>May</option>
                                                <option>June</option>
                                                <option>July</option>
                                                <option>August</option>
                                                <option>September</option>
                                                <option>October</option>
                                                <option>November</option>
                                                <option>December</option>
                                            </select> <select class="list-dt" id="year" name="expyear">
                                                <option selected>Year</option>
                                            </select> </div>
                                    </div>
                                </div>
								<input type="button" name="previous" class="previous action-button-previous" value="Previous" /> <input type="button" name="make_payment" class="next action-button" value="Confirm" />
                            </fieldset>


                            -->


                            <fieldset>
                                <div class="form-card">
                                    <h2 class="fs-title text-center">Success !</h2> <br><br>
                                    <div class="row justify-content-center">
                                        <div class="col-3"> <img src="https://img.icons8.com/color/96/000000/ok--v2.png" class="fit-image"> </div>
                                    </div> <br><br>
                                    <div class="row justify-content-center">
                                        <div class="col-7 text-center">
                                            <h5>You Have Successfully Signed Up</h5>
                                            </div> 
     
    <input type="button" name="previous" class="previous action-button-previous" value="Previous" /> 
    <input type="button" name="make_payment" class="next action-button" value="Confirm" />


                                        </div>
                                    </div>
                                </div>
                            </fieldset>
 
         
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
* {
    margin: 0;
    padding: 0
}

html {
    height: 100%
}

#grad1 {
    background-color: : #9C27B0;
    background-color: rgba(240, 226, 227, 0.815);
   /*background-image: linear-gradient(120deg, #FF4081, #81D4FA)*/
}

#msform {
    text-align: center;
    position: relative;
    margin-top: 20px
}

#msform fieldset .form-card {
    background: white;
    border: 0 none;
    border-radius: 0px;
    box-shadow: 0 2px 2px 2px rgba(0, 0, 0, 0.2);
    padding: 20px 40px 30px 40px;
    box-sizing: border-box;
    width: 94%;
    margin: 0 3% 20px 3%;
    position: relative
}

#msform fieldset {
    background: white;
    border: 0 none;
    border-radius: 0.5rem;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding-bottom: 20px;
    position: relative
}

#msform fieldset:not(:first-of-type) {
    display: none
}

#msform fieldset .form-card {
    text-align: left;
    color: #9E9E9E
}

#msform input,
#msform textarea {
    padding: 0px 8px 4px 8px;
    border: none;
    border-bottom: 1px solid #ccc;
    border-radius: 0px;
    margin-bottom: 25px;
    margin-top: 2px;
    width: 100%;
    box-sizing: border-box;
    font-family: montserrat;
    color: #2C3E50;
    font-size: 16px;
    letter-spacing: 1px
}

#msform input:focus,
#msform textarea:focus {
    -moz-box-shadow: none !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    border: none;
    font-weight: bold;
    border-bottom: 2px solid skyblue;
    outline-width: 0
}

#msform .action-button {
    width: 100px;
    background: blue;
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 2px;
    /* cursor: pointer;*/
    padding: 10px 5px;
    margin: 10px 5px;
    /*display:none*/;
}

#msform .action-update {
    width: 100px;
    background: rgba(250, 171, 0, 0.979);
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 0px;
    /* cursor: pointer;*/
    padding: 10px 5px;
    margin: 10px 5px
}

#msform .action-buttonn {
    width: 100px;
    background: rgba(12, 218, 12, 0.925);
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 0px;
     cursor: pointer
    padding: 10px 5px;
    margin: 10px 5px
}

#msform .action-button:hover,
#msform .action-button:focus {
    box-shadow: 0 0 0 2px white, 0 0 0 3px skyblue
}

#msform .action-button-previous {
    width: 100px;
    background: #616161;
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 0px;
    cursor: pointer;
    padding: 10px 5px;
    margin: 10px 5px
}

#msform .action-button-previous:hover,
#msform .action-button-previous:focus {
    box-shadow: 0 0 0 2px white, 0 0 0 3px #616161
}

select.list-dt {
    border: none;
    outline: 0;
    border-bottom: 1px solid #ccc;
    padding: 2px 5px 3px 5px;
    margin: 2px
}

select.list-dt:focus {
    border-bottom: 2px solid skyblue
}

.card {
    z-index: 0;
    border: none;
    border-radius: 0.5rem;
    position: relative
}

.fs-title {
    font-size: 25px;
    color: #2C3E50;
    margin-bottom: 10px;
    font-weight: bold;
    text-align: left
}

#progressbar {
    margin-bottom: 30px;
    overflow: hidden;
    color: lightgrey
}

#progressbar .active {
    color: #000000
}

#progressbar li {
    list-style-type: none;
    font-size: 12px;
    width:10%;
    float: left;
    position: relative
}

#progressbar #supplier:before {
    font-family: FontAwesome;
    content: "\f023"
}

#progressbar #Agent:before {
    font-family: FontAwesome;
    content: "\f007"
}

#progressbar #Application_Type:before {
    font-family: FontAwesome;
    content: "\f09d"
}

#progressbar #product_details:before {
    font-family: FontAwesome;
    content: "\f3f9"
}

#progressbar #product_composition:before {
    font-family: FontAwesome;
    content: "\f3f9"
}

#progressbar #product_manufacturers:before {
    font-family: FontAwesome;
    content: "\f3f9"
}

#progressbar #product_manufacturers_api:before {
    font-family: FontAwesome;
    content: "\f3f9"
}

#progressbar #dossier_sample:before {
    font-family: FontAwesome;
    content: "\f3f9"
}


#progressbar #decleration:before {
    font-family: FontAwesome;
    content: "\f3f9"
}

#progressbar #confirm:before {
    font-family: FontAwesome;
    content: "\f00c"
}

#progressbar li:before {
    width: 50px;
    height: 50px;
    line-height: 45px;
    display: block;
    font-size: 18px;
    color: #ffffff;
    background: lightgray;
    border-radius: 50%;
    margin: 0 auto 10px auto;
    padding: 2px
}

#progressbar li:after {
    content: '';
    width: 100%;
    height: 2px;
    background: lightgray;
    position: absolute;
    left: 0;
    top: 25px;
    z-index: -1
}

#progressbar li.active:before,
#progressbar li.active:after {
    background: blue
}

.radio-group {
    position: relative;
    margin-bottom: 25px
}

.radio {
    display: inline-block;
    width: 204;
    height: 104;
    border-radius: 0;
    background: lightblue;
    box-shadow: 0 2px 2px 2px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    cursor: pointer;
    margin: 8px 2px
}

.radio:hover {
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3)
}

.radio.selected {
    box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.1)
}

.fit-image {
    width: 100%;
    object-fit: cover
}
</style>

<script>
$(document).ready(function(){

var current_fs, next_fs, previous_fs; //fieldsets
var opacity;

$(".next").click(function(){

current_fs = $(this).parent();
next_fs = $(this).parent().next();

//Add Class Active
$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

//show the next fieldset
next_fs.show();
//hide the current fieldset with style
current_fs.animate({opacity: 0}, {
step: function(now) {
// for making fielset appear animation
opacity = 1 - now;

current_fs.css({
'display': 'none',
'position': 'relative'
});
next_fs.css({'opacity': opacity});
},
duration: 600
});
});

$(".previous").click(function(){

current_fs = $(this).parent();
previous_fs = $(this).parent().prev();

//Remove class active
$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

//show the previous fieldset
previous_fs.show();

//hide the current fieldset with style
current_fs.animate({opacity: 0}, {
step: function(now) {
// for making fielset appear animation
opacity = 1 - now;

current_fs.css({
'display': 'none',
'position': 'relative'
});
previous_fs.css({'opacity': opacity});
},
duration: 600
});
});

$('.radio-group .radio').click(function(){
$(this).parent().find('.radio').removeClass('selected');
$(this).addClass('selected');
});

$(".submit").click(function(){
return false;
})

});

</script>


<script>

$(document).ready(function(){
var  app_new_application = document.getElementById('app_new_application');
var  app_renewal_application = document.getElementById('app_renewal_application');
var  new_application_mode = document.getElementById('new_application_mode');
var  app_renew_new_application_mode = document.getElementById('app_renew_new_application_mode');



var  app_variations = document.getElementById('app_variations');
var  track_mode = document.getElementById('app_fast_track_mode');

//App New  Applications
 $("#app_new_application").click(function(){
    if((app_renewal_application.checked==true  ))
{
    $("#app_renew_new_application_mode").hide(); 
    $("#new_application_mode").show(); 
     app_renewal_application.checked=false;
     $('#appicaiton_save').hide();

}
else
{
    $("#app_renew_new_application_mode").hide(); 
    $("#new_application_mode").show(); 
     app_renewal_application.checked=false;
     $('#appicaiton_save').hide();


}
    
    });



 $("#app_renewal_application").click(function(){
    if((app_new_application.checked == true  ))
{
    $("#new_application_mode").hide(); 
    $("#app_renew_new_application_mode").show(); 
    app_new_application.checked = false;
    $('#appicaiton_save').hide();

}
else  
{
    $("#new_application_mode").hide(); 
    $("#app_renew_new_application_mode").show(); 
    app_new_application.checked = false;
    $('#appicaiton_save').hide();

}
    
    });

/*

//check Track mode from the Application new track mode Select Box
    $("#app_fast_track_mode").click(function(){
if((app_new_application.checked==true || app_variations.checked==true || app_renewal_application.checked==true  ))
{ 
    $("#app_select_mode").hide();  
   
    generated_application_id = document.getElementById('generated_application_id').value;
    if (generated_application_id == 0) {
        $('#appicaiton_save').show()
    }
}
else if(track_mode.checked == true )
{ 
    $("#app_select_mode").show(); 
  
    generated_application_id = document.getElementById('generated_application_id').value;
    if (generated_application_id == 0) {
        $('#appicaiton_save').show()
    }
}
    
    });

    ////check Track mode from the Application new track mode Select Box
    $("#app_variations").click(function(){
if((app_new_application.checked==true || app_variations.checked==true || app_renewal_application.checked==true  ))
{ 
    $("#app_select_mode").hide();  
  
    generated_application_id = document.getElementById('generated_application_id').value;
    if (generated_application_id == 0) {
        $('#appicaiton_save').show()
    }
}
else if(track_mode.checked == true )
{ 
    $("#app_select_mode").show(); 
 
    generated_application_id = document.getElementById('generated_application_id').value;
    if (generated_application_id == 0) {
        $('#appicaiton_save').show()
    }
}
    
    });

       ////check Track mode from the Application new track mode Select Box
       $("#app_renewal_application ").click(function(){
if((app_new_application.checked==true || app_variations.checked==true || app_renewal_application.checked==true  ))
{ 
    $("#app_select_mode").hide();  
    //$('#appicaiton_save').show();
    generated_application_id = document.getElementById('generated_application_id').value;
    if (generated_application_id == 0) {
        $('#appicaiton_save').show()
    }
}
else if(track_mode.checked == true )
{ 
    $("#app_select_mode").show(); 
    //$('#appicaiton_save').show();
    generated_application_id = document.getElementById('generated_application_id').value;
    if (generated_application_id == 0) {
        $('#appicaiton_save').show()
    }
}
    
    });

          ////check Track mode from the Application new track mode Select Box
          $("#app_new_application ").click(function(){
if((app_new_application.checked==true || app_variations.checked==true || app_renewal_application.checked==true  ))
{ 
    $("#app_select_mode").hide();  
    generated_application_id = document.getElementById('generated_application_id').value;
    if (generated_application_id == 0) {
        $('#appicaiton_save').show()
    }
}
else if(track_mode.checked == true )
{ 
    $("#app_select_mode").show(); 
   // $('#save_application_info').show();
     generated_application_id = document.getElementById('generated_application_id').value;
    if (generated_application_id == 0) {
        $('#appicaiton_save').show()
    }
}
    });



*/
});



</script>
<script>
  $(function () {
    //Initialize Select2 Elements
    $('.select2').select2();

    //Initialize Select2 Elements
    $('.select2bs4').select2({
      theme: 'bootstrap4'
    });


 //Initialize Select2 Elements
    $('.select2bs4').select2({
      theme: 'bootstrap4'
    });

    //Datemask dd/mm/yyyy
    $('#datemask').inputmask('dd/mm/yyyy', { 'placeholder': 'dd/mm/yyyy' });
    //Datemask2 mm/dd/yyyy
    $('#datemask2').inputmask('mm/dd/yyyy', { 'placeholder': 'mm/dd/yyyy' });
    //Money Euro
    $('[data-mask]').inputmask();

    //Date picker
    $('#reservationdate').datetimepicker({
        format: 'L'
    });

    //Date and time picker
    $('#reservationdatetime').datetimepicker({ icons: { time: 'far fa-clock' } });

    //Date range picker
    $('#reservation').daterangepicker();
    //Date range picker with time picker
    $('#reservationtime').daterangepicker({
      timePicker: true,
      timePickerIncrement: 30,
      locale: {
        format: 'MM/DD/YYYY hh:mm A'
      }
    });
    //Date range as a button
    $('#daterange-btn').daterangepicker(
      {
        ranges   : {
          'Today'       : [moment(), moment()],
          'Yesterday'   : [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days' : [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month'  : [moment().startOf('month'), moment().endOf('month')],
          'Last Month'  : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment().subtract(29, 'days'),
        endDate  : moment()
      },
      function (start, end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
      }
    );

    //Timepicker
    $('#timepicker').datetimepicker({
      format: 'LT'
    });

    //Bootstrap Duallistbox
    $('.duallistbox').bootstrapDualListbox();

    //Colorpicker
    $('.my-colorpicker1').colorpicker();
    //color picker with addon
    $('.my-colorpicker2').colorpicker();

    $('.my-colorpicker2').on('colorpickerChange', function(event) {
      $('.my-colorpicker2 .fa-square').css('color', event.color.toString());
    });

    $("input[data-bootstrap-switch]").each(function(){
      $(this).bootstrapSwitch('state', $(this).prop('checked'));
    })

  });
  // BS-Stepper Init
  document.addEventListener('DOMContentLoaded', function () {
    window.stepper = new Stepper(document.querySelector('.bs-stepper'))
  });

  // DropzoneJS Demo Code Start
  Dropzone.autoDiscover = false;

  // Get the template HTML and remove it from the doumenthe template HTML and remove it from the doument
  var previewNode = document.querySelector("#template");
  previewNode.id = "";
  var previewTemplate = previewNode.parentNode.innerHTML;
  previewNode.parentNode.removeChild(previewNode);

  var myDropzone = new Dropzone(document.body, { // Make the whole body a dropzone
    url: "/target-url", // Set the url
    thumbnailWidth: 80,
    thumbnailHeight: 80,
    parallelUploads: 20,
    previewTemplate: previewTemplate,
    autoQueue: false, // Make sure the files aren't queued until manually added
    previewsContainer: "#previews", // Define the container to display the previews
    clickable: ".fileinput-button" // Define the element that should be used as click trigger to select files.
  });

  myDropzone.on("addedfile", function(file) {
    // Hookup the start button
    file.previewElement.querySelector(".start").onclick = function() { myDropzone.enqueueFile(file) }
  });

  // Update the total progress bar
  myDropzone.on("totaluploadprogress", function(progress) {
    document.querySelector("#total-progress .progress-bar").style.width = progress + "%"
  });

  myDropzone.on("sending", function(file) {
    // Show the total progress bar when upload starts
    document.querySelector("#total-progress").style.opacity = "1";
    // And disable the start button
    file.previewElement.querySelector(".start").setAttribute("disabled", "disabled")
  });

  // Hide the total progress bar when nothing's uploading anymore
  myDropzone.on("queuecomplete", function(progress) {
    document.querySelector("#total-progress").style.opacity = "0"
  });

  // Setup the buttons for all transfers
  // The "add files" button doesn't need to be setup because the config
  // `clickable` has already been specified.
  document.querySelector("#actions .start").onclick = function() {
    myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED))
  };
  document.querySelector("#actions .cancel").onclick = function() {
    myDropzone.removeAllFiles(true)
  }
  // DropzoneJS Demo Code End



function start_applications(value){
console.log(value);
 $('#appicaiton_save').show()

  
}
</script>


  @include('layouts.custom_supplier_js')



@endsection