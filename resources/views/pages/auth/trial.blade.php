<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="description" content="Request a guided Raymoch trial and discover trusted African business intelligence.">
  <title>Raymoch • Request a Free Trial</title>
  <script>
    window.TRIAL_BOOT = {
      apiTrial: @json(route('api.trial-requests.store')),
      apiCheck: @json(route('api.trial-requests.check')),
      csrf: @json(csrf_token()),
    };
  </script>
  @viteReactRefresh
  @vite('resources/js/app.jsx')
</head>
<body>
  <div id="trial-request-root"></div>
</body>
</html>
