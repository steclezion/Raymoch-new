<!DOCTYPE html>
<html lang="zxx" >
<head>
    <title>Raymoch</title>
    <link rel="icon" href="{{asset('images/1-edited-ai-1.svg')}}" type="image/gif" sizes="16x16">
    <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
    <meta content="width=device-width, initial-scale=1.0" name="viewport" >
    <meta content="Gardyn — Garden and Landscape Website Template" name="description" >
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Raymoch-Home</title>
    <meta content="" name="keywords" >
    <meta content="" name="author" >




 <!-- css scripts -->
@include('layouts.css_libs')
@yield('stylesheets')

</head>


    <body>
    <div id="wrapper">
    <a href="#" id="back-to-top"></a>
    <!-- preloader begin -->
    <div id="de-loader"></div>
    <!-- preloader end -->
    @include('layouts.header_nav')
    <!-- content wraper -->
    @yield('content')
   @include('layouts.footer')
    </div>

  @include('layouts.footer_2')






@include('layouts.js_libs')
@yield('scripts')




</body>
</html>
