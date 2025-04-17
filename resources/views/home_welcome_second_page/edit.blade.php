@extends('layouts_admin.app')
@section('content')
<div class="container">
    <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="card shadow-sm">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0"> Edit Page</h5>
                            <a href="{{ url('/home-welcome-second-page') }}" class="float-right">
                                <button class="btn btn-secondary"> <span class="far fa-arrow-alt-circle-left"> Back </button>
                            </a>
                        </div>
                         <div class="card-body">
                                <form action="{{ route('home-welcome-second-page.update', $homeWelcomeSecondPage->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        @include('home_welcome_second_page.form')
        <button type="submit" class="btn btn-primary">Update</button>
    </form>
</div>
</div>
</div>
</div>
</div>
@endsection

