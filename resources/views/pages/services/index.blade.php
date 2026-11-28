@extends('layouts.appshellotest')

@section('title', 'Raymoch • Services')

@push('styles')
    <link href="{{ asset('css/style_entire.css') }}" rel="stylesheet" id="bootstrap">
@endpush

@section('content')
    @viteReactRefresh
    @vite('resources/js/app.jsx')

    <script>
        window.ROUTES = {
            privacy: @json(url('/privacy')),
            terms: @json(url('/terms')),
            cookies: @json(url('/cookies')),
        };
    </script>

    <div id="services-root"></div>
@endsection
