<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Raymoch • Pricing — Basic Plans</title>
  <meta name="csrf-token" content="{{ csrf_token() }}">  @viteReactRefresh
  @vite('resources/js/app.jsx')
</head>
<body>
  <div id="pricingBasic"></div>

  <script>
    window.ROUTES = {
      login: "{{ route('login') }}",
      "signup.index": "{{ route('signup.index') }}",
      "signup.basic.create": "{{ route('signup.basic.create') }}",
      "signup.business.create": "{{ route('signup.business.create') }}",
      "signup.investor.create": "{{ route('signup.investor.create') }}",up
      "request.show": "{{ route('request.show') }}",
      privacy: "{{ route('privacy') }}",
      terms: "{{ route('terms') }}",
      cookies: "{{ route('cookies') }}",
    };

  </script>
</body>
</html>
