<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Raymoch • Pricing — Basic Plans</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  @viteReactRefresh
  @vite('resources/js/app.jsx')
</head>
<body>
  <div id="SignupInvestorAccountRoot"></div>

  <script>
    window.ROUTES = {
        csrf: "{{ csrf_token() }}",
      "login": "{{ route('login') }}",
      "auth.check-email": "{{ route('auth.check-email') }}",
      "signup.index": "{{ route('signup.index') }}",
      "signup.basic.create": "{{ route('signup.basic.create') }}",
      "signup.business.create": "{{ route('signup.business.create') }}",
      "signup.investor.create": "{{ route('signup.investor.create') }}",
      "request.show": "{{ route('request.show') }}",
      privacy: "{{ route('privacy') }}",
      terms: "{{ route('terms') }}",
      cookies: "{{ route('cookies') }}",
    };

  </script>
</body>
</html>
