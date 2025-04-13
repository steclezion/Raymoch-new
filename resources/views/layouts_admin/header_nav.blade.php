<nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <a href="index3.html" class="nav-link">Home</a>
      </li>

      <li class="nav-item d-none d-sm-inline-block">
        <a href="{{ url('/roles') }}" class="nav-link">Roles</a>
      </li>

      <li class="nav-item d-none d-sm-inline-block">
        <a href="{{ url('/permissions') }}" class="nav-link">Permissions</a>
      </li>

    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">
 
      <li class="nav-item dropdown">

        <a class="nav-link" data-toggle="dropdown" href="#">
          <i class="far fa-bell"></i>
          <span class="badge badge-warning navbar-badge" id="notification_count"> </span>
        </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <p style="horiz-align: center ;margin-left: 5px;">
          You have
          <span id="notification_count_header">
           </span>
          notifications.
          </p>
          <div class="dropdown-divider"></div>
          <p id="notification_contents" >

          </p>
          <div class="dropdown-divider"></div>
          <a href="" class="dropdown-item dropdown-footer">See All Notifications</a>
          </div>

      </li>
      <a href="{{ route('logout') }}" class="dropdown-item" title="Logout">
        <i class="fas fa-sign-out-alt"></i>
        <span class="float-right text-muted text-sm"></span>
      </a>

      <li class="nav-item">
        <a class="nav-link" data-widget="control-sidebar" data-slide="true" href="" role="button">
          <i class="fas fa-th-large"></i>
        </a>
      </li>
    </ul>
  </nav>
