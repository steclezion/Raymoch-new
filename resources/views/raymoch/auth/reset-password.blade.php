<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Raymoch • Reset Password</title>
  <script>
    window.PASSWORD_RECOVERY_BOOT = {
      mode: "reset",
      csrf: @json(csrf_token()),
      submitUrl: @json(route('password.update')),
      loginUrl: @json(route('login')),
      token: @json($token),
      email: @json($email),
    };
  </script>
  @viteReactRefresh
  @vite('resources/js/app.jsx')
</head>
<body>
  <div id="password-recovery-root"></div>
</body>
</html>
