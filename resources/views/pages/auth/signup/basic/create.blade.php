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
      login: "{{ route('login') }}",
      signup: {
        index: "{{ route('signup.index') }}",
        basic: {
          create: "{{ route('signup.basic.create.individual') }}",
          store: "{{ route('signup.basic.store') }}", // we'll use this as POST target
        },
      },
      request: { show: "{{ route('request.show') }}" },
      dashboard: "{{ url('/dashboard') }}",
    };
  </script>
</body>
</html>
