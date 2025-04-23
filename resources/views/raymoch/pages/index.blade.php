@extends('layouts.app_ray')
@section('content')

@foreach($HomePageActive as $HomePageActive)  @endforeach
@foreach ( $Selected_Home_Page_Second_p as $Selected_Home_Page_Second_p )  @endforeach
@foreach ( $Selected_Home_Page_Second_w as $Selected_Home_Page_Second_w )  @endforeach
@foreach ( $Selected_Home_Page_Second_c as $Selected_Home_Page_Second_c  )  @endforeach
@foreach ( $Selected_Home_Page_Second_h as $Selected_Home_Page_Second_h       )  @endforeach
@foreach ( $Selected_Home_Page_Second_m as $Selected_Home_Page_Second_m        )  @endforeach
@foreach ( $Selected_Home_Page_Second_r as  $Selected_Home_Page_Second_r      )  @endforeach
@foreach ( $Selected_Home_Page_Second_s as  $Selected_Home_Page_Second_s      )  @endforeach
@foreach ( $Selected_Home_Page_Second_e as $Selected_Home_Page_Second_e       )  @endforeach



<link href="{{ asset('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css') }}" rel="stylesheet">
<script src="{{ asset('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js')}}"></script>

    <div class="no-bottom no-top" id="content">



            <section class="pb-50">
                &NonBreakingSpace;
                <div id="top"></div>
                <div class="container">

                    <div class="row g-4 align-items-center">
                        <div class="col-lg-6">
                            <div class="relative">
                                <div class="rounded-1 bg-body w-90 overflow-hidden wow zoomIn">
                                    <img src="{{ asset('storage/' . $HomePageActive->first_picture) }}" class="w-100 jarallax wow scaleIn" alt="">
                                </div>
                                <div class="rounded-1 bg-body w-50 abs mb-min-50 end-0 bottom-0 z-2 overflow-hidden shadow-soft wow zoomIn" data-wow-delay=".2s">
                                    <img src="{{ asset('storage/' . $HomePageActive->second_picture) }}"  class="w-100 wow scaleIn" data-wow-delay=".2s" alt="">
                                </div>
                            </div>
                        </div>
                        <br>
                        <div class="col-lg-6">
                            <div class="ps-lg-3">
                                {{-- <div class="subtitle id-color wow fadeInUp" data-wow-delay=".3s">Welcome to Raymoch-Ventures
                                </div> --}}
                                <br>
                                <h2 class="text-uppercase wow fadeInUp" data-wow-delay=".4s">{{ $HomePageActive->title }}
                                    {{-- <span class="id-color-2">Explore East Africa Potential</span> --}}
                                </h2>
                                <p class="wow fadeInUp" data-wow-delay=".6s">{{ $HomePageActive->description }}</p>
                                <button type="button" class="btn-main wow fadeInUp" data-wow-delay=".6s" data-bs-toggle="modal" data-bs-target="#myModal"> Our Services</button>

                                @include('layouts/modal_our_service')
                            </div>
                        </div>
                    </div>
                </div>
            </section>




            <section class="p-4">
                <div class="container-fluid">
                    <div class="row g-4">
                        @if($Selected_Home_Page_Second_p->title == 'Power Generation')
                        <div class="col-lg-3 col-sm-6 wow fadeInRight" data-wow-delay=".0s">
                            <div class="bg-color text-light rounded-1 overflow-hidden">
                                <div class="hover relative overflow-hidden text-light text-center">
                                    <img src="{{ asset('storage/' . $Selected_Home_Page_Second_p->picture) }}" class="hover-scale-1-1 w-100" alt="">
                                    <div class="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered">
                                        <a class="btn-line"  href="{{route('power-generation')}}">View Details</a>
                                    </div>
                                    <img src="{{asset('images/1-edited-ai-reference.png')}}" class="abs abs-centered w-20" alt="">

                                    <div class="abs z-2 bottom-0 mb-3 w-100 text-center hover-op-0">
                                        <h4 class="mb-3">{{ $Selected_Home_Page_Second_p->title }} </h4>
                                    </div>
                                    <div class="gradient-trans-color-bottom abs w-100 h-40 bottom-0 Z-1"></div>
                                </div>

                                <div class="p-4 py-2">
                                    <p class="mt-3">
                                        <li>
                                        <ul> {{ $Selected_Home_Page_Second_p->description_one }} </ul>
                                        <ul> {{ $Selected_Home_Page_Second_p->description_two }}</ul>
                                        <ul> {{ $Selected_Home_Page_Second_p->description_three }}</p> </ul>
                                        </li>
                                    </p>
                                </div>
                            </div>
                        </div>
           @endif


           @if($Selected_Home_Page_Second_w->title == 'Whole Sale')
           <div class="col-lg-3 col-sm-6 wow fadeInRight" data-wow-delay=".0s">
               <div class="bg-color text-light rounded-1 overflow-hidden">
                   <div class="hover relative overflow-hidden text-light text-center">
                       <img src="{{ asset('storage/' . $Selected_Home_Page_Second_w->picture) }}" class="hover-scale-1-1 w-100" alt="">
                       <div class="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered">
                           <a class="btn-line"  href="{{route('power-generation')}}">View Details</a>
                       </div>
                       <img src="{{asset('images/1-edited-ai-reference.png')}}" class="abs abs-centered w-20" alt="">

                       <div class="abs z-2 bottom-0 mb-3 w-100 text-center hover-op-0">
                           <h4 class="mb-3">{{ $Selected_Home_Page_Second_w->title }} </h4>
                       </div>
                       <div class="gradient-trans-color-bottom abs w-100 h-40 bottom-0 Z-1"></div>
                   </div>

                   <div class="p-4 py-2">
                       <p class="mt-3">
                           <li>
                           <ul> {{ $Selected_Home_Page_Second_w->description_one }} </ul>
                           <ul> {{ $Selected_Home_Page_Second_w->description_two }}</ul>
                           <ul> {{ $Selected_Home_Page_Second_w->description_three }}</p> </ul>
                           </li>
                       </p>
                   </div>
               </div>
           </div>
