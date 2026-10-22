<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="description" content="Review account alerts, activity, opportunities, and updates from Raymoch.">
  <title>Raymoch • Notifications</title>
  <script>
    window.NOTIFICATIONS_BOOT = {
      csrf: @json(csrf_token()),
      dataUrl: @json(route('notifications.data')),
      updateUrl: @json(route('notifications.update', ['notification' => '__ID__'])),
      destroyUrl: @json(route('notifications.destroy', ['notification' => '__ID__'])),
      readAllUrl: @json(route('notifications.read-all')),
      clearReadUrl: @json(route('notifications.clear-read')),
    };
  </script>
  @viteReactRefresh
  @vite('resources/js/app.jsx')
</head>
<body>
  <div id="notifications-root"></div>
</body>
</html>
