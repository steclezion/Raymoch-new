<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Raymoch • Log In</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
  <script>
    window.LOGIN_BOOT = {
      csrf: "<?php echo e(csrf_token()); ?>",
      apiLogin: "<?php echo e(route('auth.login.json')); ?>",
      redirectTo: "<?php echo e(url('/dashboard')); ?>",
    };
  </script>
  <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
  <?php echo app('Illuminate\Foundation\Vite')('resources/js/app.jsx'); ?>
</head>
<body>
  <div id="doot"></div>
</body>
</html>
<?php /**PATH C:\Users\stecl\OneDrive\Documents\Raymoch\resources\views/pages/auth/login.blade.php ENDPATH**/ ?>