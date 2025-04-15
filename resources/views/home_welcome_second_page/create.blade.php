@extends('layouts_admin.app')
@section('content')
<div class="container">
    <form action="{{ route('home-welcome-second-page.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        @include('home_welcome_second_page.form')
        <button type="submit" class="btn btn-success">Save</button>
    </form>
</div>
@endsection



