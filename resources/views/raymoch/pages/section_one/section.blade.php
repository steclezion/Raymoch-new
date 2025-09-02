<section class="pb-50 mb-0" style="padding-bottom:12px;"> 
<div id="top"></div>
<div class="container">
<div class="row g-4 align-items-center">
                        {{-- <div class="col-lg-6">
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
                                </div> 
                                <br>
                                <h2 class="text-uppercase wow fadeInUp" data-wow-delay=".4s">{{ $HomePageActive->title }}
                                    {{-- <span class="id-color-2">Explore East Africa Potential</span> -
                                </h2>
                                <p class="wow fadeInUp" data-wow-delay=".6s">{{ $HomePageActive->description }}</p>
                                <button type="button" class="btn-main wow fadeInUp" data-wow-delay=".6s" data-bs-toggle="modal" data-bs-target="#myModal"> Our Services</button>

                                @include('layouts/modal_our_service')
                            </div>
                        </div>
                    </div> --}}

                     <!-- Main -->
  <main class="py-4">
       <div class="container-lg" style="padding-bottom:12px;">
       <div class="row gx-4 gy-2 align-items-start">
<!-- Left: Featured -->
@include('raymoch/Pages/section_one/feature')
<!-- Center: Hero story -->
@include('raymoch/Pages/section_one/middlesearch')
<!-- Right: Promo column with TWO stacked promos -->
@include('raymoch/Pages/section_one/productsection')
<!-- Right: Promo card Events -->
@include('raymoch/Pages/section_one/eventsection')
</div>

    </div>
  </main>
   </div>
<img style="opacity:.34; pointer-events:none;" src="{{asset('images/Raymoch_Logo_Design__.png')}}" class="abs bottom-0 op-3" alt="">

</section>