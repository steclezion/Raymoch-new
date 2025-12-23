



<?php $__env->startPush('head'); ?>
  <link href="<?php echo e(asset('css/bootstrap.min.css')); ?>" rel="stylesheet" type="text/css" id="bootstrap">
<?php $__env->stopPush(); ?>

<?php $__env->startSection('body'); ?>
  
  <?php echo $__env->make('partials.header', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

  <main id="content" role="main">
      <script>
    window.Routes = {
      home: "<?php echo e(url('/')); ?>",
      login: "<?php echo e(url('/login')); ?>",
      signup: "<?php echo e(url('/signup')); ?>",
      privacy: "<?php echo e(url('/privacy')); ?>",
      terms: "<?php echo e(url('/terms')); ?>",
      cookies: "<?php echo e(url('/cookies')); ?>",
      auth: { check_email: "<?php echo e(url('/auth/check-email')); ?>" },
      signup: {
        index: "<?php echo e(url('/signup')); ?>",
        premium: {
          send_otp: "<?php echo e(url('/signup/premium/send-otp')); ?>",
          verify_otp: "<?php echo e(url('/signup/premium/verify-otp')); ?>",
          complete: "<?php echo e(url('/signup/premium/complete')); ?>",
        },
        business: {
          send_otp: "<?php echo e(url('/signup/business/send-otp')); ?>",
          verify_otp: "<?php echo e(url('/signup/business/verify-otp')); ?>",
          complete: "<?php echo e(url('/signup/business/complete')); ?>",
        },
      },
      payment: { create_payment_intent: "<?php echo e(url('/payment/create-payment-intent')); ?>" },
    };
  </script>
    <?php echo $__env->yieldContent('content'); ?> 
  </main>

  
  <?php echo $__env->make('partials.footer', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\Users\stecl\OneDrive\Documents\Raymoch\resources\views/layouts/app_raymoch_new.blade.php ENDPATH**/ ?>