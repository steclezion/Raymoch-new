{{---------------- START OF ISSUE QUERY------------}}
<div class="tab-pane fade" id="custom-tabs-three-issue" role="tabpanel"
     aria-labelledby="custom-tabs-three-issue-tab">
    <div class="card card-blue">
        <div class="card-header">
            <h3 class="card-title">Query Issue Templates</h3>

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
                        <th class="sorting sorting_asc" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Reference Number: activate to sort column descending"
                            aria-sort="ascending" width="20%">Template Name
                        </th>
                        <th class="sorting" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Title: activate to sort column ascending"
                            width="40%">Descripiton
                        </th>
                        <th class="sorting" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Title: activate to sort column ascending"
                            width="20%">Template Type
                        </th>
                        <th rowspan="1" colspan="1" width="15%">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    @php($i=1)
                    @foreach($issuer_query_report_templates as $template)
                        <tr role="row" class="odd">
                            <td>{{$i++}}</td>
                            <td>{{$template->name}}</td>
                            <td>{{$template->description}}</td>
                            <td>{{$template->document_type}}</td>

                            <td>
                                @if($dossier_evaluation_details->locked==0)
                                <a href="{{route('view_html_template',['id'=>$template->id,'dossier_asg_id'=>$dossier_evaluation_details->dossier_ass_id])}}"
                                   data-toggle="tooltip"
                                   class="btn btn-info btn-sm"
                                   data-placement="top"
                                   title="view the Template"><i
                                        class="fas fa-eye "></i></a>
                                @if($main_task->task_status!='pause')
                                    <button type="button" class="btn btn-success btn-sm"
                                            title="Send Query to Applicant"
                                            data-toggle="modal"
                                            data-target="#modalsend_query">
                                        <i class="fas fa-arrow-alt-circle-right"></i>
                                    </button>
                                    @endif

                                    @endif
                            </td>
                        </tr>
                    @endforeach
                    </tbody>

                </table>
            </div>

        </div>


    </div>

