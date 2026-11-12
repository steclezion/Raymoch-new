@extends('layouts.appshellotest')

@section('title', 'Success Stories — Raymoch')

@section('content')
  @viteReactRefresh
  @vite('resources/js/app.jsx')
  <div id="success-stories-root"></div>
@endsection
