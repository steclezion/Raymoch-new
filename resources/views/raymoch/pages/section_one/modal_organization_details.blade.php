      <!-- MODAL: Organization details -->
      <div class="modal fade" id="orgModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <div class="d-flex align-items-center gap-2">
                          <div id="modalAvatar"
                              class="rounded-circle d-inline-flex align-items-center justify-content-center"
                              style="width:36px;height:36px;background:#f1f3f5;font-weight:800;"></div>
                          <h5 class="modal-title" id="modalTitle">—</h5>
                      </div>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p id="modalDesc" class="mb-3 text-secondary">—</p>
                      <div class="row g-3">
                          <div class="col-6 col-md-3">
                              <div class="small text-secondary">Sector</div>
                              <div id="modalSector" class="fw-bold">—</div>
                          </div>
                          <div class="col-6 col-md-3">
                              <div class="small text-secondary">Headquarters</div>
                              <div id="modalHQ" class="fw-bold">—</div>
                          </div>
                          <div class="col-6 col-md-3">
                              <div class="small text-secondary">CAPEX</div>
                              <div id="modalCapex" class="fw-bold">—</div>
                          </div>
                          <div class="col-6 col-md-3">
                              <div class="small text-secondary">Projects</div>
                              <div id="modalProjects" class="fw-bold">—</div>
                          </div>
                      </div>
                  </div>
                  <div class="modal-footer">
                      <a id="modalLink" href="#" target="_blank" rel="noopener" class="btn btn-primary">Open page
                          →</a>
                  </div>
              </div>
          </div>
      </div>