{{--    Send Query modal--}}

    <div class="modal fade" id="modalsend_query" data-backdrop="static" tabindex="-1" role="dialog"
         aria-labelledby="modalsend_query" aria-hidden="true">
        <div class="modal-dialog modal-md" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Send Query</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">

                    <form name="upload_response" method="POST"
                          action="{{route('send_query_issue') }}"
                          enctype="multipart/form-data">
                        @csrf

                        <div class="form-group">
                            <label for="description">Subject</label>
                            <input name="query_subject" type="text" class="form-control"
                                   >
                        </div>
                        <div class="form-group">
                            <label>Deadline Due:</label>
                            <div class="input-group date" id="reservationdate" data-target-input="nearest">
                                <input type="date" class="form-control" name="query_deadline">

                            </div>
                        </div>

                        <div class="form-group">
                            <label for="query_response_cover_letter">Query Letter</label>
                            <div class="input-group">
                                <div class="custom-file">
                                    <input type="file" name="query_latter"
                                           id="query_latter"
                                           class="custom-file-input">
                                    <label class="custom-file-label"
                                           for="query_response_cover_letter">Choose
                                        file</label>
                                </div>

                            </div>
                        </div>



                        <input type="hidden" name="dossier_assignment_id" value="{{$dossier_evaluation_details->dossier_ass_id}}"/>
                        <div class="modal-footer justify-content-between">
                            <button type="button" class="btn bg-white" data-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-success">Send Query</button>
                        </div>
                    </form>
                </div> {{--modal-body--}}
            </div>
        </div>
    </div>

    {{--  End of Send Query Modal--}}


    {{---------- start list of uploaded documents -------------}}

    <div class="card card-outline card-success collapsed-card">
        <div class="card-header">
            <h3 class="card-title"><strong>Issued Query History</strong>
            </h3>

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
                        <th class="sorting sorting_asc" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Reference Number: activate to sort column descending"
                            aria-sort="ascending" width="12%"> Name
                        </th>
                        <th class="sorting" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Title: activate to sort column ascending"
                            width="14%"> Query Status
                        </th>
                        <th class="sorting" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Title: activate to sort column ascending"
                            width="14%"> Issued Date
                        </th>
                        <th class="sorting" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Title: activate to sort column ascending"
                            width="14%"> Received Date
                        </th>
                        <th class="sorting" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Title: activate to sort column ascending"
                            width="14%"> Deadline
                        </th>
                        <th rowspan="1" colspan="1" width="20%">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    @php($i=1)
                    @foreach($issue_query_documents as $query)
                        <tr role="row" class="odd" id="description">
                            <td>{{$i++}}</td>
                            <td>{{$query->name}}</td>
                            <td>{{$query->status}}</td>
                            <td>{{$query->query_sent_date}}</td>
                            <td>{{$query->query_received_date}}</td>
                            <td>{{$query->query_deadline}}</td>

                            <td>


                                @if ($query->query_received_date==null)
                                    <button
                                        data-toggle="modal"
                                        data-target="#uploadResponseModal"
                                        class="btn btn-info btn-sm"
                                        title="Submit response (reply) for this query"
                                        onclick="get_query_name(this, {{ $query->id}})" value="{{ $query->name }}">
                                        <i class="fas fa-upload"></i></button>
                                    @if ($query->query_extend_count>=2)
                                        <button type="button" class="btn btn-success btn-sm"
                                                title="Deadline Extension Limit Reached"
                                                data-toggle="modal"
                                                data-target="#modalextend_query"
                                                onclick="deadline_modal_query(this)" value="{{ $query->id }}" disabled>
                                            <i class="fas fa-clock"></i>
                                        </button>
                                    @else
                                        <button type="button" class="btn btn-success btn-sm" title="Extend Deadline"
                                                data-toggle="modal"
                                                data-target="#modalextend_query"
                                                onclick="deadline_modal_query(this)" value="{{ $query->id }}">
                                            <i class="fas fa-clock"></i>
                                        </button>
                                    @endif
                                    @else
                                    <button
                                            data-toggle="modal"
                                            data-target="#editResponseModal"
                                            class="btn btn-primary btn-sm"
                                            title="edit details, re-upload file"
                                            onclick="edit_response_details(this, {{ $query }})" value="{{ $query->name }}">
                                        <i class="fas fa-edit"></i></button>
                                @endif


                                <button type="button" class="btn btn-primary btn-sm" data-toggle="modal"
                                        data-target="#modal_query_details" onclick="details_query(this)"
                                        value='{{ $query->id }}'>
                                    <i class="fas fa-list "></i>
                                </button>
{{--                                <button type="button"--}}
{{--                                        data-toggle="modal"--}}
{{--                                        data-target="#deleteRecordModal"--}}
{{--                                        onclick="delete_document(this)" value=""--}}
{{--                                        title="Delete the document" class="btn btn-danger btn-sm"><i--}}
{{--                                        class="fas fa-trash "></i>--}}
{{--                                </button>--}}

                            </td>
                        </tr>
                    @endforeach
                    </tbody>

                </table>
            </div> {{-- end div: example1_wrapper--}}

            {{--  Modal for Qc details  --}}
            <div class="modal fade" id="modal_query_details" data-backdrop="static" tabindex="-1" role="dialog"
                 aria-labelledby="modalextend" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">


                    <form action="{{ route('update_deadline') }}" method="POST">
                        @csrf
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Query Details</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">

                                {{--this is for the downloaded details--}}
                                <div class="card card-primary">
                                    <div class="card-header">
                                        <h3 class="card-title"><strong> Issued Query</strong>
                                        </h3>
                                    </div>
                                    <div class="card-body inline">
                                        <label>Name: </label> <span id="query_name"></span><br>
                                        <label>From: </label> <span id="query_send_from_id"></span><br>
                                        <label>To: </label> <span id="query_send_to_id"> </span><br>
                                        <label>Sent Date:</label> <span id="query_send_date_id"></span><br>
                                        <label>Deadline:</label> <span id="query_send_deadline_id"></span><br>
                                        <label>Status:</label> <span id="query_status"></span><br>
                                        <label>View Sent Document:</label>
                                        <a id="query_sent_document_view" href="" target="_blank" data-toggle="tooltip"
                                           class="btn btn-info btn-sm"
                                           data-placement="top" title="View the file"><i
                                                class="fas fa-book-open"></i></a>


                                    </div>


                                </div>

                                {{--this is for the uploaded details--}}
                                <div class="card card-primary" id="query_received_view_id" hidden>
                                    <div class="card-header">
                                        <h3 class="card-title"><strong> Received Query Response</strong>
                                        </h3>
                                    </div>
                                    <div class="card-body">
                                        <label>From: </label> <span id="query_receive_from_id"></span><br>
                                        <label>To:</label> <span id="query_receive_to_id"></span><br>
                                        <label>Received Date:</label> <span id="query_receive_date_id"></span><br>
                                        <label>View Received Document:</label>
                                        <a id="received_view" href="" target="_blank" data-toggle="tooltip"
                                           class="btn btn-info btn-sm"
                                           data-placement="top" title="View the file"><i
                                                class="fas fa-book-open"></i></a><br>

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
            {{--  end of Modal for query details  --}}

            {{--  Modal for Extend deadline  --}}
            <div class="modal fade" id="modalextend_query" data-backdrop="static" tabindex="-1" role="dialog"
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
                                    <input type="text" name='query_id' id='query_id' hidden/>
                                    <input type="text" name='type' value='query' hidden/>
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


            {{-- MODAL: start upload response of issue --}}
            <div class="modal fade" id="uploadResponseModal" data-backdrop="static" tabindex="-1" role="dialog"
                 aria-labelledby="uploadResponseModal" aria-hidden="true">
                <div class="modal-dialog modal-md" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Upload Response</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">

                            <form name="upload_response" method="POST"
                                  action="{{route('upload_query_response') }}"
                                  enctype="multipart/form-data">
                                @csrf

                                <div class="form-group">
                                    <label for="description">Response for Query:</label>
                                    <input name="query_name_placeholder" type="text" class="form-control"
                                           id="query_name_placeholder" disabled>
                                </div>
                                <div class="form-group">
                                    <label for="description">Description</label>
                                    <input name="description" type="text" class="form-control"
                                           id="description">
                                </div>

                                <div class="form-group">
                                    <label for="query_response_cover_letter">Query Response Cover Letter</label>
                                    <div class="input-group">
                                        <div class="custom-file">
                                            <input type="file" name="query_response_cover_letter"
                                                   id="query_response_cover_letter"
                                                   class="custom-file-input">
                                            <label class="custom-file-label"
                                                   for="query_response_cover_letter">Choose
                                                file</label>
                                        </div>

                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="query_response_file">Query Response</label>
                                    <div class="input-group">
                                        <div class="custom-file">
                                            <input type="file" name="query_response_file"
                                                   id="query_response_file"
                                                   class="custom-file-input">
                                            <label class="custom-file-label"
                                                   for="query_response_file">Choose .zip
                                                file</label>
                                        </div>

                                    </div>
                                </div>

                                <input type="hidden" name="dossier_assignment_id"
                                       value="{{$dossier_evaluation_details->dossier_ass_id}}"/>
                                <input type="hidden" name="hidden_query_id" id="hidden_query_id" value=""/>
                                <div class="modal-footer justify-content-between">
                                    <button type="button" class="btn bg-white" data-dismiss="modal">Cancel</button>
                                    <button type="submit" class="btn btn-success">Upload</button>
                                </div>
                            </form>
                        </div> {{--modal-body--}}
                    </div>
                </div>
            </div>
            {{-- MODAL: end upload response of issue --}}

            {{-- MODAL: start edit response --}}
            <div class="modal fade" id="editResponseModal" data-backdrop="static" tabindex="-1" role="dialog"
                 aria-labelledby="editResponseModal" aria-hidden="true">
                <div class="modal-dialog modal-md" role="document">

                    <form name="edit_response" method="POST"
                          action="{{route('edit_query_response')}}"
                          enctype="multipart/form-data">
                        @csrf
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Edit Response</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="form-group">
                                    <label for="query_name1">Response for Query:</label>
                                    <input name="query_name1" type="text" class="form-control"
                                           id="query_name1" disabled>
                                </div>
                                <div class="form-group">
                                    <label for="description1">Description</label>
                                    <input name="description1" type="text" class="form-control"
                                           id="description1">
                                </div>

                                <div class="form-group">
                                    <label for="query_response_cover_letter1">Query Response Cover Letter</label>
                                    <div class="input-group">
                                        <div class="custom-file">
                                            <input type="file" name="query_response_cover_letter1"
                                                   id="query_response_cover_letter1"
                                                   class="custom-file-input">
                                            <label class="custom-file-label"
                                                   for="query_response_cover_letter1">Choose
                                                file</label>
                                        </div>

                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="query_response_file1">Query Response (Zip file)</label>
                                    <div class="input-group">
                                        <div class="custom-file">
                                            <input type="file" name="query_response_file1"
                                                   id="query_response_file1"
                                                   class="custom-file-input">
                                            <label class="custom-file-label"
                                                   for="query_response_file1">Choose
                                                file</label>
                                        </div>

                                    </div>
                                </div>

                                <input type="hidden" name="dossier_assignment_id"
                                       value="{{$dossier_evaluation_details->dossier_ass_id}}"/>
                                <input type="hidden" name="hidden_query_id1" id="hidden_query_id1" value=""/>
                                <div class="modal-footer justify-content-between">
                                    <button type="button" class="btn bg-white" data-dismiss="modal">Cancel</button>
                                    <button type="submit" class="btn btn-success">Edit</button>
                                </div>

                            </div> {{--modal-body--}}
                        </div>
                    </form>
                </div>
            </div>
            {{-- MODAL: end edit response  --}}

        </div>
        <!-- /.card-body -->
    </div>
    <!-- /.card -->


    {{---------- end list of uploaded documents -------------}}

    {{---------- start upload_query_response -------------}}

    {{--<div class="card card-outline card-success collapsed-card">
        <div class="card-header">
            <h3 class="card-title"><strong>Submit Query Response</strong>
            </h3>

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
            <form method="POST"
                  action="{{ route('upload_query_response') }}"
                  enctype="multipart/form-data">
                @csrf
                <div class="form-group">
                    <label for="description">Description</label>
                    <input type="text" class="form-control"
                           name="description" id="description">
                </div>

                <div class="form-group">
                    <label for="query_response_file">Query Response</label>
                    <div class="input-group">
                        <div class="custom-file">
                            <input type="file" name="query_response_file"
                                   id="query_response_file"
                                   class="custom-file-input">
                            <label class="custom-file-label"
                                   for="query_response_file">Choose
                                file</label>
                        </div>

                    </div>
                </div>

                <input type="hidden" name="dossier_assignment_id"
                       value="{{$dossier_evaluation_details->dossier_ass_id}}"/>
                <div class="card-footer" style="float:right">
                    <button class="btn btn-success" role="button">
                        Submit
                    </button>
                </div>
            </form>
        </div>
        <!-- /.card-body -->
    </div>--}}

    {{-------- end upload_query_response -------}}

