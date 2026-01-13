{{-- resources/views/partials/footer.blade.php --}}
{{-- Sourced from your footer.html --}}
<footer class="footer" id="site-footer" style="background:#0b1020;color:#cbd5e1;">
  <div class="wrap" style="max-width:1328px;margin:0 auto;padding:32px 18px;">
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:24px;align-items:start;">
      <div>
      
        <div style="color:#fff;font-weight:800;font-size:1.25rem;margin-bottom:8px;">
            
                 <svg width="28" height="28" viewBox="0 0 200 200" aria-hidden="true">
            <polygon fill="none" stroke="currentColor" stroke-width="10" points="100,18 172,59 172,141 100,182 28,141 28,59"/>
            <text x="100" y="118" text-anchor="middle" style="fill:currentColor;font:700 105px Georgia">R</text>
          </svg>
          
            Raymoch</div>
        <p style="color:#94a3b8;max-width:320px;line-height:1.6;margin:0;">
          Connecting investors and entrepreneurs through trust, verified data, and actionable insights.
        </p>
      </div>
      <div>
        <h5 style="margin:0 0 10px;color:#e5e7eb;font-size:.95rem;">Company</h5>
        <a href="{{ route('about') }}" style="display:block;color:#cbd5e1;margin:6px 0;">About</a>
        <a href="{{ route('careers') }}" style="display:block;color:#cbd5e1;margin:6px 0;">Careers</a>
        <a href="{{ route('press') }}" style="display:block;color:#cbd5e1;margin:6px 0;">Press</a>
        <a href="{{ route('contact') }}" style="display:block;color:#cbd5e1;margin:6px 0;">Contact</a>
      </div>
      <div>
        <h5 style="margin:0 0 10px;color:#e5e7eb;font-size:.95rem;">Product</h5>
        <a href="{{ route('explore2') }}" style="display:block;color:#cbd5e1;margin:6px 0;">Explore Businesses</a>
        <a href="{{ route('insights') }}" style="display:block;color:#cbd5e1;margin:6px 0;">Market Insights</a>
        <a href="{{ route('verification') }}" style="display:block;color:#cbd5e1;margin:6px 0;">Verification</a>
        <a href="{{ route('services') }}" style="display:block;color:#cbd5e1;margin:6px 0;">Programs & Services</a>
      </div>
      <div>
        <h5 style="margin:0 0 10px;color:#e5e7eb;font-size:.95rem;">Resources</h5>
        <a href="{{ route('blog') }}" style="display:block;color:#cbd5e1;margin:6px 0;">Blog</a>
        <a href="{{ route('help') }}" style="display:block;color:#cbd5e1;margin:6px 0;">Help Center</a>
        <a href="{{ route('security') }}" style="display:block;color:#cbd5e1;margin:6px 0;">Security</a>
        <a href="{{ route('status') }}" style="display:block;color:#cbd5e1;margin:6px 0;">Status</a>
      </div>
    </div>

    <div style="border-top:1px solid #1f2937;margin-top:26px;padding-top:14px;
                display:flex;justify-content:space-between;align-items:center;
                font-size:.9rem;flex-wrap:wrap;gap:10px;">
      <div>© <span id="footerYear"></span> Raymoch. All rights reserved.</div>
      <div>
        <a href="{{ route('privacy') }}" style="color:#cbd5e1;margin-left:14px;">Privacy</a>
        <a href="{{ route('terms') }}" style="color:#cbd5e1;margin-left:14px;">Terms</a>
      </div>
    </div>
  </div>
  <script>document.getElementById('footerYear').textContent = new Date().getFullYear();</script>
</footer>
