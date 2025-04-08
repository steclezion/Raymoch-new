{{-----------  START ASSESSMENT REPORT----------------------}}

{{-----------start show Assessment Report templates----------------------}}
<div class="tab-pane fade" id="custom-tabs-three-assessment" role="tabpanel"
     aria-labelledby="custom-tabs-three-assessment-tab">

    @if($dossier_evaluation_details->application_type==1)
        <div class="card card-primary">
            <div class="card-header">
                <h3 class="card-title">Standard Evaluation</h3>
            </div>
            <form method="get" action="{{ route('download_pdf') }}">
                <div class="card-body">

                    <label>Choose File</label>
                    <select class="form-control" name='std_type'>
                        @foreach ($standard as $std)
                            <option
                                value="{{ $std->id }}">{{ $std->name }}
                            </option>

                        @endforeach
                    </select>

                    <input type="hidden" name="dossier_assignment_id"
                           value="{{$dossier_evaluation_details->dossier_ass_id}}"/>
                </div>
                <div class="card-footer" style="float:right">
                    <button class="btn btn-success"
                            role="button">Download
                    </button>
                </div>
            </form>

            <!-- /.card-body -->
        </div>
    @else
        <div class="card card-primary">
            <div class="card-header">
                <h3 class="card-title">Fast Track</h3>
            </div>
            <form method="get" action="{{ route('download_pdf') }}">
                <div class="card-body">
                    <label>Choose File</label>
                    <select class="form-control" name='std_type'>
                        @foreach ($fast as $fas)
                            <option
                                value="{{ $fas->id }}">{{ $fas->name }}
                            </option>

                        @endforeach
                    </select>


                </div>
                <div class="card-footer" style="float:right">
                    <button class="btn btn-success"
                            role="button">Download
                    </button>
                </div>
            </form>
        </div>
        <!-- /.card-body -->
    @endif
    <br>
    {{-----------end show Assessment Report templates----------------------}}

    <br><br>

    {{----------- start list of assessment reports ------------}}
    <div class="card card-outline card-success collapsed-card">
        <div class="card-header">
            <h3 class="card-title"><strong>Uploaded reports</strong></h3>

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
                            aria-sort="ascending" width="30%"> Report
                        </th>
                        <th class="sorting sorting_asc" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Reference Number: activate to sort column descending"
                            aria-sort="ascending" width="30%"> Filename
                        </th>
                        <th class="sorting" tabindex="0"
                            aria-controls="example1" rowspan="1" colspan="1"
                            aria-label="Title: activate to sort column ascending"
                            width="20%"> Submitted at
                        </th>
                        <th rowspan="1" colspan="1" width="30%">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    @php($i=1)
                    @foreach($assessment_report_documents as $assess_rep_doc)
                        <tr role="row" class="odd">
                            <td>{{$i++}}</td>
                            <td>{{$assess_rep_doc->name}}</td>
                            <td>{{basename($assess_rep_doc->path)}}</td>
                            <td>{{$assess_rep_doc->updated_at}}</td>

                            <td>

                                <a href="{{asset($assess_rep_doc->path)}}" type="button" target="_blank"
                                   title="View the document" class="btn btn-info btn-sm"><i
                                        class="fas fa-eye "></i></a>

                                @if($dossier_evaluation_details->locked==0)
                                <button
                                    data-toggle="modal"
                                    data-target="#editAssessmentReportModal"
                                    class="btn btn-primary btn-sm"
                                    title="Edit details, Re-upload the document etc"
                                    onclick="get_report_details({{ $assess_rep_doc}})" value="">
                                    <i class="fas fa-edit"></i></button>
                                {{--
                                                                <button type="button"
                                                                        data-toggle="modal"
                                                                        data-target="#deleteRecordModal"
                                                                        data-action="{{ route('delete_document', $assess_rep_doc->id) }}"
                                                                        title="Delete the document" class="btn btn-danger btn-sm"><i
                                                                        class="fas fa-trash "></i></button>--}}
                                    @endif

                            </td>
                        </tr>
                    @endforeach
                    </tbody>

                </table>
            </div>


        </div>
        <!-- /.card-body -->
    </div>


    {{----------- end list of assessment reports ------------}}

    {{----------- start upload assessment report------------}}

    <div class="card card-outline card-success collapsed-card">
        <div class="card-header">
            <h3 class="card-title"><strong>Submit Assessment Report:
                </strong>
            </h3>


            <div class="card-tools">
                {{--  <button type="button" class="btn btn-tool"
                          data-toggle="modal"
                          data-target="#modal_use_edit"
                          data-card-widget="collapse">
                      <i class="fas fa-plus"></i>
                  </button>--}}

                <button type="button" class="btn btn-tool"
                        data-card-widget="collapse">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <!-- /.card-tools -->
        </div>
        <!-- /.card-header -->

        {{--@if($assessment_report_documents==null)--}}
        {{--show form based on application type, i.e for fast track upload only full report--}}
        @if($dossier_evaluation_details->application_type==1)
            <div class="card-body" style="display: none;">
                <form method="post"
                      action="{{ route('upload_assessment_report') }}"
                      enctype="multipart/form-data">
                    @csrf
                    <div class="form-group">
                        <label for="assessment_report_file">Assessment
                            Report</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" name="assessment_report_file"
                                       id="assessment_report_file"
                                       class="custom-file-input" required>
                                <label class="custom-file-label"
                                       for="assessment_report_file">Choose
                                    file</label>
                            </div>

                        </div>
                    </div>

                    <div class="form-group">
                        <label for="assessment_report_smpc_file">Assessment
                            Report SmPC</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file"
                                       name="assessment_report_smpc_file"
                                       id="assessment_report_smpc_file"
                                       class="custom-file-input" required>
                                <label class="custom-file-label"
                                       for="assessment_report_smpc_file">Choose
                                    file</label>
                            </div>

                        </div>
                    </div>
                    <div class="form-group">
                        <label for="assessment_report_pils_file">Assessment
                            Report PILs (Optional)</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file"
                                       name="assessment_report_pils_file"
                                       id="assessment_report_pils_file"
                                       class="custom-file-input">
                                <label class="custom-file-label"
                                       for="assessment_report_pils_file">Choose
                                    file</label>
                            </div>

                        </div>
                    </div>

                    <div class="form-group">
                        <label for="report_desc">Description/Remark</label>
                        <input type="text" name="report_desc"
                               id="report_desc"
                               class="form-control">
                    </div>

                    <input type="hidden" name="dossier_assignment_id"
                           value="{{$dossier_evaluation_details->dossier_ass_id}}"/>
                    <div class="card-footer" style="float:right">
                        <button class="btn btn-success" role="button">Submit
                        </button>
                    </div>

                </form>
            </div> <!-- /.card-body -->
        @else
            <div class="card-body" style="display: none;">
                <form method="post"
                      action="{{ route('upload_assessment_report') }}"
                      enctype="multipart/form-data">
                    @csrf
                    <div class="form-group">
                        <label for="assessment_report_file">Assessment
                            Report</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" name="assessment_report_file"
                                       id="assessment_report_file"
                                       class="custom-file-input" required>
                                <label class="custom-file-label"
                                       for="assessment_report_file">Choose
                                    file</label>
                            </div>

                        </div>
                    </div>

                    <div class="form-group">
                        <label for="report_desc">Description/Remark</label>
                        <input type="text" name="report_desc"
                               id="report_desc"
                               class="form-control" required>
                    </div>
                    <input type="hidden" name="dossier_assignment_id"
                           value="{{$dossier_evaluation_details->dossier_ass_id}}"/>
                    <div class="card-footer" style="float:right">
                        <button class="btn btn-success" role="button">Submit
                        </button>
                    </div>

                </form>
            </div><!-- /.card-body -->
        @endif

    </div>
    {{--@endif--}}
    <form method="post"
          action="{{ route('submit_to_supervisor') }}"
          enctype="multipart/form-data">
        @csrf
        <div class="modal-footer justify-content-between">
           <button type="button" class="btn btn-success " title="Finalizing Evaluation Process"
                    data-toggle="modal"
                    data-target="#submit_to_supervisor"
                    onclick="submit_to_supervisor_js(this,[{{$evaluation_document_progress}},{{$dossier_evaluation_details->application_type}}])"
                    value="{{$dossier_evaluation_details->dossier_ass_id}}">Submit to Supervisor
            </button>
        </div>
    </form>

    {{--  Modal Report resubmittion to supervisor  --}}
    {{--    <div class="modal fade" id="modal_use_edit" data-backdrop="static" tabindex="-1" role="dialog"
             aria-labelledby="modal_use_edit" aria-hidden="true">
            <div class="modal-dialog modal-md" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Message</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">

                        The Initial Assessment Report has already been Submitted.

                        Please Use the Edit button to Update the Report.

                    </div>

                </div>
                <div class="modal-footer justify-content-between">
                    <button type="submit" id="submit_to_supvisor_btn" class="btn btn-success" hidden>Submit to Assessor
                    </button>
                </div>
            </div>
            </form>
        </div>--}}
