<div class="mb-3">
    <label>Company Title</label>
    <input type="text" name="company_title" class="form-control" value="{{ old('company_title', $companyinfo->company_title ?? '') }}">
</div>

<div class="mb-3">
    <label>Tagline</label>
    <input type="text" name="tagline" class="form-control" value="{{ old('tagline', $companyinfo->tagline ?? '') }}">
</div>

<div class="mb-3">
    <label>First Picture</label>
    <input type="file" name="first_picture" class="form-control" onchange="previewImage(event, 'previewFirst')">
    <img id="previewFirst" src="{{ isset($companyinfo->first_picture) ? asset('storage/' . $companyinfo->first_picture) : '' }}" style="max-height: 150px; margin-top: 10px;">
</div>

<div class="mb-3">
    <label>Second Picture</label>
    <input type="file" name="second_picture" class="form-control" onchange="previewImage(event, 'previewSecond')">
    <img id="previewSecond" src="{{ isset($companyinfo->second_picture) ? asset('storage/' . $companyinfo->second_picture) : '' }}" style="max-height: 150px; margin-top: 10px;">
</div>

<div class="mb-3">
    <label>Third Picture</label>
    <input type="file" name="third_picture" class="form-control" onchange="previewImage(event, 'previewThird')">
    <img id="previewThird" src="{{ isset($companyinfo->third_picture) ? asset('storage/' . $companyinfo->third_picture) : '' }}" style="max-height: 150px; margin-top: 10px;">
</div>

<div class="mb-3">
    <label>Status</label>
    <select name="status" class="form-control">
        <option value="active" {{ old('status', $companyinfo->status ?? '') === 'active' ? 'selected' : '' }}>Active</option>
        <option value="inactive" {{ old('status', $companyinfo->status ?? '') === 'inactive' ? 'selected' : '' }}>Inactive</option>
    </select>
</div>

{{-- <button type="submit" class="btn btn-success">Save</button> --}}
<button type="submit" class="btn btn-success">
    {{ isset($companyinfo) ? 'Update' : 'Create' }}
</button>

<br>

<script>
    function previewImage(event, previewId) {
        const reader = new FileReader();
        reader.onload = function () {
            document.getElementById(previewId).src = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }
</script>

