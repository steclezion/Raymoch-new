@extends('layouts.appshellotest')

@section('title', 'Raymoch — Contact')

@section('content')
  @viteReactRefresh
  @vite('resources/js/app.jsx')

  <script>
    window.CONTACT_ENDPOINT = @json(route('contact.messages.store'));
  </script>
  <div id="contact-page-root"></div>
@endsection
