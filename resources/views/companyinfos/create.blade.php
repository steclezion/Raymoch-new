


@extends('layouts_admin.app')
@section('content')
<div class="container">
    <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="card shadow-sm">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0"> Add New Company</h5>
                            <a href="{{ url('/companyinfos') }}" class="float-right">
                                <button class="btn btn-secondary"> <span class="far fa-arrow-alt-circle-left"> Back </button>
                            </a>
                        </div>
                         <div class="card-body">
                            <form action="{{ route('companyinfos.store') }}" method="POST" enctype="multipart/form-data">
                                @csrf
                                @include('companyinfos.partials.form')
                            </form>
</div>
</div>
</div>
</div>
</div>
@endsection
