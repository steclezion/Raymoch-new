<!DOCTYPE html>
<html lang="zxx" >
<head>
   
    <link rel="icon" href="{{asset('images/1-edited-ai-1.svg')}}" type="image/gif" sizes="16x16">
    <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
    <meta content="width=device-width, initial-scale=1.0" name="viewport" >
    <meta content="Gardyn — Garden and Landscape Website Template" name="description" >
    <meta name="csrf-token" content="{{ csrf_token() }}">
     <title>@yield('title', config('app.name'))</title>
    <meta content="" name="keywords" >
 

    {{-- <script>
        document.addEventListener('contextmenu', event => event.preventDefault());
        document.onkeydown = function(e) {
          if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
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


    <script type="text/javascript">
        function googleTranslateElementInit() {
          new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
        }
        </script>

        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
        <style>
               .goog-logo-link {
            display:none !important;
        }

        .goog-te-gadget{
            color: transparent;
        }
        .goog-te-gadget .goog-te-combo {
            margin: 0px 0;
                padding: 8px;
        }
        #google_translate_element{
                padding-top: 14px;
        }
        </style>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>

<script>
    const toggleBtn = document.getElementById('toggleLang');
    const langBox = document.getElementById('languageSwitcher');

    toggleBtn.addEventListener('click', function () {
        if (langBox.style.display === 'none' || langBox.style.display === '') {
            langBox.style.display = 'flex';
            langBox.classList.remove('animate__fadeOut');
            langBox.classList.add('animate__fadeIn');
        } else {
            langBox.classList.remove('animate__fadeIn');
            langBox.classList.add('animate__fadeOut');
            setTimeout(() => langBox.style.display = 'none', 500); // delay to allow animation
        }
    });
</script>





<style>
    .translate-box {
        transform: scale(1);
        transform-origin: left center;
        transition: transform 0.3s ease, opacity 0.3s ease;
        opacity: 0.4; /* default low transparency */
    }

    @media (max-width: 768px) {
        .translate-box {
            transform: scale(0.8);
            opacity: 0.8; /* more visible on smaller screens */
        }
    }

    @media (max-width: 480px) {
        .translate-box {
            transform: scale(0.7);
            opacity: 1; /* fully visible on very small screens */
        }
    }
</style>









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