</div>

{{-- end of upload assessment Report --}}


{{--  MODAL: start edit assessment report  --}}

<div class="modal fade" id="editAssessmentReportModal" data-backdrop="static" tabindex="-1" role="dialog"
     aria-labelledby="edit_assessment_report" aria-hidden="true">
    <div class="modal-dialog modal-md" role="document">

        <form action="{{ route('edit_assessment_report') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Assessment Report</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="hidden_report_name">Report Name</label>
                        <input type="text" name="hidden_report_name" value="" class="form-control"
                               id="hidden_report_name" readonly>
                    </div>
                    <div class="form-group">
                        <label for="assess_report_file">File</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" name="assess_report_file"
                                       id="assess_report_file" value=""
                                       class="custom-file-input">
                                <label class="custom-file-label"
                                       for="assess_report_file">Choose file</label>
                            </div>

                        </div>
                    </div>

                </div>
                <input type="hidden" id="hidden_path" name="hidden_path"
                       value=""/>
                <input type="hidden" id="hidden_document_id" name="hidden_document_id"
                       value=""/>
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn bg-white" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-success"> Submit</button>
                </div>
            </div>
        </form>
    </div>
</div>
{{--MODAL: end edit assessment report--}}


{{--------------------END ASSESSEMENT REPORT ------------------}}

