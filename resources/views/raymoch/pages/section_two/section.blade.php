
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
            </section>
