@extends('layouts.appshellotest')

@section('title', 'Raymoch Journal • African Business Intelligence')

@section('content')
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    <script>
        window.ROUTES = {
            blog: "{{ url('/blog') }}",
            privacy: "{{ url('/privacy') }}",
            terms: "{{ url('/terms') }}",
            cookies: "{{ url('/cookies') }}",
        };
    </script>
    <div id="blog-root"></div>
@endsection
