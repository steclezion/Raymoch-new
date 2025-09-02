 <aside class="col-12 col-md-2 col-xl-6">
     <div class="container-xxl my-1 bg-light">
        
        <div id="orgTicker" class="ticker-card bg-white shadow-sm p-3">
        <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-3">
        <span class="text-uppercase small fw-bold text-secondary">Organizations</span>
        <span id="tickerStatus" class="badge bg-success">
        <span class="status-dot"></span><span class="status-text">Running</span>
        </span>
        </div>

      <div class="d-flex align-items-center gap-2">
        <button id="pauseBtn" class="btn btn-ghost btn-sm" aria-pressed="false" aria-label="Pause">
          <span class="icon-pause">⏸</span><span class="icon-play d-none">▶</span>
        </button>
        <div class="d-none d-sm-flex align-items-center gap-2">
          <label for="speedRange" class="small text-secondary mb-0">Speed</label>
          <input id="speedRange" type="range" min="12" max="70" value="35" step="1" style="width:120px;">
        </div>
      </div>
    </div>

    <div id="tickerViewport" class="ticker-viewport mt-2 rounded"></div>
  </div>
</div>
<br>
          <div class="ratio ratio-16x9 ratio-hero bg-light">
            <img src="{{ asset('storage/' . $HomePageActive->second_picture) }}" class="w-100 h-100" alt="Shipping containers" 
               style="object-fit:cover;"/>
               @php echo $HomePageActive->second_picture; @endphp
          </div>
          <div class="mt-4">
            <div class="hero-tag">Look Forward Report</div>
            <div class="hero-kicker">Global Realignment</div>
            <h1 class="display-5 hero-title mt-1">Eritrea Inc. heads to Global South in the age of tariffs</h1>
            <p class="text-secondary mb-0">Facing rising US tariffs, Chinese firms are pivoting to the Global South, 
                boosting trade and investment in the region. This shift signals a growing South–South trade dynamic 
                with China at its center.</p>
          </div>
          <hr class="my-4"/>
          <div class="small fw-bold text-uppercase accent">Look Forward Podcast</div>
          <div class="small text-secondary">Episode 5</div>
          <h3 class="h5 fw-bolder mt-1">Frontier Markets Uncovered</h3>

        </aside>
        