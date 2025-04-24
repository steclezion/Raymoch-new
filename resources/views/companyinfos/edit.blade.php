@extends('layouts_admin.app')
@section('content')
<div class="container">
    <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="card shadow-sm">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0"> Edit Companies </h5>
                            <a href="{{ url('/companyinfos') }}" class="float-right">
                                <button class="btn btn-secondary"> <span class="far fa-arrow-alt-circle-left"> Back </button>
                            </a>
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
