@extends('layouts.appshellotest')

@section('title', 'Raymoch — Trust and Methodology')

@section('content')
  @viteReactRefresh
  @vite('resources/js/app.jsx')

  <div id="trust-and-methodology-root"></div>
@endsection
