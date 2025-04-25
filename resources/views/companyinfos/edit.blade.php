@extends('layouts_admin.app')
@section('content')
<div class="container">
    <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="card shadow-sm">
                        <div class="card-header bg-primary text-white">
                            <div class="d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">  <i class="fas fa-edit"></i> Edit Companies </h5>
                            <a href="{{ url('/companyinfos') }}" class="btn btn-secondary">
                                <i class="far fa-arrow-alt-circle-left"></i> Back
                            </a>
                        </div>
                    </div>
                         <div class="card-body">
     <form action="{{ route('companyinfos.update', $companyinfo->id) }}" method="POST" enctype="multipart/form-data">
                                @csrf
        @method('PUT')
        @include('companyinfos.partials.form')
        {{-- <button type="submit" class="btn btn-primary">Update</button> --}}
    </form>
</div>
</div>
</div>
</div>
</div>
@endsection
