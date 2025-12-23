
<link href="<?php echo e(asset('css/style_entire.css')); ?>" rel="stylesheet" type="text/css" id="bootstrap">
<!-- Bootstrap CSS for Section 4 African Slides -->
<?php $__env->startSection('title','Raymoch • Business Explorer'); ?>
<?php $__env->startSection('content'); ?>

  <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
  <?php echo app('Illuminate\Foundation\Vite')('resources/js/app.jsx'); ?>
<script>
  window.ROUTES = {
    privacy: "<?php echo e(url('/privacy')); ?>",
    terms: "<?php echo e(url('/terms')); ?>",
    cookies: "<?php echo e(url('/cookies')); ?>",
  };
</script>
  <div id="explore-companies"></div>


<?php $__env->startPush('scripts'); ?>

<?php $__env->stopPush(); ?>




<?php /**PATH C:\Users\stecl\OneDrive\Documents\Raymoch\resources\views/pages/companies.blade.php ENDPATH**/ ?>