{{-- Modal for Submit to supervisor --}}
<div class="modal fade" id="submit_to_supervisor" data-backdrop="static" tabindex="-1" role="dialog"
     aria-labelledby="submit_to_supervisor" aria-hidden="true">
    <div class="modal-dialog modal-md" role="document">

        <form action="{{ route('submit_to_supervisor') }}" method="POST">
            @csrf
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Submit To Supervisor.</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">

                    @include('dossier_evaluation.progress_status')
                </div>
                <input type="hidden" name='dossier_assignment_id' value="{{ $evaluation_document_progress->dossier_assignment_id}}">
                <div class="modal-footer justify-content-between">
                    <button type="submit" id="submit_to_supvisor_btn" name="submit_to_supvisor_btn"
                            class="btn btn-success" disabled>Submit to Supervisor
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>
{{-- end of Modal for Submit to Supervisor --}}

<script>
    function submit_to_supervisor_js(o, evaluation_progress) {

        const progress=evaluation_progress[0];
        const mode=evaluation_progress[1];
        if (mode==1)
        {
        if (progress.QOS_is_done == 1 &&
            progress.issue_query_is_done == 1 &&
            progress.qc_sample_is_done == 1 &&
            progress.assessment_submitted == 2) {
            document.getElementById('submit_to_supvisor_btn').disabled = false
        } else {
            document.getElementById('submit_to_supvisor_btn').disabled = true
        }
        }
        if (mode==2)
        {
            if (
                progress.issue_query_is_done == 1 &&
                progress.assessment_submitted == 2) {
                document.getElementById('submit_to_supvisor_btn').disabled = false
            } else {
                document.getElementById('submit_to_supvisor_btn').disabled = true
            }
        }


    }


    function get_report_details(report) {

        document.getElementById('hidden_report_name').value = report.name;
        document.getElementById('hidden_document_id').value = report.id;
        document.getElementById('hidden_path').value = report.path;

    }
</script>
