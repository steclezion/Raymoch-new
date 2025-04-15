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
    #languageSwitcher:hover {
        opacity: 1;
        backdrop-filter: blur(0);

    }


    #languageSwitcher {
    position: fixed;
    bottom: 20px;
    right: 20px;
}

/* Hover: clear and show */

/* Responsive (mobile view) */
@media (max-width: 768px) {
    #languageSwitcher {
        top: 10px;
        bottom: auto;
        right: 10px;
        left: 10px;
        width: auto;
        justify-content: space-between;
    }

    #languageSwitcher img {
        height: 25px;
    }

    #google_translate_element {
        flex: 1;
        margin-left: 10px;
    }

    /* Only apply hover fade on desktop (optional) */
    @media (min-width: 769px) {
        #languageSwitcher:hover {
            opacity: 1 !important;
            backdrop-filter: blur(0);
        }
    }

}



</style>




<script>
    function relocateSwitcher() {
        const langBox = document.getElementById('languageSwitcher');
        const mobileContainer = document.getElementById('translate');

        if (window.innerWidth <= 768) {
            // Move to mobile container
            if (!mobileContainer.contains(langBox)) {
                langBox.style.position = 'static'; // Reset positioning for inline flow
                mobileContainer.appendChild(langBox);
            }
        } else {
            // Move back to floating position
            if (langBox.parentElement !== document.body) {
                langBox.style.position = 'fixed';
                langBox.style.bottom = '20px';
                langBox.style.right = '20px';
                document.body.appendChild(langBox);
            }
        }
    }

    window.addEventListener('load', relocateSwitcher);
    window.addEventListener('resize', relocateSwitcher);
</script>






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
