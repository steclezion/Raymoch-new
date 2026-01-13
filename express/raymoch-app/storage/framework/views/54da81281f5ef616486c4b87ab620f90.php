<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Raymoch</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
  <nav class="navbar bg-white border-bottom sticky-top">
    <div class="container">
      <a class="navbar-brand fw-bold" href="/">Raymoch</a>
      <div class="d-flex gap-2">
        <input class="form-control" placeholder="Search">
        <a class="btn btn-outline-dark" href="#">Log in</a>
        <a class="btn btn-dark" href="#">Sign up</a>
      </div>
    </div>
  </nav>

  <?php echo $__env->yieldContent('content'); ?>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
<?php /**PATH /Users/elsarussom/Desktop/Raymoch-Project/raymoch-app/resources/views/layouts/app.blade.php ENDPATH**/ ?>