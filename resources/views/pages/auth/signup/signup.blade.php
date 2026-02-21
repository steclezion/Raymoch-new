<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Raymoch • Sign Up</title>
  <meta name="csrf-token" content="{{ csrf_token() }}">

  @viteReactRefresh
  @vite('resources/js/app.jsx')
  <script>
    window.ROUTES = {
// {{-- home: "{{ route('home') }}" --}}    
      login: "{{ route('login') }}",
      signup: "{{ route('signup.index') }}",
      request: "{{ route('request.show') }}",
      reset: "{{ route('password.request') }}",
      privacy: "{{ route('privacy') }}",
      terms: "{{ route('terms') }}",
      cookies: "{{ route('cookies') }}",
      basicCreate: "{{ route('signup.basic.create') }}",
      businessCreate: "{{ route('signup.business.create') }}",
      investorCreate: "{{ route('signup.investor.create') }}",
      brandName: "Raymoch",
    };
  </script>
</head>
<body>
  <div id="signup-root"></div>
</body>
</html>
