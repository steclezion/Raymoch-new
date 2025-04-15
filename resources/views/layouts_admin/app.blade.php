<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="icon" href="{{asset('images/1-edited-ai-reference.png')}}" type="image/gif"  sizes="20x20">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title> Raymoch | Admin</title>

  {{-- <script>
    // Disable Right Click
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+C, Ctrl+Shift+J
    document.onkeydown = function (e) {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        return false;
      }
    };
  </script> --}}

<script>
    // Disable Right Click
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+C, Ctrl+Shift+J
    document.onkeydown = function (e) {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        return false;
      }
    };
  </script>

@include('layouts_admin.css_libs')
@yield('stylesheets')
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
</head>
<body class="hold-transition sidebar-mini layout-fixed">
<div class="wrapper">


@include('layouts_admin.header_nav')
<!-- content wraper -->
<div class="content-wrapper">

  <br>
  @include('layouts_admin.message')

    @yield('content')
  </div>
  <!-- /.content-wrapper -->
  <!-- Main Sidebar Container -->
  @include('layouts_admin.left_nav_bar')
  @include('layouts_admin.footer_2')





  <!-- Control Sidebar -->
  <aside class="control-sidebar control-sidebar-dark">
    <!-- Control sidebar content goes here -->
  </aside>
  <!-- /.control-sidebar -->
</div>
<!-- ./wrapper -->
@include('layouts_admin.js_libs')
@yield('scripts')

{{-- <script>
    Echo.private('assignedTo.{{auth()->user()->id}}')
        .listen('.dossier.assignment', (e) => {
            console.log(e)

          toastr.success(e.message)

          $.ajax({

            type:'GET',

            url:"{{ route('retrieve_notifications') }}",

            data:{},

            success:function(data){

              document.getElementById('notification_count').innerHTML=data.notification_count;
              document.getElementById('notification_count_header').innerHTML=data.notification_count;
              document.getElementById('notification_contents').innerHTML=data.notifications;

            },
            error:function (data) {

              console.log(data);
            }
          });

           // document.getElementById('event_msg').innerHTML = e.message;
        }) //listen


  //this code is ajax for loading notifications

    $.ajax({

      type:'GET',

      url:"{{ route('retrieve_notifications') }}",

      data:{},

      success:function(data){

        document.getElementById('notification_count').innerHTML=data.notification_count;
        document.getElementById('notification_count_header').innerHTML=data.notification_count;
        document.getElementById('notification_contents').innerHTML=data.notifications;

      },
      error:function (data) {

        console.log(data);
      }
    });
</script> --}}
</body>
</html>
