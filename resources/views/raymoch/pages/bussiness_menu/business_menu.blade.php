@extends('layouts.app_ray')
@section('content')

@section('title', 'Home | ' . config('app.name'))
@section('meta_description', 'Welcome to ' . config('app.name') . '.')
@csrf
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
<!-- DataTables + Bootstrap 5 -->
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.8/css/dataTables.bootstrap5.min.css">
<script src="https://cdn.datatables.net/1.13.8/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.8/js/dataTables.bootstrap5.min.js"></script>


    <script>
    // Add a second header row for per-column filters
const $tbl = $('#bizTable');
$tbl.find('thead tr').clone(true).addClass('filters').appendTo($tbl.find('thead'));

const dt = $tbl.DataTable({
  orderCellsTop: true,
  // nice Bootstrap layout: length + global search on top, info + paging bottom
  dom: '<"row g-2 mb-2"<"col-sm-6"l><"col-sm-6"f>>t<"row g-2 mt-2"<"col-sm-6"i><"col-sm-6"p>>',
  pageLength: 10,
  lengthMenu: [10, 25, 50, 100],
  deferRender: true
});

// Build inputs in the cloned header & wire to column search
dt.columns().eq(0).each(function (colIdx) {
  const cell = $('.filters th').eq(colIdx);
  const title = $tbl.find('thead tr:eq(0) th').eq(colIdx).text().trim();
  $(cell).html('<input type="text" class="form-control form-control-sm" placeholder="Search '+ title +'">');

  $('input', cell).on('keyup change', function () {
    if (dt.column(colIdx).search() !== this.value) {
      dt.column(colIdx).search(this.value).draw();
    }
  });
});
></script>

    &NonBreakingSpace;
    <div id="top"></div>

    <!--  Front section that includes all feature, middle search marquee, events and product views  -->
    <div class="text-center">
        <h1 class="jumbotron-heading">Explore Businesses</h1>
        <p class="text-primary mb-0">Discover verified opportunities across industries.</p>
    </div>
    &nbsp;
    <br>
    <section class="absolute-center pt-0 pb-0">
        <div class="container">
            <div class="row g-4">
                <!-- Search row -->
                <form class="row g-2 g-md-3 align-items-center justify-content-center pb-2" action="{{ route('search.businesses') }}" role="search" id ="searchForm"  aria-label="Business search">
                     
                    @csrf

                    <div class="col-12 col-md-6">
                        <input type="search" name="q" class="form-control form-control-lg" placeholder="Search businesses"
                            aria-label="Search businesses">
                    </div>
                    <div class="col-8 col-md-3 col-lg-3">
                        <input class="form-control form-control-lg" list="countries" name="country" placeholder="Country"
                            aria-label="Country">
                        <datalist id="countries">
                            <option value="Eritrea">
                            <option value="Ethiopia">
                            <option value="Kenya">
                            <option value="Uganda">
                            <option value="Tanzania">
                            <option value="Rwanda">
                        </datalist>
                    </div>
                    {{-- <div class="col-4 col-md-3 col-lg-2 d-grid">
                         <button  id="searchbutton" class="btn btn-primary" type="submit">Search</button>
                    </div> --}}

                    <div class="col-4 col-md-3 col-lg-2 d-grid">
  <button id="searchbutton"  type="submit"
          class="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2"
          aria-busy="false">
    <!-- spinner kept in flow; hidden by visibility so the button width never changes -->
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="visibility:hidden"></span>
    <span class="btn-text">Search</span>
  </button>
