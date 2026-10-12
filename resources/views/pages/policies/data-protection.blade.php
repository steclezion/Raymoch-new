@extends('layouts.appshellotest')
@section('title', 'Raymoch Data Protection')
@section('content')
  @viteReactRefresh
  @vite('resources/js/app.jsx')
  <div id="data-protection-page-root"></div>
@endsection
