@extends('layouts.appshellotest')

@section('title', 'Raymoch — Careers')

@section('content')
  @viteReactRefresh
  @vite('resources/js/app.jsx')

  <div id="careers-page-root"></div>
@endsection
