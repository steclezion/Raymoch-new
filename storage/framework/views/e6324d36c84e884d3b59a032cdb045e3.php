<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Raymoch • Sign Up: Basic</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
  <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
  <?php echo app('Illuminate\Foundation\Vite')('resources/js/app.jsx'); ?>
</head>
<body>
  <div id="signupBasicRoot"></div>

  <script>
    window.ROUTES = {
      csrf: "<?php echo e(csrf_token()); ?>",
      login: "<?php echo e(route('login')); ?>",
      signup: {
        index: "<?php echo e(route('signup.index')); ?>",
        basic: {
          create: "<?php echo e(route('signup.basic.create.individual')); ?>",
          store: "<?php echo e(route('signup.basic.store')); ?>", // we'll use this as POST target
        },
      },
      request: { show: "<?php echo e(route('request.show')); ?>" },
      dashboard: "<?php echo e(url('/dashboard')); ?>",
    };
  </script>
</body>
</html>
<?php /**PATH C:\Users\stecl\OneDrive\Documents\Raymoch\resources\views/pages/auth/signup/basic/create.blade.php ENDPATH**/ ?>