<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Raymoch • Authenticator Setup</title>
  @viteReactRefresh
  @vite('resources/js/app.jsx')
</head>
<body>
  <div id="authenticator-setup-root"></div>
</body>
</html>
