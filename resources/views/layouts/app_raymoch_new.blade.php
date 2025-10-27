{{-- resources/views/layouts/app_raymoch.blade.php --}}
@extends('layouts.app')

{{-- Extra assets for Raymoch (Bootstrap, etc.) --}}
@push('head')
  <link href="{{ asset('css/bootstrap.min.css') }}" rel="stylesheet" type="text/css" id="bootstrap">
@endpush

@section('body')
  {{-- Shared Header --}}
  @include('partials.header')

  <main id="content" role="main">
    @yield('content') {{-- child pages will define this --}}
  </main>

  {{-- Shared Footer --}}
  @include('partials.footer')
@endsection
