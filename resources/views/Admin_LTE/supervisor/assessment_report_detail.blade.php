@extends('layouts.app')
@section('stylesheets')
@endsection
@section('content')

    <section class="content">
        <div class="container-fluid">
            <div class="col-md-10 col-lg-10 col-sm-10 offset-1">
                <div class="card card-info">
                    <div class="card-header">
                        <h3 class="card-title">Assessment Report Details</h3>
                    </div>
                    <!-- /.card-header -->
                    <!-- form start -->
                    <form>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6 col-lg-6 col-sm-6">
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">From:- </label>
                                        <label for="exampleInputEmail1">{{$assessment_report_detail->first_name}} {{$assessment_report_detail->middle_name}}</label>
                                    </div>

                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Name:- </label>
                                        <label for="exampleInputEmail1">{{$assessment_report_detail->name}}</label>
                                    </div>

                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Status:- </label>
                                        <label for="exampleInputEmail1">{{$assessment_report_detail->status}}</label>
                                    </div>

                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Assessment Received Date:- </label>
                                        <label for="exampleInputEmail1">{{$assessment_report_detail->assessment_sent_date}}</label>
                                    </div>


                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Document :- </label>

                                        <a href="{{asset($assessment_report_detail->path)}}" target="_blank"
                                           data-toggle="tooltip"
                                           class="btn btn-info btn-sm"
                                           data-placement="top" title="View the file"><i
                                                    class="fas fa-book-open"></i></a>
                                    </div>

                                    <div class="form-group">
                                        <label for="exampleInputEmail1">Description:- </label>
                                        <label for="exampleInputEmail1">{{$assessment_report_detail->request_subject}}</label>
                                    </div>

                                </div>

                                <div class="col-md-6 col-lg-6 col-sm-6">
                                    @if (isset($assessment_response_detail))
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Assessment Received Date:- </label>
                                            <label for="exampleInputEmail1">{{$assessment_response_detail->assessment_received_date}}</label>
                                        </div>


                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Document :- </label>

                                            <a href="{{asset($assessment_response_detail->path)}}" target="_blank"
                                               data-toggle="tooltip"
                                               class="btn btn-info btn-sm"
                                               data-placement="top" title="View the file"><i
                                                        class="fas fa-book-open"></i></a>
                                        </div>

                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Description:- </label>
                                            <label for="exampleInputEmail1">{{$assessment_response_detail->response_description}}</label>
                                        </div>


                                </div>
                                @endif
                            </div>
                        </div>
                            <!-- /.card-body -->


                            <div class="modal-footer justify-content-between">

                                <a href=""  class="btn btn-default btn-sm">Back</a>
                                @if (!isset($assessment_response_detail))
                                    <button type="button" class="btn btn-success btn-sm" style="padding-right: 10px;"
                                            title="Upload the Commented Document"
                                            data-toggle="modal"
                                            data-target="#upload_comment"
                                            onclick="" >
                                        <i class="fas fa-upload"></i>
                                        Upload Comment
                                    </button>
                                @endif

                            </div>

                    </form>
                </div>


            </div>
        </div>
        </div>
        {{--  Modal for Extend deadline  --}}
        <div class="modal fade" id="upload_comment" data-backdrop="static" tabindex="-1" role="dialog"
             aria-labelledby="upload_comment" aria-hidden="true">
            <div class="modal-dialog modal-md" role="document">

                <form action="{{route('upload_commented_document')}}" method="POST"  enctype="multipart/form-data">
                    @csrf
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Upload Commented .</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <input type="text" name='assessment_report' id='assessment_report' value="{{$assessment_report_detail->id}}" hidden/>

                            </div>
                            <div class="form-group">
                                <label> Description :</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" name="description">

                                </div>
                            </div>
                            <div class="form-group">
                                <label> Commented Document:</label>
                                <div class="input-group">
                                    <div class="custom-file">
                                        <input type="file" name="uploaded_document"
                                               id="uploaded_document"
                                               class="custom-file-input">
                                        <label class="custom-file-label"
                                               for="query_response_cover_letter">Choose
                                            file</label>
                                    </div>

                                </div>
                                </div>
                            </div>


                        <div class="modal-footer justify-content-between">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-success">Upload</button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
        {{--  end of Modal for extend deadline  --}}

    </section>
@endsection
@section('scripts')
    <!-- DataTables  & Plugins -->
    <script src="{{asset('plugins/datatables/jquery.dataTables.min.js')}}"></script>
    <script src="{{asset('plugins/datatables-bs4/js/dataTables.bootstrap4.min.js')}}"></script>
    <script src="{{asset('plugins/datatables-responsive/js/dataTables.responsive.min.js')}}"></script>
    <script src="{{asset('plugins/datatables-responsive/js/responsive.bootstrap4.min.js')}}"></script>
    <script src="{{asset('plugins/datatables-buttons/js/dataTables.buttons.min.js')}}"></script>
    <script src="{{asset('plugins/datatables-buttons/js/buttons.bootstrap4.min.js')}}"></script>
    <script src="{{asset('plugins/jszip/jszip.min.js')}}"></script>
    <script src="{{asset('plugins/pdfmake/pdfmake.min.js')}}"></script>
    <script src="{{asset('plugins/pdfmake/vfs_fonts.js')}}"></script>
    <script src="{{asset('plugins/datatables-buttons/js/buttons.html5.min.js')}}"></script>
    <script src="{{asset('plugins/datatables-buttons/js/buttons.print.min.js')}}"></script>
    <script src="{{asset('plugins/datatables-buttons/js/buttons.colVis.min.js')}}"></script>
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
@endsection
