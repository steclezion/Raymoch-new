@extends('layouts.appshellotest')
@section('title', 'Raymoch Terms of Use')
@section('content')
  @viteReactRefresh
  @vite('resources/js/app.jsx')
  <div id="terms-page-root"></div>
@endsection
