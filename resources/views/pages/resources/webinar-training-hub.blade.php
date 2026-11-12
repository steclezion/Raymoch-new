@extends('layouts.appshellotest')

@section('title', 'Webinar & Training Hub — Raymoch')

@section('content')
  @viteReactRefresh
  @vite('resources/js/app.jsx')
  <div id="webinar-training-hub-root"></div>
@endsection
