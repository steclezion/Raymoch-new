<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Raymoch • Log In</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <script>
    window.LOGIN_BOOT = {
      csrf: "{{ csrf_token() }}",
      apiLogin: "{{ route('auth.login.json') }}",
      apiMfa: "{{ route('auth.login.mfa') }}",
      redirectTo: "{{ url('/dashboard') }}",
    };
  </script>
  @viteReactRefresh
  @vite('resources/js/app.jsx')
</head>
<body>
  <div id="doot"></div>
</body>
</html>
