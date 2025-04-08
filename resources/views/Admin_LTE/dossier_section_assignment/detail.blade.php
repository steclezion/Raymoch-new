@extends('layouts.app')

@section('content')

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">

                    <div class="card card-primary">
                        <div class="card-header">
                            Dossier Assessment Evaluation Details
                        </div>
                        <!-- /.card-header -->
                        <div class="card-body">
                                <label> Assigned By (Assessor Name):</label> {{ $assigned_section->first_name }} {{ $assigned_section->middle_name }} <br>
                                <label> Subject: </label> {{ $assigned_section->assignment_description }}<br>
                                <label> Assignment Date: </label> {{ $assigned_section->section_sent_date }}<br>
                                <label> Deadline: </label> {{ $assigned_section->section_deadline }}<br>
                                <label> Remaining Days: </label><br>
                                <label> Document to be Assessed: </label> <a  href="{{ asset($assigned_section->path)}}" target="_blank" data-toggle="tooltip" class="btn btn-info btn-sm"
                                    data-placement="top" title="View the file"><i class="fas fa-book-open"></i></a> <br>

                        </div>
                        <div class="modal-footer justify-content-between">
                                <a type="button" class="btn btn-default" href="{{route('dossier_section_assign_index')}}" >Back</a>
                                 @if ($assigned_section->section_received_date==null)
                                <button type="button" class="btn btn-warning " title="Request for Deadline Extension" data-toggle="modal" data-target="#dedline_extension" onclick="" value="">Request Deadline Extension </button>

                                <button type="button" class="btn btn-success " title="Submit the evaltuation to the Assessor" data-toggle="modal" data-target="#submit_evaluation_to_assessor" onclick=""value="">Submit Evaluation  </button>
@else
                            <button
                                    data-toggle="modal" data-target="#editSectionResponseModal" class="btn btn-primary btn-sm"
                                    title="edit details, re-upload file" onclick="edit_section_response_details({{ $assigned_section }})" >
                                <i class="fas fa-edit"></i>Edit</button>
                                @endif
                                 </div>
                    </div>
                    <!-- /.card-body -->
                </div>
            </div>

        </div>

        {{-- MODAL: start edit response --}}
        <div class="modal fade" id="editSectionResponseModal" data-backdrop="static" tabindex="-1" role="dialog"
             aria-labelledby="editResponseModal" aria-hidden="true">
            <div class="modal-dialog modal-md" role="document">

                <form name="edit_response" method="POST"
                      action="{{route('edit_section_assignment_response')}}"
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
                                <label for="description1">Description</label>
                                <input name="section_description" type="text" class="form-control" id="section_description" value="">
                            </div>

                            <div class="form-group">
                                <label for="query_response_file1">Section Assignment Response</label>
                                <div class="input-group">
                                    <div class="custom-file">
                                        <input type="file" name="section_response_file1"
                                               id="section_response_file1"
                                               class="custom-file-input">
                                        <label class="custom-file-label"
                                               for="section_response_file1">Choose
                                            file</label>
                                    </div>

                                </div>
                            </div>

                            <input type="hidden" name="dossier_assignment_id"
                                   value="{{$assigned_section->section_related_id}}"/>
                            <input type="hidden" name="section_edit_id" id="section_edit_id" value=""/>
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

        {{-- MODAL for deadline extension Request--}}

        <div class="modal fade" id="dedline_extension" data-backdrop="static" tabindex="-1" role="dialog"
             aria-labelledby="deleteRecordModal" aria-hidden="true">
            <div class="modal-dialog modal-md" role="document">

                <form action="{{ route('dossier_section_deadline_extension') }}" method="POST">
                    @csrf
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Request For Deadline Extension</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <label>Reason For Extension</label><input type="text" class="form-control" name='extension_reason'><br>
                            <label>Required Deadline</label><input type="date" class="form-control" name='extended_deadline'><br>


                        </div>

                        <input type="hidden" value="{{$assigned_section->id}}" name="dossier_section_id"/>
                        <div class="modal-footer justify-content-between">
                            <button type="button" class="btn bg-white" data-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-success">Send Request</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        {{-- End of modal deadline extension Request--}}
        {{-- MODAL for Section Evaluation Response --}}

       <div class="modal fade" id="submit_evaluation_to_assessor" data-backdrop="static" tabindex="-1" role="dialog"
        aria-labelledby="deleteRecordModal" aria-hidden="true">
       <div class="modal-dialog modal-md" role="document">

           <form action="{{ route('dossier_section_upload') }}" method="POST" enctype="multipart/form-data">
               @csrf
               <div class="modal-content">
                   <div class="modal-header">
                       <h5 class="modal-title">Upload Dossier Section Evaluation Document</h5>
                       <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                           <span aria-hidden="true">&times;</span>
                       </button>
                   </div>
                   <div class="modal-body">
                        <div class="form-group">
                                <label for="description1">Description</label>
                                <input name="section_description" type="text" class="form-control" id="section_description" value="">
                            </div>
                            <div class="form-group">
                                <label for="query_response_file1">Section Assignment Response</label>
                                <div class="input-group">
                                    <div class="custom-file">
                                        <input type="file" name="section_response_file1"
                                               id="section_response_file1"
                                               class="custom-file-input">
                                        <label class="custom-file-label"
                                               for="section_response_file1">Choose
                                            file</label>
                                    </div>

                                </div>
                            </div>
                            <input type="hidden" value="{{  $assigned_section->id }}" name="hidden_section_id">


                   <div class="modal-footer justify-content-between">
                       <button type="button" class="btn bg-default" data-dismiss="modal">Cancel</button>
                       <button type="submit" class="btn btn-success">Upload</button>
                   </div>
               </div>
           </form>
       </div>
   </div>
   {{-- End of Modal Section Evaluation Response --}}


    </section>


@endsection

@section('scripts')
    <script src="{{ asset('plugins/bs-custom-file-input/bs-custom-file-input.min.js') }}"></script>

    <script>
        function show_upload() {
            if (document.getElementById('assessment_report_submit').hidden == false) {
                document.getElementById('assessment_report_submit').hidden = true;

            } else {
                document.getElementById('assessment_report_submit').hidden = false;
            }
        }

        $(function () {
            bsCustomFileInput.init();
        });
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
        $(function () {
            bsCustomFileInput.init();
        });


        // Delete Record Modal to confirm before deletion
        $('#deleteRecordModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var action = button.data('action');
            var modal = $(this);
            modal.find('form').attr('action', action);
        });

    </script>
@endsection
