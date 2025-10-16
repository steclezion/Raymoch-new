   <section class="jarallax">
            <img src="{{ asset('images/background/4.webp') }}" class="jarallax-img" alt="">
            <div class="container relative z-2">
                <div class="row justify-content-center">
                    <div class="col-lg-10 text-center">
                        <div class="owl-single-dots owl-carousel owl-theme">

                            @foreach ($Selected_Home_Page_Third as $Selected_Home_Page_Third)
                                <div class="item">
                                    {{-- <i class="float fs-40 mb-4 wow fadeInUp id-color-2 center ">Our Mission...</i> --}}

                                    <h3 class="mb-4 wow fadeInUp fs-32">
                                        {{ $Selected_Home_Page_Third->description }}
                                    </h3>

                                    <span class="wow fadeInUp">{{ $Selected_Home_Page_Third->title }}</span>
                                </div>
                            @endforeach

                        </div>
                    </div>
                </div>
            </div>
        </section>











        