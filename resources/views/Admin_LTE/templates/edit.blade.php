@extends('layouts.app')

@section('content')

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-8">

                    <div class="card card-primary">
                        <div class="card-header">
                            <h3 class="card-title">Edit Templates</h3>
                        </div>
                        <!-- /.card-header -->
                        <div class="card-body">

                            <form action="{{ route('update',$document->id) }}" method="POST"
                                  enctype="multipart/form-data">
                                @csrf


                                <div class="form-group">
                                    <label>Document Reference Number</label>
                                    <input type="text" name="ref_num" value="{{ $document->ref_num }}"
                                           class="form-control" placeholder="Enter Reference Number">
                                </div>

                                <div class="form-group">
                                    <label>Document Title</label>
                                    <input type="text" name="title" value="{{ $document->name }}" class="form-control"
                                           placeholder="Enter title">
                                </div>

                                <div class="form-group">
                                    <label for="SelectRounded0">Document Type</label>
                                    <select class="custom-select rounded-0" name="document_type" id="SelectRounded0">
                                        <b:option value='{{ $document->documet_type }}'>{{ $document->document_type }}</b:option>
                                        @foreach ($document_types as $type)
                                            <b:option value='{{ $type->id }}'>{{ $type->document_type }}</b:option>

                                            @endforeach
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label>Description</label>
                                    <textarea class="form-control" name="description"
                                              value="{{ $document->description }}" rows="3"></textarea>
                                </div>

                                <div class="form-group">
                                    <label>Existing file: <span
                                            class='text-danger'> {{ $document->path }}  </span></label> <br/>
                                    <label for="input_file">Input File</label>
                                    <div class="input-group">
                                        <div class="custom-file">
                                            <input type="file" name="input_file" class="custom-file-input"
                                                   id="input_file">
                                            <label class="custom-file-label" for="input_file">Choose File</label>
                                        </div>
                                        <div class="input-group-append">
                                            <input type="submit" name="submit" value='Submit' class='btn btn-primary'>
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>
                        <!-- /.card-body -->
                    </div> {{--card card-primary--}}
                </div>
            </div>
        </div>
    </section>
@endsection

@section('scripts')
    <script src="{{ asset('plugins/bs-custom-file-input/bs-custom-file-input.min.js') }}"></script>

    <script>
        $(function () {
            bsCustomFileInput.init();
        });
    </script>
@endsection