@endif

@if($Selected_Home_Page_Second_c->title == 'Construction')
<div class="col-lg-3 col-sm-6 wow fadeInRight" data-wow-delay=".0s">
    <div class="bg-color text-light rounded-1 overflow-hidden">
        <div class="hover relative overflow-hidden text-light text-center">
            <img src="{{ asset('storage/' . $Selected_Home_Page_Second_c->picture) }}" class="hover-scale-1-1 w-100" alt="">
            <div class="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered">
                <a class="btn-line"  href="{{route('power-generation')}}">View Details</a>
            </div>
            <img src="{{asset('images/1-edited-ai-reference.png')}}" class="abs abs-centered w-20" alt="">

            <div class="abs z-2 bottom-0 mb-3 w-100 text-center hover-op-0">
                <h4 class="mb-3">{{ $Selected_Home_Page_Second_c->title }} </h4>
            </div>
            <div class="gradient-trans-color-bottom abs w-100 h-40 bottom-0 Z-1"></div>
        </div>

        <div class="p-4 py-2">
            <p class="mt-3">
                <li>
                <ul> {{ $Selected_Home_Page_Second_c->description_one }} </ul>
                <ul> {{ $Selected_Home_Page_Second_c->description_two }}</ul>
                <ul> {{ $Selected_Home_Page_Second_c->description_three }}</p> </ul>
                </li>
            </p>
        </div>
    </div>
</div>
@endif

@if($Selected_Home_Page_Second_h->title == 'Hotel and Dining Services')
<div class="col-lg-3 col-sm-6 wow fadeInRight" data-wow-delay=".0s">
    <div class="bg-color text-light rounded-1 overflow-hidden">
        <div class="hover relative overflow-hidden text-light text-center">
            <img src="{{ asset('storage/' . $Selected_Home_Page_Second_h->picture) }}" class="hover-scale-1-1 w-100" alt="">
            <div class="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered">
                <a class="btn-line"  href="{{route('power-generation')}}">View Details</a>
            </div>
            <img src="{{asset('images/1-edited-ai-reference.png')}}" class="abs abs-centered w-20" alt="">

            <div class="abs z-2 bottom-0 mb-3 w-100 text-center hover-op-0">
                <h4 class="mb-3">{{ $Selected_Home_Page_Second_h->title }} </h4>
            </div>
            <div class="gradient-trans-color-bottom abs w-100 h-40 bottom-0 Z-1"></div>
        </div>

        <div class="p-4 py-2">
            <p class="mt-3">
                <li>
                <ul> {{ $Selected_Home_Page_Second_h->description_one }} </ul>
                <ul> {{ $Selected_Home_Page_Second_h->description_two }}</ul>
                <ul> {{ $Selected_Home_Page_Second_h->description_three }}</p> </ul>
                </li>
            </p>
        </div>
    </div>
