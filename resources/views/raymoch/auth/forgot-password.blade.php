<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Raymoch • Forgot Password</title>
  <script>
    window.PASSWORD_RECOVERY_BOOT = {
      mode: "request",
      csrf: @json(csrf_token()),
      submitUrl: @json(route('password.email')),
      loginUrl: @json(route('login')),
    };
  </script>
  @viteReactRefresh
  @vite('resources/js/app.jsx')
</head>
<body>
  <div id="password-recovery-root"></div>
</body>
</html>
