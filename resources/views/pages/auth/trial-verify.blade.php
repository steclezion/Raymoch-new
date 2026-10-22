<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="description" content="Verify your six-digit Raymoch trial coupon.">
  <title>Raymoch • Verify Trial Coupon</title>
  <script>
    window.TRIAL_COUPON_BOOT = {
      csrf: @json(csrf_token()),
      verifyUrl: @json(route('trial.coupon.verify')),
      email: @json(request('email', '')),
    };
  </script>
  @viteReactRefresh
  @vite('resources/js/app.jsx')
</head>
<body>
  <div id="trial-verify-root"></div>
</body>
</html>
