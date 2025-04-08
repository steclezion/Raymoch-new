{{-----------  START DOSSIER TAB ----------------------}}

<div class="tab-pane fade" id="custom-tabs-three-dossier" role="tabpanel"
     aria-labelledby="custom-tabs-three-dossier-tab">

    {{-- start list of dossier files--}}
    <div class="card card-blue">
        <div class="card-header">
            <h3 class="card-title"><strong>Dossier Files</strong>
            </h3>

        {{-- <div class="card-tools">
             <button type="button" class="btn btn-tool"
                     data-card-widget="collapse">
                 <i class="fas fa-plus"></i>
             </button>
         </div>--}}
        <!-- /.card-tools -->
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
                            aria-sort="ascending" width="5%">S.N
                        </th>
                        <th class="sorting" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Title: activate to sort column ascending"
                            width="30%"> Description
                        </th>
                        <th rowspan="1" colspan="1" width="15%">Actions</th>
                    </tr>
                    </thead>
                            <tbody>
                        @php($i=1)
                    @foreach($dossier_files as $dossier_file)
                        <tr role="row" class="odd">
                            <td>{{$i++}}</td>
                            <td>{{$dossier_file->description}}</td>
                            <td>

                                <a href="{{ asset($dossier_file->path)}}" target="_blank"
                                   data-toggle="tooltip"
                                   class="btn btn-info btn-sm"
                                   data-placement="top"
                                   title="View the file"><i class="fas fa-book-open"></i></a>

                            </td>
                        </tr>
                    @endforeach
                    </tbody>

                </table>
            </div>


        </div>
        <!-- /.card-body -->
    </div>
    {{--end list of dossier files--}}


    {{-- start list of assigned dossier sections--}}
    <div class="card card-outline card-success">
        <div class="card-header">
            <h3 class="card-title"><strong>Assigned Dossier Sections</strong></h3>
            <div class="card-tools">
                <button type="button" class="btn btn-tool"
                        data-card-widget="collapse">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <!-- /.card-tools -->
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
                        <th class="sorting sorting_asc" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Reference Number: activate to sort column descending"
                            aria-sort="ascending" width="10%">Section Status
                        </th>
                        <th class="sorting" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Title: activate to sort column ascending"
                            width="12%">Assigned To
                        </th>
                        <th class="sorting" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Title: activate to sort column ascending"
                            width="15%">Assigned Date
                        </th>
                        <th class="sorting" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Title: activate to sort column ascending"
                            width="15%">Deadline
                        </th>

                        <th class="sorting" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Title: activate to sort column ascending"
                            width="15%">Received Date
                        </th>
                        <th rowspan="1" colspan="1" width="20%">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    @php($i=1)
                    @foreach($dossier_section_assignment as $assignment)
                        <tr role="row" class="odd">
                            <td>{{$i++}}</td>
                            <td>{{$assignment->status}}</td>
                            <td>{{$assignment->section_to_user_id}}</td>
                            <td>{{$assignment->section_sent_date}}</td>
                            <td>{{$assignment->section_deadline}}</td>
                            <td>{{$assignment->section_received_date}}</td>

                            <td>

                                @if ($assignment->section_received_date==null)

                                    <button type="button" class="btn btn-success btn-sm" title="Deadline Extension "
                                            data-toggle="modal"
                                            data-target="#modalextend_section"
                                            onclick="deadline_modal_section(this)" value="{{ $assignment->id }}" >
                                        <i class="fas fa-clock"></i>
                                    </button>
                                @endif


                                <button type="button" class="btn btn-primary btn-sm" data-toggle="modal"
                                        data-target="#modal_section_details" onclick="details_section(this)"
                                        value='{{ $assignment->id }}'>
                                    <i class="fas fa-list "></i>
                                </button>
                                <button type="button"
                                        data-toggle="modal"
                                        data-target="#deleteRecordModal"
                                        onclick="delete_document(this)" value=""
                                        title="Delete the document" class="btn btn-danger btn-sm"><i
                                            class="fas fa-trash "></i>
                                </button>
                            </td>
                        </tr>
                    @endforeach
                    </tbody>

                </table>
            </div>
            {{--  Modal for Section Assignment details  --}}
            <div class="modal fade" id="modal_section_details" data-backdrop="static" tabindex="-1" role="dialog"
                 aria-labelledby="modalextend" aria-hidden="true" >
                <div class="modal-dialog modal-lg" role="document">


                    <form action="{{ route('update_deadline') }}" method="POST">
                        @csrf
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Assigned Section Details</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">

                                {{--this is for the downloaded details--}}
                                <div class="card card-primary">
                                    <div class="card-header">
                                        <h3 class="card-title"><strong> Assignment Details</strong>
                                        </h3>
                                    </div>
                                    <div class="card-body inline" >
                                        <label>From: </label> <span id="section_send_from_id" ></span><br>
                                        <label>To: </label> <span id="section_send_to_id"> </span><br>
                                        <label>Sent Date:</label> <span id="section_send_date_id" ></span><br>
                                        <label>Deadline:</label> <span id="section_send_deadline_id" ></span><br>
                                        <label>Status:</label> <span id="section_status"  ></span><br>
                                        <label>View Sent Document::</label>
                                        <a id="section_sent_document_view" href="" target="_blank" data-toggle="tooltip" class="btn btn-info btn-sm"
                                           data-placement="top" title="View the file"><i class="fas fa-book-open"></i></a><br>



                                    </div>


                                </div>

                                {{--this is for the uploaded details--}}
                                <div class="card card-primary" id="section_received_view_id" hidden>
                                    <div class="card-header">
                                        <h3 class="card-title"><strong> Dossier Section Evaluation Assignment Response</strong>
                                        </h3>
                                    </div>
                                    <div class="card-body" >
                                        <label>From: </label> <span id="section_receive_from_id" ></span><br>
                                        <label>To:</label> <span id="section_receive_to_id" ></span><br>
                                        <label>Received Date:</label> <span id="section_receive_date_id" ></span><br>
                                        <label>View Received Document:</label>
                                        <a id="section_received_view" href="" target="_blank" data-toggle="tooltip" class="btn btn-info btn-sm"
                                           data-placement="top" title="View the file"><i class="fas fa-book-open"></i></a><br>

                                    </div>

                                </div>


                            </div>
                            <div class="modal-footer justify-content-between">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Back</button>
                                <button type="button" class="btn btn-success" data-dismiss="modal">Ok</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {{--  end of Modal for Section Assignment  --}}
            {{--  Modal for Extend Dossier Assesment deadline  --}}
            <div class="modal fade" id="modalextend_section" data-backdrop="static" tabindex="-1" role="dialog"
                 aria-labelledby="modalextend" aria-hidden="true">
                <div class="modal-dialog modal-md" role="document">

                    <form action="{{ route('update_deadline') }}" method="POST">
                        @csrf
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Extend Deadline.</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="form-group">
                                    <input type="text" name='section_deadline_id' id='section_deadline_id' hidden/>
                                    <input type="text" name='type' value='section' hidden/>
                                    <input type="text" name='hidden_dossier_asg_id'
                                           value='{{$dossier_evaluation_details->dossier_ass_id}}' hidden/>

                                </div>
                                <div class="form-group">
                                    <label> Reason for Extension :</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control" name="extend_reason">

                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Extened New Deadline :</label>
                                    <div class="input-group date" id="reservationdate" data-target-input="nearest">
                                        <input type="date" class="form-control" name="new_deadline">

                                    </div>
                                </div>


                            </div>
                            <div class="modal-footer justify-content-between">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-success">Extend</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {{--  end of Modal for extend deadline  --}}




            {{-- MODAL: start upload Dossier Assignment response  --}}
            <div class="modal fade" id="uploadDossierAssignmentResponseModal" data-backdrop="static" tabindex="-1" role="dialog"
                 aria-labelledby="uploadResponseModal" aria-hidden="true">
                <div class="modal-dialog modal-md" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Upload Assigned Evaluation Report</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">

                            <form name="upload_response" method="POST"
                                  action="{{route('upload_assigned_evaluation_response') }}"
                                  enctype="multipart/form-data">
                                @csrf


                                <div class="form-group">
                                    <label for="section_assigned_description">Description</label>
                                    <input name="section_assigned_description" type="text" class="form-control"
                                           id="description">
                                </div>

                                <div class="form-group">
                                    <label for="section_assigned_response_file">Assigned Dossier Section Evaluation</label>
                                    <div class="input-group">
                                        <div class="custom-file">
                                            <input type="file" name="section_assigned_response_file"
                                                   id="section_assigned_response_file"
                                                   class="custom-file-input">
                                            <label class="custom-file-label"
                                                   for="section_assigned_response_file">Choose
                                                file</label>
                                        </div>

                                    </div>
                                </div>

                                <input type="hidden" name="dossier_assignment_id"
                                       value="{{$dossier_evaluation_details->dossier_ass_id}}"/>
                                <input type="hidden" name="hidden_section_id" id="hidden_section_id" value=""/>
                                <div class="modal-footer justify-content-between">
                                    <button type="button" class="btn bg-white" data-dismiss="modal">Cancel</button>
                                    <button type="submit" class="btn btn-success">Upload</button>
                                </div>
                            </form>
                        </div> {{--modal-body--}}
                    </div>
                </div>
            </div>
            {{-- MODAL: end upload Dossier Assignment response--}}
        </div>
    </div>
    {{--start list of assigned dossier sections--}}


    {{--start send dossier section--}}
    <div class="card card-outline card-success collapsed-card">
        <div class="card-header">
            <h3 class="card-title"><strong>Assign Section</strong></h3>

            <div class="card-tools">
                <button type="button" class="btn btn-tool"
                        data-card-widget="collapse">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <!-- /.card-tools -->
        </div>
        <!-- /.card-header -->
        <div class="card-body" style="display: none;">

            <form method="post" action="{{ route('assign_dossier_section') }}"
                  enctype="multipart/form-data">
                @csrf

                <div class="form-group">

                    <div class="form-group">
                        <label> Section Description</label>
                        <input type="text" class="form-control"
                               name="description">
                    </div>

                    <div class="form-group">
                        <label for="nmfa_units">Assign To</label>
                        <select class="form-control select2 select2-hidden-accessible"
                                id='assigned_unit' name='assigned_user' style="width: 100%;" aria-hidden="true">
                           <option></option>
                            @foreach($users as $user)
                                <option value="{{$user->id}}" >{{$user->first_name}} {{$user->last_name}}</option>
                                @endforeach
                        </select>
                    </div>

                   {{-- <div class="form-group">
                        <label>Evaluation Form:</label>

                        <select  name="evaluation_form" id="evaluation_form_id" class="form-control">
                        @foreach($evaluation_document as $document)
                            <option value="{{$document->id}}">{{$document->name}}</option>
                            @endforeach
                        </select>
                    </div>--}}

                    <div class="form-group">
                        <label> Date Due</label>
                        <input type="date" class="form-control"
                               name="date_due">
                    </div>

                    <label for="dossier_section">Dossier Section (Attach Zip if multiple)</label>
                    <div class="input-group">
                        <div class="custom-file">
                            <input type="file" name="dossier_section_file"
                                   id="dossier_section_file"
                                   class="custom-file-input">
                            <label class="custom-file-label"
                                   for="dossier_section_file">Choose file</label>
                        </div>

                    </div>

                </div>

                <input type="hidden" name="hidden_dossier_assignment_id"
                       value="{{$dossier_evaluation_details->dossier_ass_id}}"/>
                <div class="card-footer" style="float:right">
                    <button class="btn btn-success" role="button">Assign
                    </button>
                </div>
            </form>
        </div>
        <!-- /.card-body -->
    </div>
    {{--end send dossier section--}}
