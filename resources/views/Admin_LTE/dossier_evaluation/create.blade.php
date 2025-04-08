@extends('layouts.app')

@section('content')

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">

                    <div class="card card-primary">
                        <div class="card-header">
                            Dossier Evaluation
                        </div>
                        <!-- /.card-header -->
                        <div class="card-body">
                            <div class="col-12 col-sm-12">
                                <div class="card card-primary card-outline card-tabs">
                                    <div class="card-header p-0 pt-1 border-bottom-0">
                                        {{--START TAB NAME LIST--}}
                                        <ul class="nav nav-tabs" id="custom-tabs-three-tab" role="tablist">
                                            <li class="nav-item">
                                                <a class="nav-link active" id="custom-tabs-three-overview-tab"
                                                   data-toggle="pill" href="#custom-tabs-three-overview" role="tab"
                                                   aria-controls="custom-tabs-three-overview"
                                                   aria-selected="true">Overview</a>
                                            </li>
                                            @if($dossier_evaluation_details->application_type==1)
                                                <li class="nav-item">
                                                    <a class="nav-link" id="custom-tabs-three-qc-tab" data-toggle="pill"
                                                       href="#custom-tabs-three-qc" role="tab"
                                                       aria-controls="custom-tabs-three-qc" aria-selected="false">
                                                        Quality
                                                        Control Report</a>
                                                </li>
                                            @endif
                                            <li class="nav-item">
                                                <a class="nav-link" id="custom-tabs-three-issue-tab" data-toggle="pill"
                                                   href="#custom-tabs-three-issue" role="tab"
                                                   aria-controls="custom-tabs-three-issue" aria-selected="false">Issue
                                                    Query</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link" id="custom-tabs-three-assessment-tab"
                                                   data-toggle="pill"
                                                   href="#custom-tabs-three-assessment" role="tab"
                                                   aria-controls="custom-tabs-three-assessment"
                                                   aria-selected="false">Assessment Report</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link" id="custom-tabs-three-dossier-tab"
                                                   data-toggle="pill"
                                                   href="#custom-tabs-three-dossier" role="tab"
                                                   aria-controls="custom-tabs-three-dossier" aria-selected="false">Dossier
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link" id="custom-tabs-three-timeline-tab"
                                                   data-toggle="pill"
                                                   href="#custom-tabs-three-timeline" role="tab"
                                                   aria-controls="custom-tabs-three-timeline" aria-selected="false">Timeline
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link" id="custom-tabs-three-progress-tab"
                                                   data-toggle="pill" href="#custom-tabs-three-progress" role="tab"
                                                   aria-controls="custom-tabs-three-progress"
                                                   aria-selected="false">Progress</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link" id="custom-tabs-three-notification-tab"
                                                   data-toggle="pill" href="#custom-tabs-three-notification" role="tab"
                                                   aria-controls="custom-tabs-three-notification"
                                                   aria-selected="false">Notification</a>
                                            </li>
                                        </ul>
                                        {{--END TAB NAME LIST--}}
                                    </div>
                                    <div class="card-body">

                                        <div class="tab-content" id="custom-tabs-three-tabContent">

                                            {{--------------------START OVERVIEW  ------------------}}
                                            @include('dossier_evaluation.tab_overview')
                                            {{--------------------END OVERVIEW  ------------------}}

                                            @if($dossier_evaluation_details->application_type==1)

                                                {{--------------------START QC REPORT ------------------}}
                                                @include('dossier_evaluation.tab_qc_report')
                                                {{--------------------END QC REPORT ------------------}}

                                            @endif
                                            {{---------------- START OF ISSUE QUERY------------}}
                                            @include('dossier_evaluation.tab_issue_query')
                                            {{---------------- END OF ISSUE QUERY------------}}

                                            {{-----------  START ASSESSMENT REPORT----------------------}}
                                            @include('dossier_evaluation.tab_assessment_report')
                                            {{--------------------END ASSESSEMENT REPORT ------------------}}

                                            {{-----------  START DOSSIER ----------------------}}
                                            @include('dossier_evaluation.tab_dossier')
                                            {{--------------------END DOSSIER  ------------------}}

                                            {{-----------  START Timeline ----------------------}}
                                            @include('dossier_evaluation.tab_timeline')
                                            {{--------------------END Timeline  ------------------}}


                                            {{-----------  START Progress ----------------------}}
                                            @include('dossier_evaluation.tab_progress')
                                            {{--------------------END progress  ------------------}}

                                            {{-----------  START notification ----------------------}}
                                            @include('dossier_evaluation.tab_notification')
                                            {{--------------------END notification  ------------------}}


                                        </div>
                                    </div>
                                </div>
                                <!-- /.card -->
                            </div>
                        </div>
                    </div>
                    <!-- /.card-body -->
                </div>
            </div>

        </div>


        {{-- MODAL TO POP-UP CONFIRM DIALOG--}}

        <div class="modal fade" id="deleteRecordModal" data-backdrop="static" tabindex="-1" role="dialog"
             aria-labelledby="deleteRecordModal" aria-hidden="true">
            <div class="modal-dialog modal-md" role="document">
                <?php
                if (isset($assess_rep_doc)) {
                    $assess_report_doc_id = $assess_rep_doc->id;
                } else {
                    $assess_report_doc_id = "";
                }

                ?>
                <form action="{{ route('delete_document', $assess_report_doc_id) }}" method="POST">
                    @csrf
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">This action is not reversible.</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            Are you sure you want to delete the document?

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn bg-white" data-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>


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
