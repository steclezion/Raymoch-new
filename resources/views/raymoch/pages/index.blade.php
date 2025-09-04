@extends('layouts.app_ray')
@section('content')
    @section('title', 'Home | ' . config('app.name'))
    @section('meta_description', 'Welcome to ' . config('app.name') . '.')

    @foreach ($HomePageActive as $HomePageActive)
    @endforeach
    @foreach ($Selected_Home_Page_Second_p as $Selected_Home_Page_Second_p)
    @endforeach
    @foreach ($Selected_Home_Page_Second_w as $Selected_Home_Page_Second_w)
    @endforeach
    @foreach ($Selected_Home_Page_Second_c as $Selected_Home_Page_Second_c)
    @endforeach
    @foreach ($Selected_Home_Page_Second_h as $Selected_Home_Page_Second_h)
    @endforeach
    @foreach ($Selected_Home_Page_Second_m as $Selected_Home_Page_Second_m)
    @endforeach
    @foreach ($Selected_Home_Page_Second_r as $Selected_Home_Page_Second_r)
    @endforeach
    @foreach ($Selected_Home_Page_Second_s as $Selected_Home_Page_Second_s)
    @endforeach
    @foreach ($Selected_Home_Page_Second_e as $Selected_Home_Page_Second_e)
    @endforeach
 @include('raymoch/pages/section_one/style')
<div class="no-bottom no-top" id="content">
        <!--  Front section that includes all feature, middle search marquee, events and product views  -->
        @include('raymoch.pages.section_one.section') {{-- use dot notation --}}
        @include('raymoch/pages/section_two/section')
        @include('raymoch/pages/section_three/section')
        @include('raymoch/pages/section_three/section_three_second')
        @include('raymoch/pages/section_four/section')
        @include('raymoch/pages/section_five/section')
        @include('raymoch/pages/section_six/section')
    </div>

    <!-- content end -->

    <!-- footer begin -->

    <!-- footer end -->


    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script>
        $(function() {
            // DATA: give each org a URL. (Laravel: replace with json(organizations))
            const orgs = [{
                    name: "Raymoch Group",
                    url: "https://example.com/raymoch"
                },
                {
                    name: "Adulis Logistics",
                    url: "https://example.com/adulis"
                },
                {
                    name: "Aruco Manufacturing",
                    url: "https://example.com/aruo"
                },
                {
                    name: "Asmara Textiles",
                    url: "https://example.com/asmara"
                },
                {
                    name: "Dahlak Marine",
                    url: "https://example.com/dahlak"
                },
                {
                    name: "Massawa Port Services",
                    url: "https://example.com/mps"
                },
                {
                    name: "Keren Foods",
                    url: "https://example.com/keren"
                },
                {
                    name: "Sawa Construction",
                    url: "https://example.com/sawa"
                },
                {
                    name: "Zula Energy",
                    url: "https://example.com/zula"
                },
                {
                    name: "Himbirti Tech",
                    url: "https://example.com/himbirti"
                }
            ];

            // Build ticker HTML: two identical tracks for seamless loop
            const $viewport = $('#tickerViewport');
            const $move = $('<div class="ticker-move"></div>');
            const $trackA = $('<div class="ticker-track"></div>');
            const $trackB = $('<div class="ticker-track" aria-hidden="true"></div>');

            function chip(org, i) {
                // Each chip is a link (acts like a button). Opens in a new tab.
                const $a = $('<a class="ticker-item" target="_blank" rel="noopener"></a>');
                $a.attr('href', org.url);
                $a.append(`<span class="num">${i+1}</span>`);
                $a.append(`<span class="label">${org.name}</span>`);
                $a.attr('aria-label', `${org.name} (open link)`);
                return $a;
            }

            orgs.forEach((o, i) => $trackA.append(chip(o, i)));
            orgs.forEach((o, i) => $trackB.append(chip(o, i))); // duplicate set

            $move.append($trackA, $trackB);
            $viewport.append($move);

            // Pause on hover (optional—makes clicks easier)
            $viewport.on('mouseenter', () => $('#orgTicker').addClass('ticker-paused'));
            $viewport.on('mouseleave', () => $('#orgTicker').removeClass('ticker-paused'));

            // Start/Pause toggle button
            const $ticker = $('#orgTicker');
            const $status = $('#tickerStatus');
            $('#pauseBtn').on('click', function() {
                $ticker.toggleClass('ticker-paused');
                const paused = $ticker.hasClass('ticker-paused');
                $(this).attr('aria-pressed', paused ? 'true' : 'false');
                $(this).find('.icon-pause').toggleClass('d-none', paused);
                $(this).find('.icon-play').toggleClass('d-none', !paused);
                $status.toggleClass('bg-success', !paused).toggleClass('bg-secondary', paused);
                $ticker.toggleClass('paused', paused);
                $status.find('.status-text').text(paused ? 'Paused' : 'Running');
            });

            // Speed control
            const $speed = $('#speedRange');

            function setSpeed(val) {
                document.getElementById('orgTicker').style.setProperty('--ticker-speed', `${val}s`);
            }
            setSpeed($speed.val());
            $speed.on('input change', function() {
                setSpeed(this.value);
            });

            // If you want clicks to route via JS instead of anchors, uncomment:
            // $viewport.on('click', '.ticker-item', function(e){
            //   e.preventDefault();
            //   window.location.href = $(this).attr('href'); // open same tab
            // });
        });
    </script>
@endsection
<!-- overlay content end -->
