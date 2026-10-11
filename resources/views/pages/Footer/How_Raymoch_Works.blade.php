@extends('layouts.appshellotest')

@section('title', 'Raymoch — How Raymoch Works')

@section('content')
  @viteReactRefresh
  @vite('resources/js/app.jsx')

  <div id="how-raymoch-works-root"></div>
@endsection
