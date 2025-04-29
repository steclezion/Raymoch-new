@extends('layouts.app_ray')
@section('content')
    <!-- header end -->
    <!-- content begin -->
    <div class="no-bottom no-top" id="content">

        &NonBreakingSpace;
        <div id="top"></div>

        <section id="subheader" class="relative jarallax text-light">
            <div class="container mt-5">
                <div class="row d-flex justify-content-center">
                    <div class="col-md-10">

                        <form action="{{ route('company.search') }}" method="GET">
                            <div class="card p-3  py-4">
                                <h5 style="color:black">An Easier way to find a Company</h5>
                                <div class="row g-3 mt-2">
                                    <div class="col-md-6">
                                        <input name="company_title" type="text" class="form-control"
                                            placeholder="Enter Business Name">
                                    </div>
                                    <div class="col-md-3">
                                        <button type="submit" class="btn btn-secondary btn-block">Search</button>
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <a data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false"
                                        aria-controls="collapseExample" class="advanced">
                                        Advance Search With Filters <i class="fa fa-angle-down"></i>
                                    </a>
                                    <div class="collapse" id="collapseExample">
                                        <div class="card card-body">
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <input name="website" type="text" placeholder="Website Name"
                                                        class="form-control">
                                                </div>
                                                <div class="col-md-4">
                                                    <input name="tagline" type="text" class="form-control"
                                                        placeholder="Renowned Title">
                                                </div>
                                                <div class="col-md-4">
                                                    <input name="founder_name" type="text" class="form-control"
                                                        placeholder="Search by Co-Founder Name">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>




                    </div>
                </div>
            </div>
        </section>

        <section id="searched_content">
            <div class="container">
                <div class="row g-4 gx-5">
                    <div class="col-lg-3">
                        <div class="me-lg-3">
                            <a href="installation.html"
                                class="bg-color text-light d-block p-3 px-4 rounded-10px mb-3 relative">
                                <h4 class="mb-0">Company Name</h4><i
                                    class="icofont-long-arrow-right absolute abs-middle fs-24 end-20px"></i>
                            </a>
                        </div>
                    </div>

                    <div class="col-lg-9">
                        <div class="row g-4 gx-5">

                            <div class="col-lg-6">
                                <h2><span class="id-color-2"> Tagline or Slogan</span></h2>
                              </div>

                            <div class="col-lg-6">
                                <div class="row g-4">
                                    <div class="col-sm-6">
                                        <div class="row g-4">
                                            <div class="col-lg-12">
                                                <img src="images/misc/3.webp" class="w-100 rounded-1 wow zoomIn"
                                                    alt="">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="row g-4">
                                            <div class="col-lg-12">
                                                <img src="images/misc/1.webp" class="w-100 rounded-1 wow zoomIn"
                                                    alt="">
                                            </div>
                                            <div class="col-lg-12">
                                                <img src="images/misc/2.webp" class="w-100 rounded-1 wow zoomIn"
                                                    alt="">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="spacer-double"></div>

                        <div class="row g-4">
                            <div class="col-lg-12">
                                <h2 class="mb-0"> <span class="id-color-2">Infos...</span></h2>
                            </div>
                            <div class="col-lg-4 col-md-6 wow fadeInRight" data-wow-delay=".0s">
                                <div class="relative h-100 bg-color text-light padding30 rounded-1">
                                    <div>
                                        <h4>About Us</h4>
                                        <p class="mb-0">With years of hands-on experience, our team of professional
                                            gardeners and landscapers bring a wealth of knowledge to every project.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-4 col-md-6 wow fadeInRight" data-wow-delay=".3s">
                                <div class="relative h-100 bg-color text-light padding30 rounded-1">
                                    <div>
                                        <h4>Products or Services</h4>
                                        <p class="mb-0">We believe that every garden is unique, just like its owner. We
                                            take the time to understand your vision, preferences, and the specific needs.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-4 col-md-6 wow fadeInRight" data-wow-delay=".6s">
                                <div class="relative h-100 bg-color text-light padding30 rounded-1">
                                    <div>
                                        <h4>Mission</h4>
                                        <p class="mb-0">From garden design and installation to regular maintenance and
                                            specialty services, we offer a full range of garden services.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-4 col-md-6 wow fadeInRight" data-wow-delay=".0s">
                                <div class="relative h-100 bg-color-2 text-light padding30 rounded-1">
                                    <div>
                                        <h4>Vision</h4>
                                        <p class="mb-0">Our commitment to quality is evident in every service we provide.
                                            We use only the best materials, plants, and tools to your garden.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-4 col-md-6 wow fadeInRight" data-wow-delay=".3s">
                                <div class="relative h-100 bg-color-2 text-light padding30 rounded-1">
                                    <div>
                                        <h4>Unique Selling Proposition</h4>
                                        <p class="mb-0">We are dedicated to environmentally sustainable practices. Our
                                            organic gardening methods, water-wise landscaping, and waste management.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-4 col-md-6 wow fadeInRight" data-wow-delay=".6s">
                                <div class="relative h-100 bg-color-2 text-light padding30 rounded-1">
                                    <div>
                                        <h4>Satisfaction Guarantee</h4>
                                        <p class="mb-0">Our top priority is your satisfaction. We take pride in our work,
                                            and our many happy customers are a testament to the quality and care.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="spacer-double"></div>

                        <div class="row g-4">
                        <div class="col-lg-12 text-center">
                        <a class="btn-main wow fadeInUp" href="projects.html">Next <i  class="fa fa-arrow-alt-circle-right"> </i> </a>
                         </div>
                         </div>

                    </div>
                </div>
            </div>
        </section>

        <div class="row g-4">
            @foreach($companyinfos as $company)
                <div class="col-md-4">
                    <div class="card p-3 shadow-sm">
                        <h5>{{ $company->company_title }}</h5>
                        <p>{{ Str::limit($company->description, 100) }}</p>

                        <small class="text-muted">Location: {{ $company->location ?? 'N/A' }}</small>
                        <br>
                        <a href="#" class="btn btn-sm btn-primary mt-2">View Details</a>
                    </div>
                </div>
            @endforeach
        </div>

        <div class="mt-4">
            {{ $companyinfos->links('pagination::bootstrap-5') }}
        </div>

    </div>
    <!-- content end -->
    <script src="{{ asset('https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-alpha1/dist/css/bootstrap.min.css') }}"></script>
    <script src="{{ asset('https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-alpha1/dist/js/bootstrap.bundle.min.js') }}">
    </script>
    <script src="{{ asset('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js') }}"></script>
    <script src="{{ asset('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css') }}">
    </script>
    <style>
        body {

            background-color: #8f0200;
        }


        .advanced {

            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
        }


        .btn-secondary,
        .btn-secondary:focus,
        .btn-secondary:active {
            color: #fff;
            background-color: #800020;
            !important;
            border-color: #800020;
            !important;
            box-shadow: none;
        }


        .advanced {

            color: #00838f !important;
        }

        .form-control:focus {
            box-shadow: none;
            border: 1px solid #00838f;


        }
    </style>
@endsection
<!-- overlay content end -->
