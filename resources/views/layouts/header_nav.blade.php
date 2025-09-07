<header>
    {{-- <div id="topbar">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="d-flex justify-content-between xs-hide">
                        <div class="d-flex">
                            <div class="topbar-widget mde-3"><a href="#"><i class="icofont-clock-time"></i>Monday - Friday 08.00 - 18.00</a></div>
                            <div class="topbar-widget me-3"><a href="#"><i class="icofont-location-pin"></i>USA CA</a></div>
                            <div class="topbar-widget me-3"><a href="#"><i class="icofont-envelope"></i>samsnow@raymoch.com</a></div>
                        </div>

                        <div class="d-flex">
                            <div class="social-icons">
                                <a href="#"><i class="fa-brands fa-facebook fa-lg"></i></a>
                                <a href="#"><i class="fa-brands fa-x-twitter fa-lg"></i></a>
                                <a href="#"><i class="fa-brands fa-youtube fa-lg"></i></a>
                                <a href="#"><i class="fa-brands fa-pinterest fa-lg"></i></a>
                                <a href="#"><i class="fa-brands fa-instagram fa-lg"></i></a>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div> --}}




    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="de-flex sm-pt10">
                    <div class="de-flex-col">
                        <!-- logo begin -->
                        <div id="logo">
                            <a href="/">
                                <img class="logo-main rounded" src="{{ asset('images/Raymoch_Logo_Design___.png') }}"
                                    alt="">
                                {{-- <h5 class="float-center" style="color:white;width:10;height;10">Raymoch</h5> --}}
                                <img class="logo-mobile" height="100"
                                    src="{{ asset('images/Raymoch_Logo_Design___.png') }}" alt="">
                            </a>
                        </div>
                        <!-- logo end -->
                    </div>

                    <div class="de-flex-col header-col-mid">
                        <!-- mainemenu begin -->
                        <ul id="mainmenu">
                            <br>
                            {{-- <li><a class="menu-item" href="{{ route('/') }}"> Home </a>    --}}

                            {{-- <ul class="mega"> --}}
                            {{-- <li> --}}
                            {{-- <div class="container">
                                            <div class="sb-menu p-4">
                                                <div class="row g-3"> --}}
                            {{-- <div class="col-lg-2 col-md-4 text-center">
                                                        <div class="relative hover text-center overflow-hidden rounded-5px">
                                                            <a href="index.html">
                                                                <img src="images/demo/homepage-1.jpg" class="w-100 relative hover-scale-1-1" alt="">
                                                            </a>
                                                        </div>
                                                        <h5 class="mt-3 mb-1">Homepage 1</h5>
                                                    </div>

                                                    <div class="col-lg-2 col-md-4 text-center">
                                                        <div class="relative hover text-center overflow-hidden rounded-5px">
                                                            <a href="homepage-2.html">
                                                                <img src="images/demo/homepage-2.jpg" class="w-100 relative hover-scale-1-1" alt="">
                                                            </a>
                                                        </div>
                                                        <h5 class="mt-3 mb-1">Homepage 2</h5>
                                                    </div>

                                                    <div class="col-lg-2 col-md-4 text-center">
                                                        <div class="relative hover text-center overflow-hidden rounded-5px">
                                                            <a href="homepage-3.html">
                                                                <img src="images/demo/homepage-3.jpg" class="w-100 relative hover-scale-1-1" alt="">
                                                            </a>
                                                        </div>
                                                        <h5 class="mt-3 mb-1">Homepage 3</h5>
                                                    </div>

                                                    <div class="col-lg-2 col-md-4 text-center">
                                                        <div class="relative hover text-center overflow-hidden rounded-5px">
                                                            <a href="homepage-4.html">
                                                                <img src="images/demo/homepage-4.jpg" class="w-100 relative hover-scale-1-1" alt="">
                                                            </a>
                                                        </div>
                                                        <h5 class="mt-3 mb-1">Homepage 4</h5>
                                                    </div>

                                                    <div class="col-lg-2 col-md-4 text-center">
                                                        <div class="relative hover text-center overflow-hidden rounded-5px">
                                                            <a href="homepage-5.html">
                                                                <img src="images/demo/homepage-5.jpg" class="w-100 relative hover-scale-1-1" alt="">
                                                            </a>
                                                        </div>
                                                        <h5 class="mt-3 mb-1">Homepage 5</h5>
                                                    </div>

                                                    <div class="col-lg-2 col-md-4 text-center">
                                                        <div class="relative hover text-center overflow-hidden rounded-5px">
                                                            <a href="shop-homepage.html">
                                                                <img src="images/demo/shop-1.jpg" class="w-100 relative hover-scale-1-1" alt="">
                                                            </a>
                                                        </div>
                                                        <h5 class="new mt-3 mb-1">Shop</h5>
                                                    </div>
 --}}
                            {{-- </div>
                                            </div>
                                        </div>
                                    </li> --}}
                            {{-- </ul> --}}
                            {{-- </li> --}}

                            </style>
                            <li><a class="menu-item" href="{{ url('/feature-x') }}">Businessess</a>
                                <ul>
                                    <li><a href="{{ url('/feature-x') }}">All Services</a></li>
                                    {{-- <li><a href="service-single.html">Service Single</a></li>
                                    <li><a href="pricing-plans.html">Pricing Plans</a></li>
                                    <li><a href="price-list.html">Price List</a></li> --}}
                                </ul>
                            </li>
                            <li><a class="menu-item" href="{{ url('/feature-x') }}"> Insights </a>
                                <ul>
                                    <li><a href="{{ url('/feature-x') }}">Projects Default</a></li>
                                    {{-- <li><a href="projects-2.html">Projects 3 Columns</a></li>
                                    <li><a href="projects-3.html">Projects Parallax</a></li>
                                    <li><a href="projects-4.html">Projects Carousel</a></li>
                                    <li><a href="project-single.html">Project Single</a></li> --}}
                                </ul>
                            </li>
                            {{-- <li><a class="menu-item" href="#">Networking </a>
                                <ul>
                                    <li><a href="about.html">Events</a></li>
                                    <li><a href="team.html">Our Team</a></li>

                                </ul>
                            </li> --}}
                            <li><a class="menu-item" href="{{ url('/feature-x') }}">Services </a></li>
                            <li><a class="menu-item" href="{{ url('/feature-x') }}">About</a></li>
                            {{-- <li><a class="menu-item" href="{{ url('/feature-x')  }}">Contact</a></li> --}}
                        </ul>
                        <!-- mainmenu end -->
                    </div>

                    <div class="de-flex-col">
                        <div class="menu_side_area">
                            <a href="contact.html" class="btn-main btn-line btn-login btn-default">Login</a>
                            <a href="contact.html" class="btn-main btn-line btn-signup btn-secondary">Signup</a>



                            <!-- Floating Translate Switcher -->
                            <div id="languageSwitcher" class="d-flex align-items-center translate-box"
                                style="margin-left: 10px;
                             position: fixed;
                             bottom: 20px;
                             right: 45px;
                             background-color: white;
                             padding: 10px 15px;
                             border-radius: 4px;
                             box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                             opacity: 0.4;
                             transition: all 0.4s ease;
                             z-index: 99999;
                              pointer-events: auto;">
                                <img src="{{ asset('images/uploadImage/Logo/transalation.png') }}" alt="Translate Icon"
                                    style="height: 30px; width: auto;">
                                <div id="google_translate_element" style="margin-left: 8px;"></div>
                            </div>


                            <!-- Chat toggle button -->
                            <div id="chat-toggle" style="position:fixed; bottom:100px; right:20px; z-index:9999;">
                                <button class="btn btn-warning rounded-circle shadow"
                                    onclick="toggleChat()">ðŸ’¬</button>
                            </div>


                            <!-- Chat box -->
                            <div id="chat-box"
                                style="display:none; position:fixed;  bottom:120px;  right:20px;  width:320px;  background:white; border-radius:12px;  box-shadow:0 4px 12px rgba(0,0,0,0.2); z-index:9999;">

                                <div class="p-3 border-bottom">
                                    <strong>Hey there ðŸ‘‹</strong><br>
                                    Welcome to Raymoch ðŸŽ‰<br>
                                    <small>If you have any questions, just message us here!</small>
                                </div>
                                <div class="p-3" style="max-height:200px; overflow-y:auto;" id="chat-messages">
                                    <!-- Chat messages will go here -->
                                </div>
                                <div class="p-2 border-top d-flex align-items-center">
                                    <input type="text" id="chat-input" class="form-control form-control-sm me-2"
                                        placeholder="Message...">
                                    <button type="submit" class="btn btn-sm btn-primary"
                                        onclick="sendMessage()">Send</button>
                                </div>
                            </div>

                            <span id="menu-btn"></span>
                        </div>

                        <div id="btn-extra">
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>









































