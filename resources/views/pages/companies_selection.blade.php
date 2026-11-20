@extends('layouts.appshellotest')
<link href="{{ asset('css/style_entire.css') }}" rel="stylesheet" type="text/css" id="bootstrap">
@section('title', 'Raymoch • Company Selection')
@section('content')

  @viteReactRefresh
  @vite('resources/js/app.jsx')
  <script>
    window.COMPANY_SELECTION_BOOT = {{ Illuminate\Support\Js::from($selectionBoot) }};
    window.ROUTES = {
      privacy: "{{ url('/privacy') }}",
      terms: "{{ url('/terms') }}",
      cookies: "{{ url('/cookies') }}",
    };
  </script>
  <div id="companies-selection-root"></div>

@push('scripts')
@endpush
