 {{-- <section class="p-4">
            <div class="container-fluid">
                <div class="row g-4">

                    @if ($Selected_Home_Page_Second_m->title == 'Manufacturing')
                        <div class="col-lg-3 col-sm-6 wow fadeInRight" data-wow-delay=".0s">
                            <div class="bg-color text-light rounded-1 overflow-hidden">
                                <div class="hover relative overflow-hidden text-light text-center">
                                    <img src="{{ asset('storage/' . $Selected_Home_Page_Second_m->picture) }}"
                                        class="hover-scale-1-1 w-100" alt="">
                                    <div class="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered">
                                        <a class="btn-line"
                                            href="{{ route('search', ['industry' => 'Real Estate & Housing']) }}">View
                                            Details</a>
                                    </div>
                                    <img src="{{ asset('images/1-edited-ai-reference.png') }}" class="abs abs-centered w-20"
                                        alt="">

                                    <div class="abs z-2 bottom-0 mb-3 w-100 text-center hover-op-0">
                                        <h4 class="mb-3">{{ $Selected_Home_Page_Second_m->title }} </h4>
                                    </div>
                                    <div class="gradient-trans-color-bottom abs w-100 h-40 bottom-0 Z-1"></div>
                                </div>

                                <div class="p-4 py-2">
                                    <p class="mt-3">
                                        <li>
                                            <ul> {{ $Selected_Home_Page_Second_m->description_one }} </ul>
                                            <ul> {{ $Selected_Home_Page_Second_m->description_two }}</ul>
                                            <ul> {{ $Selected_Home_Page_Second_m->description_three }}
                                    </p>
                                    </ul>
                                    </li>
                                    </p>
                                </div>
                            </div>
                        </div>
                    @endif

                    @if ($Selected_Home_Page_Second_r->title == 'Retail')
                        <div class="col-lg-3 col-sm-6 wow fadeInRight" data-wow-delay=".0s">
                            <div class="bg-color text-light rounded-1 overflow-hidden">
                                <div class="hover relative overflow-hidden text-light text-center">
                                    <img src="{{ asset('storage/' . $Selected_Home_Page_Second_r->picture) }}"
                                        class="hover-scale-1-1 w-100" alt="">
                                    <div class="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered">
                                        <a class="btn-line"
                                            href="{{ route('search', ['industry' => 'Business & Information']) }}">View
                                            Details</a>
                                    </div>
                                    <img src="{{ asset('images/1-edited-ai-reference.png') }}" class="abs abs-centered w-20"
                                        alt="">

                                    <div class="abs z-2 bottom-0 mb-3 w-100 text-center hover-op-0">
                                        <h4 class="mb-3">{{ $Selected_Home_Page_Second_r->title }} </h4>
                                    </div>
                                    <div class="gradient-trans-color-bottom abs w-100 h-40 bottom-0 Z-1"></div>
                                </div>

                                <div class="p-4 py-2">
                                    <p class="mt-3">
                                        <li>
                                            <ul> {{ $Selected_Home_Page_Second_r->description_one }} </ul>
                                            <ul> {{ $Selected_Home_Page_Second_r->description_two }}</ul>
                                            <ul> {{ $Selected_Home_Page_Second_r->description_three }}
                                    </p>
                                    </ul>
                                    </li>
                                    </p>
                                </div>
                            </div>
                        </div>
                    @endif


                    @if ($Selected_Home_Page_Second_s->title == 'Service')
                        <div class="col-lg-3 col-sm-6 wow fadeInRight" data-wow-delay=".0s">
                            <div class="bg-color text-light rounded-1 overflow-hidden">
                                <div class="hover relative overflow-hidden text-light text-center">
                                    <img src="{{ asset('storage/' . $Selected_Home_Page_Second_s->picture) }}"
                                        class="hover-scale-1-1 w-100" alt="">
                                    <div class="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered">
                                        <a class="btn-line"
                                            href="{{ route('search', ['industry' => 'Health Services']) }}">View
                                            Details</a>
                                    </div>
                                    <img src="{{ asset('images/1-edited-ai-reference.png') }}"
                                        class="abs abs-centered w-20" alt="">

                                    <div class="abs z-2 bottom-0 mb-3 w-100 text-center hover-op-0">
                                        <h4 class="mb-3">{{ $Selected_Home_Page_Second_s->title }} </h4>
                                    </div>
                                    <div class="gradient-trans-color-bottom abs w-100 h-40 bottom-0 Z-1"></div>
                                </div>

                                <div class="p-4 py-2">
                                    <p class="mt-3">
                                        <li>
                                            <ul> {{ $Selected_Home_Page_Second_s->description_one }} </ul>
                                            <ul> {{ $Selected_Home_Page_Second_s->description_two }}</ul>
                                            <ul> {{ $Selected_Home_Page_Second_s->description_three }}
                                    </p>
                                    </ul>
                                    </li>
                                    </p>
                                </div>
                            </div>
                        </div>
                    @endif
                    @if ($Selected_Home_Page_Second_e->title == 'E-Commerce')
                        <div class="col-lg-3 col-sm-6 wow fadeInRight" data-wow-delay=".0s">
                            <div class="bg-color text-light rounded-1 overflow-hidden">
                                <div class="hover relative overflow-hidden text-light text-center">
                                    <img src="{{ asset('storage/' . $Selected_Home_Page_Second_e->picture) }}"
                                        class="hover-scale-1-1 w-100" alt="">
                                    <div class="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered">
                                        <a class="btn-line"
                                            href="{{ route('search', ['industry' => 'Business & Information']) }}">View
                                            Details</a>
                                    </div>
                                    <img src="{{ asset('images/1-edited-ai-reference.png') }}"
                                        class="abs abs-centered w-20" alt="">

                                    <div class="abs z-2 bottom-0 mb-3 w-100 text-center hover-op-0">
                                        <h4 class="mb-3">{{ $Selected_Home_Page_Second_e->title }} </h4>
                                    </div>
                                    <div class="gradient-trans-color-bottom abs w-100 h-40 bottom-0 Z-1"></div>
                                </div>

                                <div class="p-4 py-2">
                                    <p class="mt-3">
                                        <li>
                                            <ul> {{ $Selected_Home_Page_Second_e->description_one }} </ul>
                                            <ul> {{ $Selected_Home_Page_Second_e->description_two }}</ul>
                                            <ul> {{ $Selected_Home_Page_Second_e->description_three }}
                                    </p>
                                    </ul>
                                    </li>
                                    </p>
                                </div>
                            </div>
                        </div>
                    @endif

                </div>
            </div>
        </section> --}}


        

                    <section id="subheader" class="relative jarallax text-light">
                <img src="images/background/8.webp" class="jarallax-img" alt="">
                <div class="container relative z-index-1000">
                    <div class="row">
                        <div class="col-lg-6">
                            <ul class="crumb">
                                <li><a href="index.html">Home</a></li>
                                <li class="active">Gallery</li>
                            </ul>
                            <h1 class="text-uppercase">Gallery</h1>
                            <p class="col-lg-10 lead">Transform Your Garden into a Personal Paradise!</p>
                        </div>
                    </div>
                </div>
                <img src="images/logo-wm.webp" class="abs end-0 bottom-0 z-2 w-20" alt="">
                <div class="de-gradient-edge-top dark"></div>
                <div class="de-overlay"></div>
            </section>

            <section class="relative">
                <div class="container">
                    <div class="row g-4">
                        <div class="col-lg-4 text-center">
                            <a href="images/gallery/1.webp" class="image-popup d-block hover">
                                <div class="relative overflow-hidden rounded-10">
                                    <div class="absolute start-0 w-100 abs-middle fs-36 text-white text-center z-2">
                                        <h4 class="mb-0 hover-scale-in-3">View</h4>
                                    </div> 
                                    <div class="absolute w-100 h-100 top-0 bg-dark hover-op-05"></div>
                                    <img src="images/gallery/1.webp" class="img-fluid hover-scale-1-2" alt="">
                                </div>
                            </a>
                        </div>

                        <div class="col-lg-4 text-center">
                            <a href="images/gallery/2.webp" class="image-popup d-block hover">
                                <div class="relative overflow-hidden rounded-10">
                                    <div class="absolute start-0 w-100 abs-middle fs-36 text-white text-center z-2">
                                        <h4 class="mb-0 hover-scale-in-3">View</h4>
                                    </div> 
                                    <div class="absolute w-100 h-100 top-0 bg-dark hover-op-05"></div>
                                    <img src="images/gallery/2.webp" class="img-fluid hover-scale-1-2" alt="">
                                </div>
                            </a>
                        </div>

                        <div class="col-lg-4 text-center">
                            <a href="images/gallery/3.webp" class="image-popup d-block hover">
                                <div class="relative overflow-hidden rounded-10">
                                    <div class="absolute start-0 w-100 abs-middle fs-36 text-white text-center z-2">
                                        <h4 class="mb-0 hover-scale-in-3">View</h4>
                                    </div> 
                                    <div class="absolute w-100 h-100 top-0 bg-dark hover-op-05"></div>
                                    <img src="images/gallery/3.webp" class="img-fluid hover-scale-1-2" alt="">
                                </div>
                            </a>
                        </div>

                        <div class="col-lg-4 text-center">
                            <a href="images/gallery/4.webp" class="image-popup d-block hover">
                                <div class="relative overflow-hidden rounded-10">
                                    <div class="absolute start-0 w-100 abs-middle fs-36 text-white text-center z-2">
                                        <h4 class="mb-0 hover-scale-in-3">View</h4>
                                    </div> 
                                    <div class="absolute w-100 h-100 top-0 bg-dark hover-op-05"></div>
                                    <img src="images/gallery/4.webp" class="img-fluid hover-scale-1-2" alt="">
                                </div>
                            </a>
                        </div>

                        <div class="col-lg-4 text-center">
                            <a href="images/gallery/5.webp" class="image-popup d-block hover">
                                <div class="relative overflow-hidden rounded-10">
                                    <div class="absolute start-0 w-100 abs-middle fs-36 text-white text-center z-2">
                                        <h4 class="mb-0 hover-scale-in-3">View</h4>
                                    </div> 
                                    <div class="absolute w-100 h-100 top-0 bg-dark hover-op-05"></div>
                                    <img src="images/gallery/5.webp" class="img-fluid hover-scale-1-2" alt="">
                                </div>
                            </a>
                        </div>

                        <div class="col-lg-4 text-center">
                            <a href="images/gallery/6.webp" class="image-popup d-block hover">
                                <div class="relative overflow-hidden rounded-10">
                                    <div class="absolute start-0 w-100 abs-middle fs-36 text-white text-center z-2">
                                        <h4 class="mb-0 hover-scale-in-3">View</h4>
                                    </div> 
                                    <div class="absolute w-100 h-100 top-0 bg-dark hover-op-05"></div>
                                    <img src="images/gallery/6.webp" class="img-fluid hover-scale-1-2" alt="">
                                </div>
                            </a>
                        </div>

                        <div class="col-lg-4 text-center">
                            <a href="images/gallery/7.webp" class="image-popup d-block hover">
                                <div class="relative overflow-hidden rounded-10">
                                    <div class="absolute start-0 w-100 abs-middle fs-36 text-white text-center z-2">
                                        <h4 class="mb-0 hover-scale-in-3">View</h4>
                                    </div> 
                                    <div class="absolute w-100 h-100 top-0 bg-dark hover-op-05"></div>
                                    <img src="images/gallery/7.webp" class="img-fluid hover-scale-1-2" alt="">
                                </div>
                            </a>
                        </div>

                        <div class="col-lg-4 text-center">
                            <a href="images/gallery/8.webp" class="image-popup d-block hover">
                                <div class="relative overflow-hidden rounded-10">
                                    <div class="absolute start-0 w-100 abs-middle fs-36 text-white text-center z-2">
                                        <h4 class="mb-0 hover-scale-in-3">View</h4>
                                    </div> 
                                    <div class="absolute w-100 h-100 top-0 bg-dark hover-op-05"></div>
                                    <img src="images/gallery/8.webp" class="img-fluid hover-scale-1-2" alt="">
                                </div>
                            </a>
                        </div>

                        <div class="col-lg-4 text-center">
                            <a href="images/gallery/9.webp" class="image-popup d-block hover">
                                <div class="relative overflow-hidden rounded-10">
                                    <div class="absolute start-0 w-100 abs-middle fs-36 text-white text-center z-2">
                                        <h4 class="mb-0 hover-scale-in-3">View</h4>
                                    </div> 
                                    <div class="absolute w-100 h-100 top-0 bg-dark hover-op-05"></div>
                                    <img src="images/gallery/9.webp" class="img-fluid hover-scale-1-2" alt="">
                                </div>
                            </a>
                        </div>

                    </div>
                </div>
            </section>