</div>
                </form>
 <!-- Results -->
  <div id="results" class="mt-3"></div>
                <!-- thin rule like the mock -->
                <hr class="mt-2 mb-3 border-1 border-secondary-subtle">
                </header>

                <!-- Cards -->
                <main class="container">
                    <div id="cardsRow" class="row g-3 g-md-3">

                        <!-- divider that should always appear after the first visual row -->
                        <hr id="gridDivider" class="my-2 border-1 border-secondary-subtle d-none">

                        <!-- 1 -->
                        <div class="card-col col-12 col-sm-6 col-lg-3">
                            <a href="#" class="text-decoration-none text-reset">
                                <div class="card card-hover h-100 border border-secondary-subtle">
                                    <div class="card-body d-flex gap-2">
                                        <span class="icon-box bg-primary-subtle text-primary"><i
                                                class="bi bi-leaf"></i></span>
                                        <div>
                                            <h3 class="h6 fw-bold mb-1">Agriculture &amp; Food</h3>
                                            <p class="text-secondary mb-0 small">Farming, processing, and agri-tech
                                                solutions.</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <!-- 2 -->
                        <div class="card-col col-12 col-sm-6 col-lg-3">
                            <a href="#" class="text-decoration-none text-reset">
                                <div class="card card-hover h-100 border border-secondary-subtle">
                                    <div class="card-body d-flex gap-2">
                                        <span class="icon-box bg-primary-subtle text-primary"><i
                                                class="bi bi-cash-coin"></i></span>
                                        <div>
                                            <h3 class="h6 fw-bold mb-1">Fintech &amp; Banking</h3>
                                            <p class="text-secondary mb-0 small">Payments, remittances, lending
                                                platforms.</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <!-- 3 -->
                        <div class="card-col col-12 col-sm-6 col-lg-3">
                            <a href="#" class="text-decoration-none text-reset">
                                <div class="card card-hover h-100 border border-secondary-subtle">
                                    <div class="card-body d-flex gap-2">
                                        <span class="icon-box bg-primary-subtle text-primary"><i
                                                class="bi bi-lightning-charge"></i></span>
                                        <div>
                                            <h3 class="h6 fw-bold mb-1">Energy &amp; Renewables</h3>
                                            <p class="text-secondary mb-0 small">Solar, wind, and off-grid IoT
                                                solutions.</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <!-- 4 -->
                        <div class="card-col col-12 col-sm-6 col-lg-3">
                            <a href="#" class="text-decoration-none text-reset">
                                <div class="card card-hover h-100 border border-secondary-subtle">
                                    <div class="card-body d-flex gap-2">
                                        <span class="icon-box bg-primary-subtle text-primary"><i
                                                class="bi bi-hospital"></i></span>
                                        <div>
                                            <h3 class="h6 fw-bold mb-1">Healthcare &amp; Biotech</h3>
                                            <p class="text-secondary mb-0 small">Clinics, telemedicine, pharmaceuticals.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <!-- 5 -->
                        <div class="card-col col-12 col-sm-6 col-lg-3">
                            <a href="#" class="text-decoration-none text-reset">
                                <div class="card card-hover h-100 border border-secondary-subtle">
                                    <div class="card-body d-flex gap-2">
                                        <span class="icon-box bg-primary-subtle text-primary"><i
                                                class="bi bi-broadcast"></i></span>
                                        <div>
                                            <h3 class="h6 fw-bold mb-1">ICT &amp; Telecoms</h3>
                                            <p class="text-secondary mb-0 small">Connectivity, software, digital
                                                services.</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <!-- 6 -->
                        <div class="card-col col-12 col-sm-6 col-lg-3">
                            <a href="#" class="text-decoration-none text-reset">
                                <div class="card card-hover h-100 border border-secondary-subtle">
                                    <div class="card-body d-flex gap-2">
                                        <span class="icon-box bg-primary-subtle text-primary"><i
                                                class="bi bi-bag"></i></span>
                                        <div>
                                            <h3 class="h6 fw-bold mb-1">Wholesale &amp; Retail</h3>
                                            <p class="text-secondary mb-0 small">Consumer goods, distribution,
                                                e-commerce.</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <!-- 7 -->
                        <div class="card-col col-12 col-sm-6 col-lg-3">
                            <a href="#" class="text-decoration-none text-reset">
                                <div class="card card-hover h-100 border border-secondary-subtle">
                                    <div class="card-body d-flex gap-2">
                                        <span class="icon-box bg-primary-subtle text-primary"><i
                                                class="bi bi-mortarboard"></i></span>
                                        <div>
                                            <h3 class="h6 fw-bold mb-1">Education &amp; Training</h3>
                                            <p class="text-secondary mb-0 small">Schools, ed-tech, vocational services.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <!-- 8 -->
                        <div class="card-col col-12 col-sm-6 col-lg-3">
                            <a href="#" class="text-decoration-none text-reset">
                                <div class="card card-hover h-100 border border-secondary-subtle">
                                    <div class="card-body d-flex gap-2">
                                        <span class="icon-box bg-primary-subtle text-primary"><i
                                                class="bi bi-buildings"></i></span>
                                        <div>
                                            <h3 class="h6 fw-bold mb-1">Manufacturing &amp; Industry</h3>
                                            <p class="text-secondary mb-0 small">Factories, production, and travel
                                                services.</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>

                    </div>
                </main>
            </div>
        </div>
        <div class="modal fade" id="detailModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 id="detailModalLabel" class="modal-title">—</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <dl class="row mb-0">
          <dt class="col-5 text-secondary">Country</dt><dd class="col-7" id="dmCountry">—</dd>
          <dt class="col-5 text-secondary">Sector</dt> <dd class="col-7" id="dmSector">—</dd>
          <dt class="col-5 text-secondary">CAPEX</dt>  <dd class="col-7" id="dmCapex">—</dd>
        </dl>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>



