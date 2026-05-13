<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
       <meta charset="utf-8">
    <meta name="viewport" content="width=devi    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Membership Started</title>

    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
</head>
<body>
    <div id="membership-success-root"></div>
</body>
</html>