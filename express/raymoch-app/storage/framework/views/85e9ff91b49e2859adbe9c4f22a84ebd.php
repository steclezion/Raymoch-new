<?php $__env->startSection('content'); ?>
<div class="container py-4">
  <h1 class="mb-3">Matching</h1>

  <h2 class="h5 mt-4">Top Matches</h2>
  <ul class="list-group mb-4">
    <?php $__currentLoopData = $matches; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $m): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong><?php echo e($m['company']['name']); ?></strong>
          <small class="text-muted"> — <?php echo e($m['company']['country']); ?> • <?php echo e($m['company']['sector']); ?></small>
          <div class="text-muted"><?php echo e($m['company']['summary']); ?></div>
        </div>
        <span class="badge bg-primary rounded-pill"><?php echo e(number_format($m['score'],1)); ?></span>
      </li>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
  </ul>

  <h2 class="h5">All Companies</h2>
  <div class="row row-cols-1 row-cols-md-2 g-3">
    <?php $__currentLoopData = $companies; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $c): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
      <div class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title mb-1"><?php echo e($c['name']); ?></h5>
            <div class="text-muted mb-2"><?php echo e($c['country']); ?> • <?php echo e($c['sector']); ?></div>
            <p class="mb-0"><?php echo e($c['summary']); ?></p>
          </div>
        </div>
      </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
  </div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /Users/elsarussom/Desktop/Raymoch-Project/raymoch-app/resources/views/matching/index.blade.php ENDPATH**/ ?>