<!-- Full-screen spinner overlay -->
<div id="screenSpinner" class="position-fixed top-0 start-0 w-100 h-100 d-none"
     style="background:rgba(255,255,255,.65);backdrop-filter:saturate(160%) blur(2px);z-index:2000;">
  <div class="position-absolute top-50 start-50 translate-middle text-center">
    <div class="spinner-border" role="status" aria-label="Loading"></div>
    <div class="mt-2 small text-muted">Loading…</div>
  </div>
</div>

<!-- Read details modal -->
<div class="modal fade" id="readModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 id="readModalLabel" class="modal-title">—</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <dl class="row mb-0">
          <dt class="col-5 text-secondary">Country</dt><dd class="col-7" id="rmCountry">—</dd>
          <dt class="col-5 text-secondary">Sector</dt> <dd class="col-7" id="rmSector">—</dd>
          <dt class="col-5 text-secondary">CAPEX</dt>  <dd class="col-7" id="rmCapex">—</dd>
        </dl>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
        <!-- (Optional) Link or CTA -->
      </div>
    </div>
  </div>
</div>

<style>
  /* Make rows feel tappable; optional */
  #bizTable tbody tr { cursor: pointer; }
</style>





    </section>
    <br> <br><br>





    {{-- @include('raymoch/pages/section_four/section')
        @include('raymoch/pages/section_five/section')
        @include('raymoch/pages/section_six/section') --}}
</div>


{{-- <script>
        // Keep the divider <hr> between the first and second *visual* rows, regardless of columns
        function placeDivider() {
            const $row = $('#cardsRow');
            const $cols = $row.find('.card-col');
            const $hr = $('#gridDivider');

            if ($cols.length === 0) {
                $hr.addClass('d-none');
                return;
            }

            const firstTop = $cols.first().position().top;
            let lastIdxFirstRow = 0;
            let hasSecondRow = false;

            $cols.each(function(i) {
                const top = $(this).position().top;
                if (top === firstTop) lastIdxFirstRow = i;
                if (top > firstTop) hasSecondRow = true;
            });

            if (!hasSecondRow) {
                $hr.addClass('d-none'); // hide when everything fits on one row
                return;
            }

            $hr.removeClass('d-none');
            // move hr after the last item in the first visual row
            $hr.insertAfter($cols.eq(lastIdxFirstRow));
        }

        $(window).on('load resize', function() {
            // debounce a bit for smoother behavior
            clearTimeout(window._dividerTimer);
            window._dividerTimer = setTimeout(placeDivider, 80);
        });
    </script> --}}




{{-- <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script> --}}
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

    /* Control the effect of enlarging a button of a search box when clicked */

// document.getElementById('searchbutton').addEventListener('click', function () {
//   const button = this;

//   // Add animation class
//   button.classList.add('clicked');

