@extends('layouts.appshellotest')
@section('title', 'Raymoch Cookie Information')
@section('content')
  @viteReactRefresh
  @vite('resources/js/app.jsx')
  <div id="cookies-page-root"></div>
@endsection