<style>
    /* Outline versions with brand tints */
    .btn-login.btn-line {
        border-color: #38bdf8;
        color: #38bdf8;
    }

    .btn-login.btn-line:hover {
        background: #38bdf8;
        color: #08324f;
    }

    .btn-signup.btn-line {
        border-color: #fcd34d;
        color: #fcd34d;
    }

    .btn-signup.btn-line:hover {
        background: #fcd34d;
        color: #08324f;
    }


    /* Hidden by default, positioned OUT of normal flow */
    #mainmenu .mega {
        position: absolute;
        left: 0;
        top: 100%;
        /* directly below the top bar */
        display: none;
        /* shown on hover/focus */
        z-index: 1000;

        /* size + style of the panel */
        width: min(90vw, 960px);
        background: #fff;
        color: #111;
        border-radius: 10px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, .18);
        padding: 18px;
    }

    /* Optional inner layout wrapper */
    #mainmenu .mega .mega-inner {
        display: grid;
        grid-template-columns: repeat(3, minmax(180px, 1fr));
        gap: 16px;
    }

    /* Show on hover or keyboard focus */
    #mainmenu>li.has-mega:hover>.mega,
    #mainmenu>li.has-mega:focus-within>.mega {
        display: block;
    }

    /* Keep mega accessible on narrow screens; don't break header height */
    @media (max-width: 768px) {
        #mainmenu {
            overflow-x: auto;
        }

        /* allow horizontal scroll if needed */
        #mainmenu .mega {
            width: 92vw;
            left: 50%;
            transform: translateX(-50%);
        }
    }


    #languageSwitcher:hover {
        opacity: 1;
        /* backdrop-filter: blur(0); */

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
        /* @media (min-width: 769px) {
        #languageSwitcher:hover {
            opacity: 1 !important;
            backdrop-filter: blur(0);
        }
    } */

    }