</div>
@endif

                    </div>
                </div>
            </section>

            <section class="jarallax text-light relative">
                <img src="{{asset('images/background/3.jpg')}}" class="jarallax-img" alt="">
                <div class="de-overlay"></div>
                {{-- <div class="container relative z-1">
                    <div class="row g-4 gx-5 align-items-center">
                        <div class="col-lg-6">
                            <div class="subtitle wow fadeInUp mb-3">Our Story</div>
                            <h2 class="text-uppercase wow fadeInUp" data-wow-delay=".2s">Crafting Beautiful Gardens <span class="id-color-2">Since '99</span></h2>
                            <p class="wow fadeInUp">Established in 1999, our garden service has been transforming outdoor spaces into thriving, beautiful landscapes for over two decades. With a commitment to quality and personalized care, our experienced team offers a full range of services, from design to maintenance, ensuring your garden flourishes in every season.</p>
                            <a class="btn-main btn-line wow fadeInUp" href="projects.html" data-wow-delay=".6s">Our Projects</a>
                        </div>

                        <div class="col-lg-6">
                            <div class="row g-4">
                                <div class="col-sm-6">
                                    <div class="row g-4">
                                        <div class="col-lg-12">
                                            <div class="text-center p-4 bg-blur rounded-1">
                                                <h4 class="mb-1 fs-24">Excellent</h4>
                                                <div class="de-rating-ext fs-18">
                                                    <div class="d-stars">
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                    </div>
                                                    <div class="fs-15 mb-2">Based on 185 reviews</div>
                                                    <img src="{{asset('images/misc/trustpilot.webp')}}" class="w-120px" alt="">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="rounded-1 relative bg-dark-2 p-4">
                                                <img src="{{asset('images/icons/tree.png')}}" class="abs abs-middle w-60px" alt="">
                                                <div class="de_count ps-80 wow fadeInUp">
                                                    <h2 class="mb-0 fs-32"><span class="timer" data-to="550" data-speed="3000"></span>+</h2>
                                                    <span class="op-7">Construction /span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="row g-4">
                                        <div class="spacer-single sm-hide"></div>
                                        <div class="col-lg-12">
                                            <div class="rounded-1 relative bg-dark-2 p-4">
                                                <img src="{{asset('images/icons/happy.png')}}" class="abs abs-middle w-60px" alt="">
                                                <div class="de_count ps-80 wow fadeInUp">
                                                    <h2 class="mb-0 fs-32"><span class="timer" data-to="850" data-speed="3000"></span>+</h2>
                                                    <span class="op-7">Happy Customers</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="text-center p-4 bg-blur rounded-1">
                                                <h4 class="mb-1 fs-24">4.8 out of 5</h4>
                                                <div class="de-rating-ext fs-18">
                                                    <div class="d-stars">
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                    </div>
                                                    <div class="fs-15 mb-2">Based on 200 reviews</div>
                                                    <img src="{{asset('images/misc/google.webp')}}" class="w-120px" alt="">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div> --}}
            </section>

            {{-- <section class="jarallax">
                <img src="{{asset('images/background/11.webp')}}" class="jarallax-img" alt="">
                <div class="container">
                    <div class="row g-4">
                        <div class="row g-4 mb-3 align-items-center justify-content-center">
                            <div class="col-xl-6 text-center">
                                <div class="subtitle wow fadeInUp">Garden and Landscaping</div>
                                <h2 class="text-uppercase wow fadeInUp" data-wow-delay=".2s">Price <span class="id-color-2">List</span></h2>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center g-lg-4 gx-lg-5 wow fadeInUp">
                        <div class="col-xl-8">
                            <div class="d-flex justify-content-between pb-3 mb-3 border-bottom">
                                <div>
                                    <h5 class="mb-1">Lawn Mowing</h5>
                                    Regular mowing of lawn areas
                                </div>
                                <div class="text-end">
                                    <h5 class="fw-500 mb-1">$30 - $60</h5> per visit
                                </div>
                            </div>

                            <div class="d-flex justify-content-between pb-3 mb-3 border-bottom">
                                <div>
                                    <h5 class="mb-1">Hedge Trimming</h5>
                                    Shaping and trimming of hedges
                                </div>
                                <div class="text-end">
                                    <h5 class="fw-500 mb-1">$50 - $150</h5> per visit
                                </div>
                            </div>

                            <div class="d-flex justify-content-between pb-3 mb-3 border-bottom">
                                <div>
                                    <h5 class="mb-1">Garden Design Consultation</h5>
                                    Initial consultation for garden design
                                </div>
                                <div class="text-end">
                                    <h5 class="fw-500 mb-1">$100 - $200</h5> per hour
                                </div>
                            </div>

                            <div class="d-flex justify-content-between pb-3 mb-3 border-bottom">
                                <div>
                                    <h5 class="mb-1">Planting Services</h5>
                                    Planting flowers, shrubs, or trees
                                </div>
                                <div class="text-end">
                                    <h5 class="fw-500 mb-1">$20 - $50</h5> per plant
                                </div>
                            </div>

                            <div class="d-flex justify-content-between pb-3 mb-3 border-bottom">
                                <div>
                                    <h5 class="mb-1">Mulching</h5>
                                    Spreading mulch over garden beds
                                </div>
                                <div class="text-end">
                                    <h5 class="fw-500 mb-1">$40 - $100</h5> per yard
                                </div>
                            </div>

                            <div class="d-flex justify-content-between pb-3 mb-3 border-bottom">
                                <div>
                                    <h5 class="mb-1">Tree Pruning</h5>
                                    Trimming and shaping of trees
                                </div>
                                <div class="text-end">
                                    <h5 class="fw-500 mb-1">$75 - $300</h5> per tree
                                </div>
                            </div>

                            <div class="d-flex justify-content-between pb-3 mb-3 border-bottom">
                                <div>
                                    <h5 class="mb-1">Sodding</h5>
                                    Laying new sod
                                </div>
                                <div class="text-end">
                                    <h5 class="fw-500 mb-1">$1 - $3</h5> per sq. ft.
                                </div>
                            </div>

                            <div class="d-flex justify-content-between pb-3 mb-3 border-bottom">
                                <div>
                                    <h5 class="mb-1">Landscape Lighting</h5>
                                    Installation of outdoor lighting systems
                                </div>
                                <div class="text-end">
                                    <h5 class="fw-500 mb-1">$300 - $1,500</h5> per system
                                </div>
                            </div>

                            <div class="d-flex justify-content-between pb-3 mb-3 border-bottom">
                                <div>
                                    <h5 class="mb-1">Hardscaping</h5>
                                    Installation of patios, walkways, and retaining walls
                                </div>
                                <div class="text-end">
                                    <h5 class="fw-500 mb-1">$2,000 - $10,000+</h5> per project
                                </div>
                            </div>

                            <div class="d-flex justify-content-between pb-3 mb-3 border-bottom">
                                <div>
                                    <h5 class="mb-1">Pest Control</h5>
                                    Treatment for garden pests
                                </div>
                                <div class="text-end">
                                    <h5 class="fw-500 mb-1">$50 - $150</h5> per treatment
                                </div>
                            </div>

                        </div>

                        <div class="col-lg-12 text-center">
                            <a class="btn-main wow fadeInUp" href="price-list.html">View More</a>
                        </div>

                    </div>
                </div>
            </section> --}}

            {{-- <section class="bg-light">
                <div class="container">
                    <div class="row g-4 mb-3 align-items-center justify-content-center">
                        <div class="col-lg-6 text-center">
                            <div class="subtitle wow fadeInUp">Why Choose Us</div>
                            <h2 class="text-uppercase wow fadeInUp" data-wow-delay=".2s">Our Commitment to <span class="id-color-2">Excellence</span></h2>
                        </div>
                    </div>
                    <div class="row g-4">
                        <div class="col-lg-4 col-md-6 wow fadeInUp">
                            <div class="relative h-100 bg-color text-light padding30 rounded-1">
                                <img src="{{asset('images/logo-icon.webp')}}" class="w-50px mb-3" alt="">
                                <div class="abs m-3 top-0 end-0 p-2 rounded-2 mb-3">01</div>
                                <div>
                                    <h4>Expertise and Experience</h4>
                                    <p class="mb-0">With years of hands-on experience, our team of professional gardeners and landscapers bring a wealth of knowledge to every project.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-4 col-md-6 wow fadeInUp">
                            <div class="relative h-100 bg-color text-light padding30 rounded-1">
                                <img src="{{asset('images/logo-icon.webp')}}" class="w-50px mb-3" alt="">
                                <div class="abs m-3 top-0 end-0 p-2 rounded-2 mb-3">02</div>
                                <div>
                                    <h4>Personalized Service</h4>
                                    <p class="mb-0">We believe that every garden is unique, just like its owner. We take the time to understand your vision, preferences, and the specific needs.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-4 col-md-6 wow fadeInUp">
                            <div class="relative h-100 bg-color text-light padding30 rounded-1">
                                <img src="{{asset('images/logo-icon.webp')}}" class="w-50px mb-3" alt="">
                                <div class="abs m-3 top-0 end-0 p-2 rounded-2 mb-3">03</div>
                                <div>
                                    <h4>Comprehensive Solutions</h4>
                                    <p class="mb-0">From garden design and installation to regular maintenance and specialty services, we offer a full range of garden services.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-4 col-md-6 wow fadeInUp">
                            <div class="relative h-100 bg-color-2 text-light padding30 rounded-1">
                                <img src="{{asset('images/logo-icon.webp')}}" class="w-50px mb-3" alt="">
                                <div class="abs m-3 top-0 end-0 p-2 rounded-2 mb-3">04</div>
                                <div>
                                    <h4>Quality Workmanship</h4>
                                    <p class="mb-0">Our commitment to quality is evident in every service we provide. We use only the best materials, plants, and tools to your garden.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-4 col-md-6 wow fadeInUp">
                            <div class="relative h-100 bg-color-2 text-light padding30 rounded-1">
                                <img src="{{asset('images/logo-icon.webp')}}" class="w-50px mb-3" alt="">
                                <div class="abs m-3 top-0 end-0 p-2 rounded-2 mb-3">05</div>
                                <div>
                                    <h4>Eco-Friendly Practices</h4>
                                    <p class="mb-0">We are dedicated to environmentally sustainable practices. Our organic gardening methods, water-wise landscaping, and  waste management.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-4 col-md-6 wow fadeInUp">
                            <div class="relative h-100 bg-color-2 text-light padding30 rounded-1">
                                <img src="{{asset('images/logo-icon.webp')}}" class="w-50px mb-3" alt="">
                                <div class="abs m-3 top-0 end-0 p-2 rounded-2 mb-3">06</div>
                                <div>
                                    <h4>Satisfaction Guarantee</h4>
                                    <p class="mb-0">Our top priority is your satisfaction. We take pride in our work, and our many happy customers are a testament to the quality and care.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> --}}


            {{-- <section>
                <div class="container">
                    <div class="row g-4 mb-3 align-items-center justify-content-center">
                        <div class="col-xl-6 text-center">
                            <div class="subtitle wow fadeInUp">Garden and Landscaping</div>
                            <h2 class="text-uppercase wow fadeInUp" data-wow-delay=".2s">Pricing <span class="id-color-2">Plan</span></h2>
                        </div>
                    </div>
                    <div class="row g-4">
                        <div class="col-lg-4 col-sm-6 wow fadeInRight" data-wow-delay=".0s" >
                            <div class="relative bg-light p-30 pb-80 rounded-1 h-100">
                                <div class="text-center mb-3">
                                    <img src="{{asset('images/logo-icon-color.webp')}}" class="w-80px mb-3" alt="">
                                    <h4>Standard Plan</h4>
                                    <div class="spacer-30"></div>
                                    <div class=""></div>
                                    <span class="fs-64 fw-500 text-dark">$19</span>
                                    <div class="fw-600">/visit</div>
                                    <div class="spacer-20"></div>
                                </div>

                                <h5 class="mb-2">Services Included</h5>
                                <ul class="ul-style-2">
                                    <li>Mowing and edging</li>
                                    <li>Seasonal pruning of shrubs and trees</li>
                                    <li>Mulching of garden beds</li>
                                    <li>Fertilization (lawn and plants)</li>
                                    <li>Weed control</li>
                                    <li>Irrigation system checks and adjustments</li>
                                </ul>
                                <div class="spacer-20"></div>

                                <div class="abs abs-center w-100 bottom-0 mb-5 px-5">
                                    <a class="btn-main w-100" href="#">Select Plan</a>
                                </div>
                                <div class="spacer-20"></div>
                            </div>
                        </div>

                        <div class="col-lg-4 col-sm-6 wow fadeInRight" data-wow-delay=".3s" >
                            <div class="relative overflow-hidden bg-light p-30 pb-80 rounded-1 h-100 jarallax text-light">
                                <img src="{{asset('images/misc/5.webp')}}" class="jarallax-img" alt="">
                                <div class="de-overlay op-5"></div>
                                <div class="text-center mb-3 relative z-2">
                                    <img src="{{asset('images/logo-icon-color.webp')}}" class="w-80px mb-3" alt="">
                                    <h4>Premium Plan</h4>
                                    <div class="spacer-30"></div>
                                    <div class=""></div>
                                    <span class="fs-64 fw-500">$250</span>
                                    <div class="fw-600">/visit</div>
                                    <div class="spacer-20"></div>
                                </div>

                                <h5 class="mb-2 relative z-2">Services Included</h5>
                                <ul class="ul-style-2">
                                    <li>All services from the Standard Plan</li>
                                    <li>Seasonal flower planting and bed re-design</li>
                                    <li>Plant health care (pest and disease control)</li>
                                    <li>Soil testing and amendments</li>
                                    <li>Aeration and dethatching of lawns</li>
                                    <li>Customized garden care based on client preferences</li>
                                </ul>
                                <div class="spacer-20"></div>

                                <div class="abs abs-center w-100 bottom-0 mb-5 px-5">
                                    <a class="btn-main w-100" href="#">Select Plan</a>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-4 col-sm-6 wow fadeInRight" data-wow-delay=".6s" >
                            <div class="relative bg-light p-30 pb-80 rounded-1 h-100">
                                <div class="text-center mb-3">
                                    <img src="{{asset('images/logo-icon-color.webp')}}" class="w-80px mb-3" alt="">
                                    <h4>Deluxe Plan</h4>
                                    <div class="spacer-30"></div>
                                    <div class=""></div>
                                    <span class="fs-64 fw-500 text-dark">$400</span>
                                    <div class="fw-600">/visit</div>
                                    <div class="spacer-20"></div>
                                </div>

                                <h5 class="mb-2">Services Included</h5>
                                <ul class="ul-style-2">
                                    <li>All services from the Premium Plan</li>
                                    <li>Weekly garden visits for ongoing care</li>
                                    <li>Detailed hand-weeding and deadheading</li>
                                    <li>Organic fertilization and pest control options</li>
                                    <li>Custom seasonal decor (holiday lighting, planters)</li>
                                    <li>Personalized garden consultation each season</li>
                                </ul>
                                <div class="spacer-20"></div>

                                <div class="abs abs-center w-100 bottom-0 mb-5 px-5">
                                    <a class="btn-main w-100" href="#">Select Plan</a>
                                </div>
                                <div class="spacer-20"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </section> --}}
{{--
            <section class="p-4" aria-label="section">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12">
                            <a class="d-block hover popup-youtube" href="https://www.youtube.com/watch?v=C6rf51uHWJg">
                                <div class="relative overflow-hidden rounded-1">
                                    <div class="absolute start-0 w-100 abs-middle fs-36 text-white text-center z-2">
                                        <div class="player wow scaleIn"><span></span></div>
                                    </div>
                                    <div class="absolute w-100 h-100 top-0 bg-dark hover-op-05"></div>
                                    <img src="{{asset('images/background/1.webp')}}" class="w-100 hover-scale-1-1" alt="">
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section> --}}

            <section class="p-4">
                <div class="container-fluid">
                    <div class="row g-4">

