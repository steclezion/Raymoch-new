{{--------------------START QC REPORT ------------------}}
<div class="tab-pane fade" id="custom-tabs-three-qc" role="tabpanel"
     aria-labelledby="custom-tabs-three-qc-tab">

    {{-- start download qc report templates--}}
    <div class="card card-blue">
        <div class="card-header">
            <h3 class="card-title">Qc Template List</h3>

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
                            width="40%">Description
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
                    @foreach($qc_report_templates as $template)
                        <tr role="row" class="odd">
                            <td>{{$i++}}</td>
                            <td>{{$template->name}}</td>
                            <td>{{$template->description}}</td>
                            <td>{{$template->document_type}}</td>

                            <td>


                                <a href="{{route('view_html_template',['id'=>$template->id,'dossier_asg_id'=>$dossier_evaluation_details->dossier_ass_id])}}"
                                   data-toggle="tooltip"
                                   class="btn btn-info btn-sm"
                                   data-placement="top"
                                   title="view the Template"><i
                                            class="fas fa-eye "></i></a>
                            </td>
                        </tr>
                    @endforeach
                    </tbody>

                </table>
            </div>
        </div>
    </div>
    {{--end download qc report templates--}}


    {{-- start list of QC reports--}}

    <div class="card card-outline card-success collapsed-card">
        <div class="card-header">
            <h3 class="card-title"><strong> QC Reports List</strong>
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
                            aria-sort="ascending" width="15%"> QC Status
                        </th>
                        <th class="sorting" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Title: activate to sort column ascending"
                            width="20%" id="subject"> Description
                        </th>
                        <th class="sorting" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Title: activate to sort column ascending"
                            width="15%"> Sent Date
                        </th>
                        <th class="sorting" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Title: activate to sort column ascending"
                            width="15%" id="received"> Received Date
                        </th>
                        <th class="sorting" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Title: activate to sort column ascending"
                            width="15%" id="received"> Deadline
                        </th>


                        <th rowspan="1" colspan="1" width="20%">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    @php($i=1)
                    @foreach($qc_documents as $qc_doc)
                        <tr role="row" class="odd">
                            <td>{{$i++}}</td>
                            <td>{{$qc_doc->status}}</td>
                            @if($qc_doc->status=='Request Sent to Inspection')
                                <script>
                                    document.getElementById('subject').innerHTML = 'Subject'
                                </script>
                                <td>{{$qc_doc->request_subject}}</td>
                            @else
                                <script>
                                    document.getElementById('').innerHTML = 'Description'
                                </script>
                                <td>{{$qc_doc->sent_description}}</td>
                            @endif

                            <td>{{$qc_doc->inspection_sent_date}}</td>
                            <td>{{$qc_doc->qc_received_date}}</td>
                                <td>{{$qc_doc->qc_deadline}}</td>

                            <td>

{{--                                @if ($qc_doc->qc_received_date==null)--}}
{{--                                    <button--}}
{{--                                            data-toggle="modal"--}}
{{--                                            data-target="#uploadQCResponseModal"--}}
{{--                                            class="btn btn-info btn-sm"--}}
{{--                                            title="Submit response (reply)"--}}
{{--                                            onclick="upload_qc_report(this)" value="{{ $qc_doc->id }}">--}}
{{--                                        <i class="fas fa-upload"></i></button>--}}

{{--                                    <button type="button" class="btn btn-success btn-sm" data-toggle="modal"--}}
{{--                                            data-target="#modalextend" onclick="deadline_modal(this)"--}}
{{--                                            value='{{ $qc_doc->id }}'>--}}
{{--                                        <i class="fas fa-clock "></i>--}}
{{--                                    </button>--}}
{{--                                @endif--}}
{{--                                <button--}}
{{--                                        data-toggle="modal"--}}
{{--                                        data-target="#editQCResponseModal"--}}
{{--                                        class="btn btn-primary btn-sm"--}}
{{--                                        title="edit details, re-upload files"--}}
{{--                                        onclick="edit_qc_report(this, {{ $qc_doc }})" value="{{ $qc_doc->id }}">--}}
{{--                                    <i class="fas fa-edit"></i></button>--}}


                                <button type="button" class="btn btn-primary btn-sm" data-toggle="modal"
                                        data-target="#modal_qc_details" onclick="qc_detail(this)"
                                        value='{{ $qc_doc->id }}'>
                                    <i class="fas fa-list "></i>
                                </button>