</div>


{{---------------- END OF ISSUE QUERY------------}}
<script>
    function deadline_modal_query(o) {

        document.getElementById('query_id').value = o.value;
    }

    function get_query_name(o, queryid) {
        document.getElementById('hidden_query_id').value = queryid;
        document.getElementById('query_name_placeholder').value = o.value;

    }

    function edit_response_details(o, query) {


        document.getElementById('hidden_query_id1').value = query.id;
        document.getElementById('query_name1').value = query.name;
        document.getElementById('description1').value = query.response_description;

    }

    function details_query(o) {
        let id = o.value;

        $.ajax({

            type: 'GET',

            url: "{{ route('retrieve_details') }}",

            data: {id: id, typ: 'query'},

            success: function (data) {
                //for sending part
                var document_path = data.sent_document.path;
                document.getElementById('query_name').innerText = data.data['name'];
                document.getElementById('query_send_from_id').innerText = data.data['query_from_user_id'];
                document.getElementById('query_send_to_id').innerText = data.data['query_to_user_id'];
                document.getElementById('query_send_date_id').innerText = data.data['query_sent_date'];
                document.getElementById('query_send_deadline_id').innerText = data.data['query_deadline'];
                document.getElementById('query_status').innerText = data.data['status'];
                document.getElementById('query_sent_document_view').href = "http://127.0.0.1:8000/" + document_path;


                if (data.data.query_received_date == null) {

                } else {
                    var document_path = data.received_document.path;
//for receiving part
                    document.getElementById('query_received_view_id').hidden = false;
                    document.getElementById('query_receive_from_id').innerText = data.data['query_to_user_id'];
                    document.getElementById('query_receive_to_id').innerText = data.data['query_from_user_id'];
                    document.getElementById('query_receive_date_id').innerText = data.data['query_received_date'];
                    // var test="\{\{asset\("+document_path +"\)\}\}";
                    document.getElementById('received_view').href = "http://127.0.0.1:8000/" + document_path;
                    // alert( document.getElementById('received_view').href)
                    // alert(data.qc['qc_deadline']);
                    //  alert(data.qc.qc_deadline);
                }
            },
            error: function (data) {
                console.log(data)

            }
        });

    }

</script>
