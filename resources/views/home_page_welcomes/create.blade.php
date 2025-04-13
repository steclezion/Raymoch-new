  <!-- Modal -->
  <div class="modal fade" id="welcomeModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <form id="welcomeForm" enctype="multipart/form-data">
            @csrf
          <div class="modal-header">
            <h5 class="modal-title">Add Welcome</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" id="recordId">
            <div class="mb-3">
              <label class="form-label">Title</label>
              <input type="text" class="form-control" id="title" name="title" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" id="description" name="description" rows="4" required></textarea>
              </div>
              
            <div class="mb-3">
                <label class="form-label">First Picture (Image)</label>
                <input type="file" class="form-control" id="first_picture" name="first_picture" accept="image/*">
                <div class="mt-2">
                  <img id="previewFirstPicture" src="" alt="First Picture" style="max-width: 100px; display: none;">
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Second Picture (Image)</label>
                <input type="file" class="form-control" id="second_picture" name="second_picture" accept="image/*">
                <div class="mt-2">
                  <img id="previewSecondPicture" src="" alt="Second Picture" style="max-width: 100px; display: none;">
                </div>
              </div>



            <div class="mb-3">
              <label class="form-label">Status</label>
              <select class="form-control" id="status" name="status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" id="submit" class="btn btn-success">Save</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
