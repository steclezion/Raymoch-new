<div class="tab-pane fade active show" id="custom-tabs-three-overview"
     role="tabpanel" aria-labelledby="custom-tabs-three-overview-tab">
    <!-- this is overview tab -->
    <div class="row">
        <div class="col-md-6">

            <div class="card card-info col-md-10 offset-1">
                <div class="card-header">
                    <h3 class="card-title">General Info</h3>
                </div>
                <div class="card-body">
                    <label>Task Assigned to : </label>
                    {{ $dossier_evaluation_details->first_name }} {{ $dossier_evaluation_details->middle_name }}<br>
                    <label>Assigned Date : </label>
                    {{ $dossier_evaluation_details->assigned_datetime }}<br>
                    <label>Supervisor : </label>
                    {{ $dossier_evaluation_details->name }} {{ $dossier_evaluation_details->m_name }}<br>
                    <label>Dossier Ref.Num : </label>
                    {{ $dossier_evaluation_details->dossier_ref_num }}<br>
                    <label>Evaluation Mode : </label>
                    @if($dossier_evaluation_details->application_type==2)
                        Fast Track
                        @else
                    Standard Mode
                        @endif
                </div>
                <!-- /.card-body -->
            </div>
            <br>
            <div class="card card-green col-md-10 offset-1">
                <div class="card-header">
                    <h3 class="card-title">Company Info </h3>
                </div>
                <div class="card-body">
                    <label>Company Name : </label>{{ $company->trade_name }}<br>
                    <label>Address : </label>{{ $company->city }}<br>
                    <label>Phone.Num : </label>{{ $company->telephone }}<br>
                    <br/>
                    <label>Contact Person Name : </label>{{ $agent->first_name }} {{ $agent->middle_name }}<br>
{{--                    <label>Address : </label>{{ $agent->address_line_one }}<br>--}}
                    <label>Phone.Num : </label>{{ $agent->telephone }}<br>
                    <label>Email : </label>{{ $agent->email }}<br>


                </div>
                <!-- /.card-body -->
            </div>

        </div>
        <div class="col-md-6">
            <div class="card card-primary col-md-10 offset-1">
                <div class="card-header">
                    <h3 class="card-title">Drug Info</h3>
                </div>
                <div class="card-body">
                        <label>Trade Name : </label>{{ $dossier_evaluation_details->product_trade_name }}<br>
                    <label>Generic name of the product :  </label> {{ $dossier_evaluation_details->medicine_id }}<br>
                    <label>Dosage Form : </label>{{ $dossier_evaluation_details->dosage_name }}<br>
                    <label>Strength : </label>{{ $dossier_evaluation_details->strength_amount }}{{ $dossier_evaluation_details->strength_unit }}<br>
                </div>
                <!-- /.card-body -->
            </div>
            <br>
            <br>
            <div class="card card-lightblue col-md-10 offset-1">
                <div class="card-header">
                    <h3 class="card-title">Task/Progress</h3>
                </div>
                <div class="card-body">
                    <label>Current Task :
                    </label>{{ $dossier_evaluation_details->task_tracker_title }}
                    <br>

                    <label>Task Start Date :
                    </label>{{ $main_task->start_time }} 
                    
{{--                    @if($evaluation_document_progress->day_count != 0)--}}
                    <label>Evaluation day count: </label> 
                    {{$evaluation_document_progress->day_count}}/{{$main_task->task_duration_days_plan}}
{{--                    @endif--}}
                    <br>
                    <label>Progress Status :</label>
                    @if($main_task->task_status=='pause')
                    <label style="color: red">{{ $main_task->task_status }}</label><br>
                    <label>Pause Reason :</label>{{ $main_task->stopping_reason }}
                    @else
                    {{ $main_task->task_status }}
                    @endif




                    <div class="progress">
                        <div
                            class="progress-bar bg-gradient-green progress-bar-striped"
                            role="progressbar" aria-valuenow="40"
                            aria-valuemin="0" aria-valuemax="100"
                            style="width: {{  $dossier_evaluation_details->progress_percentage }}%">
                            <span >{{  $dossier_evaluation_details->progress_percentage }}% Complete </span>
                        </div>

                    </div>
                </div>
                <!-- /.card-body -->
            </div>
        </div>
    </div>


</div>
