<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Raymoch • Sign Up: Basic</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  @viteReactRefresh
  @vite('resources/js/app.jsx')
</head>
<body>
  <div id="signupBasicRoot"></div>

<script>
  window.ROUTES = {
    csrf: "{{ csrf_token() }}",
    login: "{{ route('login', [], false) }}",
    signup: {
      index: "{{ route('signup.index', [], false) }}",
      basic: {
        create: "{{ route('signup.basic.create.individual', [], false) }}",
        // IMPORTANT: use the same key your React uses:
        send_otp: "{{ route('signup.basic.send_otp', [], false) }}",
        verify_otp: "{{ route('signup.basic.verify_otp', [], false) }}",
      },
    },
    request: { show: "{{ route('request.show', [], false) }}" },
    dashboard: "{{ url('/dashboard') }}",
  };
</script>
</body>
</html>
