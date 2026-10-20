@extends('layouts.appshellotest')

@section('title', 'Raymoch • Intelligence Detail')

@section('content')
  @viteReactRefresh
  @vite('resources/js/app.jsx')
  <div id="insight-detail-root"></div>
@endsection
