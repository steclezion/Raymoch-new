<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <link rel="icon" type="image/svg+xml" href="{{ asset('images/raymoch_logo_11_21_2026.svg') }}">
    <link rel="shortcut icon" href="{{ asset('images/raymoch_logo_11_21_2026.svg') }}">
    <title>@yield('title', 'Raymoch')</title>
    @stack('styles')
</head>
<body>
    @yield('content')

    @stack('scripts')
</body>
</html>
