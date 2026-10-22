<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="description" content="{{ $description }}">
  <title>Raymoch • {{ $pageTitle }}</title>
  <script>window.RESOURCE_PAGE = @json($resourcePage);</script>
  @viteReactRefresh
  @vite('resources/js/app.jsx')
</head>
<body>
  <div id="resource-page-root"></div>
</body>
</html>
