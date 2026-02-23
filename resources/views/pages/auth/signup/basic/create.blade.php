<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Raymoch • Sign Up: Basic</title>
<meta name="csrf-token" content="{{ csrf_token() }}">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
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
      store: "{{ route('signup.basic.store', [], false) }}",
    },
  },

  request: {
    show: "{{ route('request.show', [], false) }}"
  },

  dashboard: "{{ url('/dashboard') }}"
};
</script>
</body>
</html>