@if($Selected_Home_Page_Second_m->title == 'Manufacturing')
<div class="col-lg-3 col-sm-6 wow fadeInRight" data-wow-delay=".0s">
    <div class="bg-color text-light rounded-1 overflow-hidden">
        <div class="hover relative overflow-hidden text-light text-center">
            <img src="{{ asset('storage/' . $Selected_Home_Page_Second_m->picture) }}" class="hover-scale-1-1 w-100" alt="">
            <div class="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered">
                <a class="btn-line"  href="{{route('power-generation')}}">View Details</a>
            </div>
            <img src="{{asset('images/1-edited-ai-reference.png')}}" class="abs abs-centered w-20" alt="">

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
                <ul> {{ $Selected_Home_Page_Second_m->description_three }}</p> </ul>
                </li>
            </p>
        </div>
    </div>
</div>
@endif

@if($Selected_Home_Page_Second_r->title == 'Retail')
<div class="col-lg-3 col-sm-6 wow fadeInRight" data-wow-delay=".0s">
    <div class="bg-color text-light rounded-1 overflow-hidden">
        <div class="hover relative overflow-hidden text-light text-center">
            <img src="{{ asset('storage/' . $Selected_Home_Page_Second_r->picture) }}" class="hover-scale-1-1 w-100" alt="">
            <div class="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered">
                <a class="btn-line"  href="{{route('power-generation')}}">View Details</a>
            </div>
            <img src="{{asset('images/1-edited-ai-reference.png')}}" class="abs abs-centered w-20" alt="">

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
                <ul> {{ $Selected_Home_Page_Second_r->description_three }}</p> </ul>
                </li>
            </p>
        </div>
    </div>
