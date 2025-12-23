<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Raymoch • Pricing — Basic Plans</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
  <?php echo app('Illuminate\Foundation\Vite')('resources/js/app.jsx'); ?>
</head>
<body>
  <div id="pricingBasic"></div>

  <script>
    window.ROUTES = {
      login: "<?php echo e(route('login')); ?>",
      "signup.index": "<?php echo e(route('signup.index')); ?>",
      "signup.basic.create": "<?php echo e(route('signup.basic.create')); ?>",
      "signup.business.create": "<?php echo e(route('signup.business.create')); ?>",
      "signup.investor.create": "<?php echo e(route('signup.investor.create')); ?>",up
      "request.show": "<?php echo e(route('request.show')); ?>",
      privacy: "<?php echo e(route('privacy')); ?>",
      terms: "<?php echo e(route('terms')); ?>",
      cookies: "<?php echo e(route('cookies')); ?>",
    };

  </script>
</body>
</html>
<?php /**PATH C:\Users\stecl\OneDrive\Documents\Raymoch\resources\views/pages/auth/signup/signup-basic.blade.php ENDPATH**/ ?>