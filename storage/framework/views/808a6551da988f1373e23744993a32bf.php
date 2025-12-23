<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title><?php echo $__env->yieldContent('title', config('app.name', 'Laravel')); ?></title>

  
  <link rel="stylesheet" href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" />

  
  <link rel="stylesheet" href="<?php echo e(asset('css/app.css')); ?>">
  <script src="<?php echo e(asset('js/app.js')); ?>" defer></script>

  
  <?php echo $__env->yieldPushContent('head'); ?>
</head>
<body class="font-sans antialiased">
  <?php if (! empty(trim($__env->yieldContent('body')))): ?>
    
    <?php echo $__env->yieldContent('body'); ?>
  <?php else: ?>
    
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <?php echo $__env->make('layouts.navigation', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

      <?php if (! empty(trim($__env->yieldContent('header')))): ?>
        <header class="bg-white dark:bg-gray-800 shadow">
          <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <?php echo $__env->yieldContent('header'); ?>
          </div>
        </header>
      <?php endif; ?>

      <main>
        

  <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">





        <?php echo $__env->yieldContent('content'); ?>
      </main>
    </div>
  <?php endif; ?>

  
  <?php echo $__env->yieldPushContent('scripts'); ?>
</body>
</html>
<?php /**PATH C:\Users\stecl\OneDrive\Documents\Raymoch\resources\views/layouts/app.blade.php ENDPATH**/ ?>