</div>
@endif


@if($Selected_Home_Page_Second_s->title == 'Service')
<div class="col-lg-3 col-sm-6 wow fadeInRight" data-wow-delay=".0s">
    <div class="bg-color text-light rounded-1 overflow-hidden">
        <div class="hover relative overflow-hidden text-light text-center">
            <img src="{{ asset('storage/' . $Selected_Home_Page_Second_s->picture) }}" class="hover-scale-1-1 w-100" alt="">
            <div class="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered">
                <a class="btn-line"  href="{{route('power-generation')}}">View Details</a>
            </div>
            <img src="{{asset('images/1-edited-ai-reference.png')}}" class="abs abs-centered w-20" alt="">

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
                <ul> {{ $Selected_Home_Page_Second_s->description_three }}</p> </ul>
                </li>
            </p>
        </div>
    </div>
</div>
@endif
@if($Selected_Home_Page_Second_e->title == 'E-Commerce')
<div class="col-lg-3 col-sm-6 wow fadeInRight" data-wow-delay=".0s">
    <div class="bg-color text-light rounded-1 overflow-hidden">
        <div class="hover relative overflow-hidden text-light text-center">
            <img src="{{ asset('storage/' . $Selected_Home_Page_Second_e->picture) }}" class="hover-scale-1-1 w-100" alt="">
            <div class="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered">
                <a class="btn-line"  href="{{route('power-generation')}}">View Details</a>
            </div>
            <img src="{{asset('images/1-edited-ai-reference.png')}}" class="abs abs-centered w-20" alt="">

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
                <ul> {{ $Selected_Home_Page_Second_e->description_three }}</p> </ul>
                </li>
            </p>
        </div>
    </div>
