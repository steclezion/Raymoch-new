@extends('layouts.appshellotest')
@section('title', 'Raymoch Accessibility')
@section('content')
  @viteReactRefresh
  @vite('resources/js/app.jsx')
  <div id="accessibility-page-root"></div>
@endsection
