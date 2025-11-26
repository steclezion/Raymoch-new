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
      <script>
    window.Routes = {
      home: "{{ url('/') }}",
      login: "{{ url('/login') }}",
      signup: "{{ url('/signup') }}",
      privacy: "{{ url('/privacy') }}",
      terms: "{{ url('/terms') }}",
      cookies: "{{ url('/cookies') }}",
      auth: { check_email: "{{ url('/auth/check-email') }}" },
      signup: {
        index: "{{ url('/signup') }}",
        premium: {
          send_otp: "{{ url('/signup/premium/send-otp') }}",
          verify_otp: "{{ url('/signup/premium/verify-otp') }}",
          complete: "{{ url('/signup/premium/complete') }}",
        },
        business: {
          send_otp: "{{ url('/signup/business/send-otp') }}",
          verify_otp: "{{ url('/signup/business/verify-otp') }}",
          complete: "{{ url('/signup/business/complete') }}",
        },
      },
      payment: { create_payment_intent: "{{ url('/payment/create-payment-intent') }}" },
    };
  </script>
    @yield('content') {{-- child pages will define this --}}
  </main>

  {{-- Shared Footer --}}
  @include('partials.footer')
@endsection
