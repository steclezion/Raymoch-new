@extends('layouts_admin.app')
@section('content')
<div class="container">
    <form action="{{ route('home-welcome-second-page.update', $homeWelcomeSecondPage->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        @include('home_welcome_second_page.form')
        <button type="submit" class="btn btn-primary">Update</button>
    </form>
</div>
@endsection
