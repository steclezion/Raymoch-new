<section class="pb-50 mb-0"> 
<div id="top"></div>
<div class="container">
<main class="py-3 py-md-4 ">
  <div class="container-fluid px-2 px-sm-3 px-md-4">  <!-- was container-xxl -->
    <div class="row gx-1 gx-lg-2 gy-2 align-items-stretch">
        <!-- Featured (left on desktop, below hero on mobile) --> <!-- Left: Featured -->
       @include('raymoch/pages/section_one/feature')
       <!-- Hero (first on mobile, center on desktop) -->
       {{-- <section class="col-12 col-md-8 order-1 order-lg-2"> --}}
      <!-- Hero (first on mobile, center on desktop) --> <!-- Center: Hero story -->
       @include('raymoch/pages/section_one/middlesearch')
      <!-- Right: Promo column with TWO stacked promos -->
      @include('raymoch/pages/section_one/productsection')
      <!-- Right: Promo card Events -->
      @include('raymoch/pages/section_one/eventsection')
    </div>
  </div>
</main>
 @include('raymoch/pages/section_one/african_investment_show_case')

</div>