{{--                                <button type="button" data-toggle="modal" data-target="#deleteRecordModal"--}}
{{--                                        data-action=""--}}
{{--                                        title="Delete the document" class="btn btn-danger btn-sm"><i--}}
{{--                                            class="fas fa-trash "></i></button>--}}
                            </td>
                        </tr>
                    @endforeach
                    </tbody>

                </table>
            </div> {{-- end div: example1_wrapper--}}

            {{--  Modal for Qc details  --}}
            <div class="modal fade" id="modal_qc_details" data-backdrop="static" tabindex="-1" role="dialog"
                 aria-labelledby="modalextend" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">


                    <form action="{{ route('update_deadline') }}"
                          method="POST">  {{--todo check with mera if route is ok--}}
                        @csrf
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">QC Sample Details</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">

                                {{--this is for the downloaded details--}}
                                <div class="card card-primary">
                                    <div class="card-header">
                                        <h3 class="card-title"><strong> Sent Details</strong>
                                        </h3>
                                    </div>
                                    <div class="card-body inline">
                                        <label>From: </label> <span id="send_from_id"></span><br>
                                        <label>To: </label> <span id="send_to_id"> </span><br>
                                        <label>Sent Date:</label> <span id="send_date_id"></span><br>
                                        <label>Deadline:</label> <span id="send_deadline_id"></span><br>
                                        <label>View Sent Document:</label> <span id="send_deadline_id"></span><br>


                                    </div>


                                </div>

                                {{--this is for the uploaded details--}}
                                <div class="card card-primary" id="received_view_id" hidden>
                                    <div class="card-header">
                                        <h3 class="card-title"><strong> Received Details</strong>
                                        </h3>
                                    </div>
                                    <div class="card-body">
                                        <label>From: </label> <span id="receive_from_id"></span><br>
                                        <label>To:</label> <span id="receive_to_id"></span><br>
                                        <label>Received Date:</label> <span id="receive_date_id"></span><br>
                                        <label>View Received Document:</label> <span
                                                id="receive_deadline_id"></span><br>

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
            {{--  end of Modal for qc details  --}}
            {{--  Modal for Extend deadline  --}}
            <div class="modal fade" id="modalextend" data-backdrop="static" tabindex="-1" role="dialog"
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
                                    <input type="text" name='type' value='qc' hidden/>
                                    <input type="text" name='qc_id' id='qc_id' value="" hidden/>
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

            {{-- MODAL: start upload qc response  --}}
            <div class="modal fade" id="uploadQCResponseModal" data-backdrop="static" tabindex="-1" role="dialog"
                 aria-labelledby="uploadQCResponseModal" aria-hidden="true">
                <div class="modal-dialog modal-md" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Upload QC Response</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">


                            <form method="post" action="{{ route('upload_qc_report') }}"
                                  enctype="multipart/form-data">
                                @csrf

                                <div class="form-group">
                                    <label> Description</label>
                                    <input type="text" class="form-control"
                                           name="description" required>

                                    {{--@error('description')
                                    <span class="text-danger"> {{ $message }}</span>
                                    @enderror--}}

                                </div>

                                <div class="form-group">
                                    <label for="qc_report_file">QC Report</label>
                                    <div class="input-group">
                                        <div class="custom-file">
                                            <input type="file" name="qc_report_file"
                                                   id="qc_report_file"
                                                   class="custom-file-input" required>
                                            <label class="custom-file-label"
                                                   for="qc_report_file">Choose file</label>
                                            {{--
                                                                                        @error('qc_report_file')
                                                                                        <span class="text-danger"> {{ $message }}</span>
                                                                                        @enderror--}}

                                        </div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="qc_report_attachments">Attachments (Zip file format)</label>
                                    <div class="input-group">
                                        <div class="custom-file">
                                            <input type="file" name="qc_report_attachments"
                                                   id="qc_report_attachments"
                                                   class="custom-file-input" multiple="multiple" required>
                                            <label class="custom-file-label"
                                                   for="qc_report_attachments">Choose file</label>
                                        </div>
                                        {{--@error('qc_report_attachments')
                                        <span class="text-danger"> {{ $message }}</span>
                                        @enderror--}}

                                    </div>
                                </div>

                                <input type="hidden" name="dossier_assignment_id"
                                       value="{{$dossier_evaluation_details->dossier_ass_id}}"/>
                                <input type="hidden" name="hidden_qc_id" id="hidden_qc_id" value=""/>
                                <div class="card-footer" style="float:right">
                                    <button class="btn btn-success" role="button">Submit
                                    </button>
                                </div>
                            </form>
                        </div> {{--modal-body--}}
                    </div>
                </div>
            </div>
            {{-- MODAL: end upload of qc response  --}}

            {{-- MODAL: start edit QC response --}}
            <div class="modal fade" id="editQCResponseModal" data-backdrop="static" tabindex="-1" role="dialog"
                 aria-labelledby="editQCResponseModal" aria-hidden="true">
                <div class="modal-dialog modal-md" role="document">

                    <form name="edit_qc_response" method="POST"
                          action="{{route('edit_qc_response')}}"
                          enctype="multipart/form-data">
                        @csrf
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Edit QC Response</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="form-group">
                                    <label for="qc_subject1">Response for:</label>
                                    <input name="qc_subject1" type="text" class="form-control"
                                           id="qc_subject1" disabled>
                                </div>
                                <div class="form-group">
                                    <label for="qc_description1">Description</label>
                                    <input name="qc_description1" type="text" class="form-control"
                                           id="qc_description1">
                                </div>

                                <div class="form-group">
                                    <label for="qc_report_file1">QC Report</label>
                                    <div class="input-group">
                                        <div class="custom-file">
                                            <input type="file" name="qc_report_file1"
                                                   id="qc_report_file1"
                                                   class="custom-file-input" required>
                                            <label class="custom-file-label"
                                                   for="qc_report_file1">Choose file</label>

                                        </div>
                                    </div>
                                </div>


                                <div class="form-group">
                                    <label for="qc_report_attachments1">Attachments (Zip file format)</label>
                                    <div class="input-group">
                                        <div class="custom-file">
                                            <input type="file" name="qc_report_attachments1"
                                                   id="qc_report_attachments1"
                                                   class="custom-file-input" multiple="multiple" required>
                                            <label class="custom-file-label"
                                                   for="qc_report_attachments1">Choose file</label>
                                        </div>

                                    </div>
                                </div>

                                <input type="hidden" name="dossier_assignment_id"
                                       value="{{$dossier_evaluation_details->dossier_ass_id}}"/>
                                <input type="hidden" name="hidden_qc_id1" id="hidden_qc_id1" value=""/>
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

    {{--end list of QC reports--}}


    {{--start upload qc reports--}}

    {{--  <div class="card card-outline card-success collapsed-card">
          <div class="card-header">
              <h3 class="card-title"><strong>Submit QC Report</strong></h3>

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

              <form method="post" action="{{ route('upload_qc_report') }}"
                    enctype="multipart/form-data">
                  @csrf

                  <div class="form-group">
                      <label> Description</label>
                      <input type="text" class="form-control"
                             name="description">
                  </div>

                  <div class="form-group">
                      <label for="qc_report_file">QC Report</label>
                      <div class="input-group">
                          <div class="custom-file">
                              <input type="file" name="qc_report_file"
                                     id="qc_report_file"
                                     class="custom-file-input">
                              <label class="custom-file-label"
                                     for="qc_report_file">Choose file</label>
                          </div>

                      </div>

                  </div>

                  <div class="form-group">
                      <label for="qc_report_attachments">Attachments</label>
                      <div class="input-group">
                          <div class="custom-file">
                              <input type="file" name="qc_report_attachments"
                                     id="qc_report_attachments"
                                     class="custom-file-input">
                              <label class="custom-file-label"
                                     for="qc_report_attachments">Choose
                                  file</label>
                          </div>

                      </div>
                  </div>


                  <input type="hidden" name="dossier_assignment_id"
                         value="{{$dossier_evaluation_details->dossier_ass_id}}"/>
                  <div class="card-footer" style="float:right">
                      <button class="btn btn-success" role="button">Submit
                      </button>
                  </div>
              </form>
          </div>
          <!-- /.card-body -->
      </div>--}}