</style>



<script>
    function relocateSwitcher() {
        const langBox = document.getElementById('languageSwitcher');
        const topContainer = document.getElementById('top');

        if (window.innerWidth <= 768) {
            // Move to top container (responsive/mobile mode)
            if (!topContainer.contains(langBox)) {
                langBox.style.position = 'static'; // Remove fixed positioning
                langBox.style.bottom = '';
                langBox.style.right = '';
                langBox.style.opacity = '1'; // optional: make it fully visible on mobile
                topContainer.appendChild(langBox);
            }
        } else {
            // Return to fixed position at bottom right
            if (langBox.parentElement !== document.body) {
                langBox.style.position = 'fixed';
                langBox.style.bottom = '20px';
                langBox.style.right = '65px';
                langBox.style.opacity = '0.4'; // restore mobile-specific styles if any
                document.body.appendChild(langBox);
            }
        }
    }

    window.addEventListener('load', relocateSwitcher);
    window.addEventListener('resize', relocateSwitcher);
</script>

<script>
    function toggleChat() {
        const box = document.getElementById('chat-box');
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
    }

    function sendMessage() {
        const input = document.getElementById('chat-input');
        const msg = input.value.trim();
        if (!msg) return;

        // Append to chat
        const container = document.getElementById('chat-messages');
        container.innerHTML += `<div class="mb-2"><strong>You:</strong> ${msg}</div>`;
        input.value = '';
        var sam = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        // alert(sam);

        // Send to backend via fetch or AJAX
        fetch('/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    //'X-CSRF-TOKEN': '{{ csrf_token() }}'
                },
                body: JSON.stringify({
                    message: msg
                })
            })
            .then(res => res.json())
            .then(data => {
                container.innerHTML += `<div class="mb-2"><strong>Bot:</strong> ${data.reply}</div>`;
                container.scrollTop = container.scrollHeight;
            });
    }

    document.addEventListener('click', function(event) {
        const chatBox = document.getElementById('chat-box');
        const chatToggle = document.getElementById('chat-toggle');

        // If click is outside the chat box AND not on the toggle button
        if (chatBox && !chatBox.contains(event.target) && !chatToggle.contains(event.target)) {
            chatBox.style.display = 'none';
        }
    });

    // function sendToBot() {
    //     let message = document.getElementById('chat-input').value;
    //     fetch('/chatbot', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-CSRF-TOKEN': '{{ csrf_token() }}'
    //         },
    //         body: JSON.stringify({ message: message })
    //     })
    //     .then(res => res.json())
    //     .then(data => {
    //         document.getElementById('chat-box').innerHTML += "<div class='bot'>" + data.reply + "</div>";
    //     });
    // }


    // Listen for Enter key in input
    document.getElementById('chat-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // prevent form submit if inside a form
            sendMessage();
        }
    });
</script>




<style>
    body::before {
        content: "";
        position: fixed;
        inset: 0;
        background: url("{{ asset('images/Raymoch_Logo_Design___.png') }}") repeat center / 280px auto;
        opacity: .03;
        pointer-events: none;
    }

    @media print {
        body::before {
            display: none !important;
        }
    }

    /* medium-sized button helper */
    .btn-md {
        --bs-btn-padding-y: .5rem;
        --bs-btn-padding-x: 1rem;
        --bs-btn-font-size: 1rem;
        --bs-btn-border-radius: .5rem;
    }
</style>


<script src="https://accounts.google.com/gsi/client" async defer></script>

<script>
    window.onload = function() {
        @guest
        google.accounts.id.initialize({
            client_id: "{{ env('GOOGLE_CLIENT_ID') }}",
            callback: handleCredentialResponse,
            auto_select: true, // auto-prompt if user previously consented
            cancel_on_tap_outside: false
        });
        google.accounts.id.prompt(); // show One Tap
    @endguest
    };

    function handleCredentialResponse(response) {
        // response.credential is the ID token (JWT)
        fetch("{{ route('onetap.login') }}", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": "{{ csrf_token() }}"
            },
            body: JSON.stringify({
                credential: response.credential
            })
        }).then(r => location.reload());
    }
</script>
