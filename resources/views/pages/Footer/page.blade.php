@extends('layouts.appshellotest')

@section('title', 'Raymoch')

@section('content')
  @viteReactRefresh
  @vite('resources/js/app.jsx')

  <script>
    window.FOOTER_PAGE = @json($footerPage);
  </script>

  <div id="footer-information-root"></div>
@endsection
