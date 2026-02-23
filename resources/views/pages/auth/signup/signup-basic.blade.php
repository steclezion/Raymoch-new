<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Raymoch • Signup</title>

  {{-- ✅ CSRF MUST be its own meta tag --}}
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

  @viteReactRefresh
  @vite('resources/js/app.jsx')
</head>
<body>
  <div id="signupBasic"></div>

  <script>
    // ✅ Use RELATIVE URLs so requests always stay on the same domain (www vs non-www safe)
    window.ROUTES = {
      csrf: "{{ csrf_token() }}",

      login: "{{ route('login', [], false) }}",
      signup: {
        index: "{{ route('signup.index', [], false) }}",
        basic: {
          create: "{{ route('signup.basic.create', [], false) }}",
          send_otp: "{{ route('signup.basic.send_otp', [], false) }}",
          verify_otp: "{{ route('signup.basic.verify_otp', [], false) }}",
        },
        business: {
          create: "{{ route('signup.business.create', [], false) }}",
        },
        investor: {
          create: "{{ route('signup.investor.create', [], false) }}",
        },
      },

      request: {
        show: "{{ route('request.show', [], false) }}",
      },

      privacy: "{{ route('privacy', [], false) }}",
      terms: "{{ route('terms', [], false) }}",
      cookies: "{{ route('cookies', [], false) }}",

      country_codes_api: "{{ url('/api/country-codes') }}", // ok if same domain
    };
  </script>
</body>
</html>
