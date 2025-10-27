<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Raymoch</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <nav class="navbar navbar-light bg-white border-bottom sticky-top">
    <div class="container">
      <a class="navbar-brand" href="/">Raymoch</a>
      <form class="d-flex" role="search" onsubmit="return false;">
        <input class="form-control me-2" type="search" placeholder="Search…" aria-label="Search">
        <button class="btn btn-outline-primary" type="button">Search</button>
      </form>
    </div>
  </nav>

  @yield('content')

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
