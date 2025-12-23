<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Raymoch • Sign Up</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
  <?php echo app('Illuminate\Foundation\Vite')('resources/js/app.jsx'); ?>
  <script>
    window.ROUTES = {
//     
      login: "<?php echo e(route('login')); ?>",
      signup: "<?php echo e(route('signup.index')); ?>",
      request: "<?php echo e(route('request.show')); ?>",
      reset: "<?php echo e(route('password.request')); ?>",
      privacy: "<?php echo e(route('privacy')); ?>",
      terms: "<?php echo e(route('terms')); ?>",
      cookies: "<?php echo e(route('cookies')); ?>",
      basicCreate: "<?php echo e(route('signup.basic.create')); ?>",
      businessCreate: "<?php echo e(route('signup.business.create')); ?>",
      investorCreate: "<?php echo e(route('signup.investor.create')); ?>",
      brandName: "Raymoch"
    };
  </script>
</head>
<body>
  <div id="signup-root"></div>
</body>
</html>
<?php /**PATH C:\Users\stecl\OneDrive\Documents\Raymoch\resources\views/pages/auth/signup/signup.blade.php ENDPATH**/ ?>