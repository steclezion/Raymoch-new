{{-- 
<section class="p-2 pt-2 mt-0">   
                <div class="container-fluid">
                    <div class="row g-4">
                        @if($Selected_Home_Page_Second_p->title == 'Power Generation')
                        <div class="col-lg-3 col-sm-6 wow fadeInRight" data-wow-delay=".0s">
                            <div class="bg-color text-light rounded-1 overflow-hidden">
                                <div class="hover relative overflow-hidden text-light text-center">
                                    <img src="{{ asset('storage/' . $Selected_Home_Page_Second_p->picture) }}" class="hover-scale-1-1 w-100" alt="">
                                    <div class="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered">
                                        <a class="btn-line"  href="{{ route('search', ['industry' =>  urlencode('Natural Resources-Environmental')]) }}">View Details</a>
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
                           <a class="btn-line"  href="{{ route('search', ['industry' => 'Business & Information']) }}">View Details</a>
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
                <a class="btn-line"  href="{{ route('search', ['industry' => 'ConstructionUtilitiesContracting']) }}">View Details</a>
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
                <a class="btn-line"  href="{{ route('search', ['industry' => 'Food & Hospitality']) }}">View Details</a>
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
            </section> --}}




            <section id="subheader" class="relative">
                <div class="container relative z-index-1000">
                    <div class="row">
                        <div class="col-lg-6">
                            <ul class="crumb">
                                <li><a href="index.html">Home</a></li>
                                <li class="active">Nature's Palette</li>
                            </ul>
                            <h1 class="text-uppercase">Site under construction</h1>
                            <p class="col-lg-10 lead">Transforming our web-site into a Personal Paradise!</p>
                        </div>
                    </div>
                </div>
                <img src="images/logo-wm.webp" class="abs end-0 bottom-0 z-2 w-20" alt="">
            </section>
{{-- 
            <div class="relative wow fadeIn">
                <div class="owl-custom-nav menu-float" data-target="#project-single-carousel">
                    <a class="btn-next"></a>
                    <a class="btn-prev"></a>                                

                    <div id="project-single-carousel" class="owl-2-cols-center owl-carousel owl-theme">
                        <!-- project image begin -->
                        <div class="item">
                            <div class="hover relative rounded-1 overflow-hidden text-light">
                                <img src="images/project-single/1.webp" class="w-100" alt="">
                            </div>
                        </div>
                        <!-- project image end -->
                                                
                        <!-- project image begin -->
                        <div class="item">
                            <div class="hover relative rounded-1 overflow-hidden text-light">
                                <img src="images/project-single/2.webp" class="w-100" alt="">
                            </div>
                        </div>
                        <!-- project image end -->
                        
                        <!-- project image begin -->
                        <div class="item">
                            <div class="hover relative rounded-1 overflow-hidden text-light">
                                <img src="images/project-single/3.webp" class="w-100" alt="">
                            </div>
                        </div>
                        <!-- project image end -->

                        <!-- project image begin -->
                        <div class="item">
                            <div class="hover relative rounded-1 overflow-hidden text-light">
                                <img src="images/project-single/4.webp" class="w-100" alt="">
                            </div>
                        </div>
                        <!-- project image end -->
                    </div>
                </div>
            </div> --}}
            
            {{-- <section>
                <div class="container">
                    <div class="row g-4">
                        <div class="col-lg-8">
                            <div class="me-lg-3">
                                <h5 class="text-uppercase mb-4">About the Project</h5>
                                <p class="text-dark fs-32 lh-1-5 fw-500">Nature's Palette Garden Landscape Service is a comprehensive landscaping project designed to transform outdoor spaces into vibrant, sustainable, and aesthetically pleasing environments.</p>

                                <div class="spacer-double"></div>

                                <h5 class="text-uppercase mb-4">Project Objectives</h5>
                                <div class="row g-4">
                                    <div class="col-lg-6">
                                        <div class="relative h-100 bg-color text-light padding30 rounded-1">
                                            <img src="images/logo-icon.webp" class="w-50px mb-3" alt="">
                                            <div class="abs m-3 top-0 end-0 p-2 rounded-2 mb-3">01</div>
                                            <div>
                                                <h4>Enhance Aesthetic Appeal</h4>
                                                <p class="mb-0">Create visually stunning landscapes that complement the architecture and style of the property.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="relative h-100 bg-color text-light padding30 rounded-1">
                                            <img src="images/logo-icon.webp" class="w-50px mb-3" alt="">
                                            <div class="abs m-3 top-0 end-0 p-2 rounded-2 mb-3">02</div>
                                            <div>
                                                <h4>Promote Sustainability</h4>
                                                <p class="mb-0">Use eco-friendly practices and materials to create landscapes that are sustainable and environmentally responsible.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="relative h-100 bg-color-2 text-light padding30 rounded-1">
                                            <img src="images/logo-icon.webp" class="w-50px mb-3" alt="">
                                            <div class="abs m-3 top-0 end-0 p-2 rounded-2 mb-3">03</div>
                                            <div>
                                                <h4>Maximize Functionality</h4>
                                                <p class="mb-0">Design landscapes that not only look beautiful but also serve practical purposes, such as outdoor living, recreation, or gardening.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="relative h-100 bg-color-2 text-light padding30 rounded-1">
                                            <img src="images/logo-icon.webp" class="w-50px mb-3" alt="">
                                            <div class="abs m-3 top-0 end-0 p-2 rounded-2 mb-3">04</div>
                                            <div>
                                                <h4>Support Local Ecosystems</h4>
                                                <p class="mb-0">Incorporate native plants and wildlife-friendly features to foster biodiversity and support local ecosystems.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="spacer-double"></div>

                                </div>
                            </div>
                        </div>

                        <div class="col-lg-4 text-dark">
                            <h5 class="text-uppercase mb-4">Project Details</h5>
                            <div class="d-flex justify-content-between mb-3">
                                <div class="fw-bold">Client</div>
                                <div class="">Envato Corps</div>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <div class="fw-bold">Location</div>
                                <div class="">Californial</div>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <div class="fw-bold">Type</div>
                                <div class="">Garden Design</div>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <div class="fw-bold">Year</div>
                                <div class="">2024</div>
                            </div>

                            <div class="spacer-double"></div>

                            <h5 class="text-uppercase mb-4">Our Client Says</h5>
                            <div class="item fs-18">
                                <i class="icofont-quote-left id-color-2 fs-32 mb-4"></i>
                                <p>"Our garden was in desperate need of a makeover, and this team exceeded all our expectations. They listened carefully to our ideas and transformed our outdoor space into a peaceful retreat we now enjoy every day."
                                </p>
                                
                                <div class="de-rating-ext mb-3">
                                    <span class="d-stars">
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                    </span>
                                </div>
                                <div class="de-flex align-items-center justify-content-start">
                                    <img class="z-2 w-60px circle" alt="" src="images/testimonial/1.webp">
                                    <div class="d-inline ms-3 fs-15">
                                        <h5 class="fs-15 mb-0">John Smith</h5>
                                        <span>Customer</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </section> --}}