</div>
{{--------------------END QC REPORT ------------------}}
<script>
    function deadline_modal(o) {
        document.getElementById('qc_id').value = o.value;
    }

    function qc_detail(o) {
        let qc_id = o.value

        $.ajax({

            type: 'GET',

            url: "{{ route('retrieve_details') }}",

            data: {id: qc_id, typ: 'qc'},

            success: function (data) {
                //for sending part
                document.getElementById('send_from_id').innerText = data.data['qc_from_user_id'];
                document.getElementById('send_to_id').innerText = data.data['qc_to_user_id'];
                document.getElementById('send_date_id').innerText = data.data['qc_sent_date'];
                document.getElementById('send_deadline_id').innerText = data.data['qc_deadline'];


                if (data.data.qc_received_date == null) {

                } else {

//for receiving part
                    document.getElementById('received_view_id').hidden = false;
                    document.getElementById('receive_from_id').innerText = data.data['qc_to_user_id'];
                    document.getElementById('receive_to_id').innerText = data.data['qc_from_user_id'];
                    document.getElementById('receive_date_id').innerText = data.data['qc_received_date'];
                    document.getElementById('send_deadline_id').innerText = data.data['received_document']
                    // alert(data.qc['qc_deadline']);
                    //   alert(data.qc.qc_deadline);
                }
            }
        });

    }


    function upload_qc_report(o) {
        document.getElementById('hidden_qc_id').value = o.value;

    }

    function edit_qc_report(o, qc) {

        document.getElementById('hidden_qc_id1').value = qc.id;
        document.getElementById('qc_subject1').value = qc.request_subject;
        document.getElementById('qc_description1').value = qc.response_description;

    }

</script>