//   // Wait for animation to finish before executing action
//   setTimeout(() => {
//     button.classList.remove('clicked'); // Optional: reset animation
//     executeAction(); // Your custom function
//   }, 30); // Match the CSS transition duration
// });

function executeAction() {
 //alert('Action executed!');
  // You can replace this with any logic: form submission, API call, etc.
}
</script>
<style>
  /* kill animation/zoom */
  #searchbutton { transition: none !important; }


  /* remove the glow + any scale on click/focus */
  #searchbutton:focus,
  #searchbutton:focus-visible,
  #searchbutton:active,
  #searchbutton:active:focus {
    box-shadow: none !important;
    outline: none !important;
    transform: none !important;
  }


  #Read_B { transition: none !important;}

  /* if you happen to use MDB ripple anywhere */
  #searchbutton .ripple-wave { display: none !important; }

    /* remove the glow + any scale on click/focus */
  #Read_B:focus,
  #Read_B:focus-visible,
  #Read_B:active,
  #Read_B:active:focus {
    box-shadow: none !important;
    outline: none !important;
    transform: none !important;
  }

/* if you happen to use MDB ripple anywhere */
  #Read_B .ripple-wave { display: none !important; }



  /* Kill transitions/scaling/shadows on ALL buttons */
button, .btn { transition: none !important; }

/* Remove click/press/focus effects */
button:focus,
button:focus-visible,
button:active,
.btn:focus,
.btn:focus-visible,
.btn:active {
  box-shadow: none !important;
  outline: none !important;
  transform: none !important;
}

/* If any framework adds active scaling */
button:active, .btn:active { transform: none !important; }

/* Hide MDB ripple if present */
button .ripple-wave,
.btn .ripple-wave { display: none !important; }

/* Optional: iOS tap highlight */
button, .btn { -webkit-tap-highlight-color: transparent; }


</style>


<!-- Bootstrap 5 (doesn't need jQuery, but we include jQuery for our divider script) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

{{-- <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script> --}}
{{-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script> --}}



<style>
    /* minimal polish; keeps Bootstrap feel */
    body {
        background: #f8fafc;
    }


    .icon-box {
        width: 40px;
        height: 40px;
        border-radius: .75rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    #searchBtn:focus:not(:focus-visible),
    #searchBtn:active {
        box-shadow: none !important;
        transform: none !important;
    }

    .card-hover {
        transition: box-shadow .15s ease, transform .04s ease, border-color .15s ease;
    }

    @media (hover:hover) {
        .card-hover:hover {
            box-shadow: var(--bs-box-shadow-lg);
            transform: translateY(-1px);
            border-color: var(--bs-primary-border-subtle);
        }
    }

    /* add near the end of your <style> */


    /* example: ensure any loader is below content */
    #de-loader {
        z-index: -1;
    }

    header,
    .text-center {
        position: relative;
        z-index: 2;
    }
</style>



