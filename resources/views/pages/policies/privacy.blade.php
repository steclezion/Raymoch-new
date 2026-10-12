@extends('layouts.appshellotest')
@section('title', 'Raymoch Privacy Notice')
@section('content')
  @viteReactRefresh
  @vite('resources/js/app.jsx')
  <div id="privacy-page-root"></div>
@endsection
