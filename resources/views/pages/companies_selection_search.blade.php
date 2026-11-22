@extends('layouts.appshellotest')
@section('title', 'Raymoch • Sector Business Explorer')
@section('content')
  @viteReactRefresh
  @vite('resources/js/app.jsx')
  <script>window.COMPANY_SELECTION_SEARCH_BOOT = {{ Illuminate\Support\Js::from($selectionSearchBoot) }};</script>
  <div id="companies-selection-search-root"></div>
@endsection
