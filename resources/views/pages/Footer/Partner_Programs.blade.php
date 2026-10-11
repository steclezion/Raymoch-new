@extends('layouts.appshellotest')

@section('title', 'Raymoch — Partner Programs')

@section('content')
  @viteReactRefresh
  @vite('resources/js/app.jsx')

  <div id="partner-programs-root"></div>
@endsection