</div>

{{--------------------END DOSSIER TAB ------------------}}
<script>
    function deadline_modal_section(o) {

        document.getElementById('section_deadline_id').value = o.value;
    }
    function section(o) {


        document.getElementById('hidden_section_id').value = o.value;

    }
    function edit_section_response_details(o) {
//         console.log(o);
// alert(o);

        document.getElementById('section_description').value = o.response_description;
        document.getElementById('section_edit_id').value = o.id;

    }
    function  details_section(o) {
        let id=o.value;

        $.ajax({

            type:'GET',

            url:"{{ route('retrieve_details') }}",

            data:{id:id,typ:'section'},

            success:function(data){
                //for sending part
                var document_path=data.sent_document.path;
                document.getElementById('section_send_from_id').innerText=data.data['section_from_user_id'];
                document.getElementById('section_send_to_id').innerText=data.data['section_to_user_id'];
                document.getElementById('section_send_date_id').innerText=data.data['section_sent_date'];
                document.getElementById('section_send_deadline_id').innerText=data.data['section_deadline'];
                document.getElementById('section_status').innerText=data.data['status'];
                document.getElementById('section_sent_document_view').href="http://127.0.0.1:8000/"+document_path;


                if (data.data.section_received_date==null){

                }
                else{
                    var document_path=data.received_document.path;
                    // alert(document_path);
//for receiving part
                    document.getElementById('section_received_view_id').hidden=false;
                    document.getElementById('section_receive_from_id').innerText=data.data['section_to_user_id'];
                    document.getElementById('section_receive_to_id').innerText=data.data['section_from_user_id'];
                    document.getElementById('section_receive_date_id').innerText=data.data['section_received_date'];
                    // var test="\{\{asset\("+document_path +"\)\}\}";
                    document.getElementById('section_received_view').href="http://127.0.0.1:8000/"+document_path;
                    // alert( document.getElementById('received_view').href)
                    // alert(data.qc['qc_deadline']);
                    //  alert(data.qc.qc_deadline);
                }
            },
            error:function(data) {
                console.log(data)

            }
        });

    }
</script>