</div>
@endif

                    </div>
                </div>
            </section>

            <section class="jarallax">
                <img src="{{asset('images/background/4.webp')}}" class="jarallax-img" alt="">
                <div class="container relative z-2">
                    <div class="row justify-content-center">
                        <div class="col-lg-10 text-center">
                            <div class="owl-single-dots owl-carousel owl-theme">

                                @foreach ( $Selected_Home_Page_Third as $Selected_Home_Page_Third )
                                <div class="item">
                                    {{-- <i class="float fs-40 mb-4 wow fadeInUp id-color-2 center ">Our Mission...</i> --}}

                                    <h3 class="mb-4 wow fadeInUp fs-32">
                                        {{ $Selected_Home_Page_Third->description }}
                                          </h3>

                                    <span class="wow fadeInUp">{{ $Selected_Home_Page_Third ->title }}</span>
                                </div>

                                @endforeach

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {{-- <section class="px-4">
                <div class="container-fluid">
                    <div class="row g-4 align-items-center justify-content-center">
                        <div class="col-lg-8 text-center">
                            <div class="subtitle wow fadeInUp">Our Works</div>
                            <h2 class="text-uppercase mb-4 wow fadeInUp" data-wow-delay=".2s">Latest <span class="id-color-2">Works</span></h2>
                        </div>
                    </div>

                    <div class="row g-4">

                        <div class="col-lg-6">
                            <div class="hover rounded-1 overflow-hidden relative text-light wow fadeInRight" data-wow-delay=".3s">
                                <a href="project-single.html" class="abs w-100 h-100 z-5"></a>
                                <img src="{{asset('images/projects/1.jpg')}}" class="hover-scale-1-1 w-100" alt="">
                                <div class="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered">
                                    <div class="mb-3">A beautiful garden is more than just a space—it's a living, breathing part of your home. But maintaining that beauty takes time and expertise.</div>
                                </div>
                                <div class="abs bg-color z-2 top-0 w-100 h-100 hover-op-1"></div>
                                <div class="abs z-2 bottom-0 w-100 hover-op-0">
                                    <div class="bg-blur d-flex m-4 p-3 px-4 rounded-1 justify-content-between align-items-center">
                                        <div class="d-flex">
                                            <div class="me-5">
                                                Name
                                                <h5>Garden Beauty</h5>
                                            </div>
                                            <div>
                                                Location
                                                <h5>California</h5>
                                            </div>
                                        </div>

                                        <div class="w-40px">
                                            <img src="{{asset('images/misc/right-arrow.webp')}}" class="w-100" alt="">
                                        </div>
                                    </div>
                                </div>
                                <div class="gradient-trans-color-bottom abs w-100 h-40 bottom-0"></div>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="hover rounded-1 overflow-hidden relative text-light wow fadeInRight" data-wow-delay=".6s">
                                <a href="project-single.html" class="abs w-100 h-100 z-5"></a>
                                <img src="{{asset('images/projects/2.jpg')}}" class="hover-scale-1-1 w-100" alt="">
                                <div class="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered">
                                    <div class="mb-3">Create an inviting space for entertaining, or a functional extension of your home, our expert team can craft the outdoor area of your dreams.</div>
                                </div>
                                <div class="abs bg-color z-2 top-0 w-100 h-100 hover-op-1"></div>
                                <div class="abs z-2 bottom-0 w-100 hover-op-0">
                                    <div class="bg-blur d-flex m-4 p-3 px-4 rounded-1 justify-content-between align-items-center">
                                        <div class="d-flex">
                                            <div class="me-5">
                                                Name
                                                <h5>Garden Beauty</h5>
                                            </div>
                                            <div>
                                                Location
                                                <h5>California</h5>
                                            </div>
                                        </div>

                                        <div class="w-40px">
                                            <img src="{{asset('images/misc/right-arrow.webp')}}" class="w-100" alt="">
                                        </div>
                                    </div>
                                </div>
                                <div class="gradient-trans-color-bottom abs w-100 h-40 bottom-0"></div>
                            </div>
                        </div>

                        <div class="col-lg-12 text-center">
                            <a class="btn-main wow fadeInUp" href="projects.html">View All Projects</a>
                        </div>

                    </div>
                </div>
            </section> --}}

        </div>

        <!-- content end -->

        <!-- footer begin -->

        <!-- footer end -->


    @endsection
    <!-- overlay content end -->




