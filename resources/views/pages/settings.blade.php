<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="description" content="Manage your Raymoch account, security, notifications, and display preferences.">
  <title>Raymoch • Settings</title>
  <script>
    window.SETTINGS_BOOT = {
      csrf: @json(csrf_token()),
      dataUrl: @json(route('settings.data')),
      profileUrl: @json(route('settings.profile')),
      passwordUrl: @json(route('settings.password')),
      preferencesUrl: @json(route('settings.preferences')),
    };
  </script>
  @viteReactRefresh
  @vite('resources/js/app.jsx')
</head>
<body>
  <div id="settings-root"></div>
</body>
</html>
