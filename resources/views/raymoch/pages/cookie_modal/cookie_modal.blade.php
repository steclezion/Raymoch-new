<!-- Cookie Preferences Modal -->
<div class="modal fade" id="cookieModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content border-0 shadow">
      <div class="modal-header">
        <h5 class="modal-title">Cookie preferences</h5>
      </div>
      <div class="modal-body">
        <p class="mb-3">We use cookies to improve your experience. Choose your preferences.</p>

        <div class="form-check mb-2">
          <input class="form-check-input" type="checkbox" id="consent-necessary" checked disabled>
          <label class="form-check-label" for="consent-necessary">Necessary (always on)</label>
        </div>

        <div class="form-check mb-2">
          <input class="form-check-input consent-toggle" type="checkbox" id="consent-analytics">
          <label class="form-check-label" for="consent-analytics">Analytics</label>
        </div>

        <div class="form-check">
          <input class="form-check-input consent-toggle" type="checkbox" id="consent-marketing">
          <label class="form-check-label" for="consent-marketing">Marketing</label>
        </div>
      </div>
      <div class="modal-footer justify-content-between">
        <button class="btn btn-outline-secondary" id="btnRejectAll">Reject all</button>
        <div class="d-flex gap-2">
          <button class="btn btn-primary" id="btnSave">Save</button>
          <button class="btn btn-success" id="btnAcceptAll">Accept all</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Optional: a link to reopen the modal -->
<a href="#" id="openCookieSettings" class="small text-decoration-underline">Cookie settings</a>





<script>
$(function () {
  const COOKIE_NAME = 'cookie_consent_v1';
  const COOKIE_DAYS = 180; // 6 months

  // --- Cookie helpers ---
  function setCookie(name, value, days) {
    const maxAge = days * 24 * 60 * 60;
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
  }
  function getCookie(name) {
    return document.cookie.split('; ').find(c => c.startsWith(name + '='))?.split('=')[1];
  }

  // --- Read/Save consent object ---
  function getConsent() {
    const raw = getCookie(COOKIE_NAME);
    if (!raw) return null;
    try { return JSON.parse(decodeURIComponent(raw)); } catch { return null; }
  }
  function saveConsent(consent) {
    setCookie(COOKIE_NAME, JSON.stringify(consent), COOKIE_DAYS);
  }

  // --- UI helpers ---
  const modal = new bootstrap.Modal(document.getElementById('cookieModal'));

  function hydrateUI(consent) {
    $('#consent-analytics').prop('checked', !!consent?.analytics);
    $('#consent-marketing').prop('checked', !!consent?.marketing);
  }

  // Buttons
  $('#btnAcceptAll').on('click', function(){
    saveConsent({ necessary: true, analytics: true, marketing: true, ts: Date.now() });
    modal.hide();
  });
  $('#btnRejectAll').on('click', function(){
    saveConsent({ necessary: true, analytics: false, marketing: false, ts: Date.now() });
    modal.hide();
  });
  $('#btnSave').on('click', function(){
    saveConsent({
      necessary: true,
      analytics: $('#consent-analytics').is(':checked'),
      marketing: $('#consent-marketing').is(':checked'),
      ts: Date.now()
    });
    modal.hide();
  });

  $('#openCookieSettings').on('click', function(e){
    e.preventDefault();
    hydrateUI(getConsent());
    modal.show();
  });

  // --- First page load behavior ---
  const existing = getConsent();
  if (existing) {
    hydrateUI(existing);  // reflect existing choice if user reopens
  } else {
    modal.show();         // show automatically on first visit
  }
});
</script>


<!-- In <head>: mark as plain so it doesn't run yet -->
<script type="text/plain" data-category="analytics" data-src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"></script>
<script type="text/plain" data-category="analytics">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config','G-XXXXXX');

  if ($('#consent-analytics').is(':checked')) activateScriptsFor('analytics');
if($('#consent-marketing').is(':checked')) activateScriptsFor('marketing');

</script>
