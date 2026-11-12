@extends('layouts.appshellotest')

@section('title', 'Raymoch Newsletter • African Business Intelligence')

@section('content')
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    <script>
        window.ROUTES = {
            newsletter: "{{ url('/Newsletters') }}",
            privacy: "{{ url('/privacy') }}",
            terms: "{{ url('/terms') }}",
            cookies: "{{ url('/cookies') }}",
        };
    </script>
    <div id="blog-root"></div>
@endsection