<script>
  // Send CSRF token with all AJAX requests

  $.ajaxSetup({
    headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }
  });
    console.log('meta:', document.querySelector('meta[name="csrf-token"]')?.content);

  function setThinking(btn, on) {
    const $btn = $(btn);
    $btn.attr('aria-busy', on ? 'true' : 'false')
        .prop('disabled', on);
    $btn.find('.spinner-border').css('visibility', on ? 'visible' : 'hidden');
    $btn.find('.btn-text').text(on ? 'Searching…' : 'Search');
  }

  
 function toggleScreenSpinner(on){
    $('#screenSpinner')[on ? 'removeClass' : 'addClass']('d-none');
  }

  $('#searchForm').on('submit', function (e) {
    e.preventDefault();

    const $btn = $('#searchbutton');
    const $results = $('#results');

    setThinking($btn, true);
    $results.empty();

    $.ajax({
      url: "{{ route('search.businesses') }}",
      method: "POST",
      data: $(this).serialize(),    // includes hidden _token
      dataType: "json",
      timeout: 20000
    })
    .done(function (res) {
      if (res && Array.isArray(res.data) && res.data.length) {

        // Escape helper to safely place values inside attributes/HTML
        const esc = s => String(s ?? '').replace(/[&<>"']/g, m =>
          ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])
        );

        const rows = res.data.map((item, i) => `
          <tr>
            <td class="fw-semibold">${esc(item.name) || '-'}</td>
            <td>${esc(item.country) || '-'}</td>
            <td>${esc(item.sector) || '-'}</td>
            <td class="text-end">${esc(item.capex_formatted) || '-'}</td>
            <td class="text-end" style="min-width:120px;">
              <button type="button"
                class="btn btn-sm btn-primary btn-read"
                data-name="${esc(item.name)}"
                data-country="${esc(item.country)}"
                data-sector="${esc(item.sector)}"
                data-capex="${esc(item.capex_formatted) || '-'}">
                <span id="Read_B" class="me-1 bi bi-book"> </span> Read
              </button>
            </td>
          </tr>
        `).join('');

        const table = `
          <div class="card border-0 shadow-sm">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table id="bizTable" class="table table-hover table-sm mb-0 align-middle">
                  <thead>
                    <tr>
                      <th style="min-width:180px;">Company</th>
                      <th>Country</th>
                      <th>Sector</th>
                      <th class="text-end" style="min-width:120px;">CAPEX (USD)</th>
                      <th class="text-end" style="min-width:120px;">Action</th>
                    </tr>
                  </thead>
                  <tbody>${rows}</tbody>
                </table>
              </div>
            </div>
          </div>`;
        $results.html(table);

      } else {
        $results.html(`
          <div class="alert alert-warning mb-0">
            No results found for <strong>${$('#searchForm')[0].q.value || '—'}</strong>
            ${$('#searchForm')[0].country.value ? ' in <strong>' + $('#searchForm')[0].country.value + '</strong>.' : '.'}
          </div>
        `);
      }
    })
    .fail(function (xhr, status) {
      const msg = status === 'timeout'
        ? 'Request timed out. Please try again.'
        : (xhr.responseJSON?.message || 'Something went wrong.');
      $results.html(`<div class="alert alert-danger mb-0">${msg}</div>`);
    })
    .always(function () {
      setThinking($btn, false);
    });
  });

// Delegate: READ button -> turn green + inline spinner, show overlay, then open modal
$('#results').on('click', '.btn-read', function () {
  const $b = $(this);

  // row data
  const name    = $b.data('name')    || '—';
  const country = $b.data('country') || '—';
  const sector  = $b.data('sector')  || '—';
  const capex   = $b.data('capex')   || '—';

  // remember original state
  $b.data('orig-html', $b.html());
  $b.data('orig-class', $b.attr('class'));

  // make the button "thinking": green + spinner + disabled
  $b.prop('disabled', true)
    .removeClass('btn-primary').addClass('btn-success')
    .html('<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span><span>Reading…</span>');

  // full-screen overlay spinner
  toggleScreenSpinner(true);

  // simulate async (replace with your real fetch)
  setTimeout(function () {
    // populate modal
    $('#readModalLabel').text(name);
    $('#rmCountry').text(country);
    $('#rmSector').text(sector);
    $('#rmCapex').text(capex);

    const modalEl = document.getElementById('readModal');
    const modal   = new bootstrap.Modal(modalEl);

    // how long to keep the button green AFTER the modal is shown
    const stickyMS = Number($b.data('sticky-ms')) || 600;

    $(modalEl).one('shown.bs.modal', function () {
      toggleScreenSpinner(false);

      // prevent multiple timers on repeated clicks
      clearTimeout($b.data('revertTimer'));

      const t = setTimeout(function () {
        // restore button to original look
        $b.prop('disabled', false)
          .attr('class', $b.data('orig-class'))
          .html($b.data('orig-html'));
      }, stickyMS);

      $b.data('revertTimer', t);
    });

    modal.show();
  }, 300);
});

</script>





<style>
  #bizTable thead tr.filters th { padding: .35rem .5rem; }
  #bizTable thead tr.filters input { width: 100%; }
</style>





@endsection
<!-- overlay content end -->
