<div class="mb-3">
    <label>Company Title</label>
    <input type="text" name="company_title" class="form-control" value="{{ old('company_title', $companyinfo->company_title ?? '') }}">
</div>

<div class="mb-3">
    <label>Classification</label>
    <select name="classification_id" class="form-control" required>
        <option value="">-- Select Classification --</option>
        @foreach($classifications as $classification)
            <option value="{{ $classification->id }}"
                {{ old('classification_id', $companyinfo->classification_id ?? '') == $classification->id ? 'selected' : '' }}>
                {{ $classification->business_type }}
            </option>
        @endforeach
    </select>
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
    <label>Country</label>
    <select name="country" class="form-control" required>
        <option value="">-- Select Country --</option>
        @foreach($countries as $country)
            <option value="{{ $country->name }}" {{ old('country', $companyinfo->country ?? '') == $country->name ? 'selected' : '' }}>
                {{ $country->name }}
            </option>
        @endforeach
    </select>
    @error('country')
        <small class="text-danger">{{ $message }}</small>
    @enderror
</div>


<div class="mb-3">
    <label>Status</label>
    <select name="status" class="form-control">
        <option value="active" {{ old('status', $companyinfo->status ?? '') === 'active' ? 'selected' : '' }}>Active</option>
        <option value="inactive" {{ old('status', $companyinfo->status ?? '') === 'inactive' ? 'selected' : '' }}>Inactive</option>
    </select>
</div>

<div class="mb-3">
    <label>Website</label>
    <input type="text" name="website" class="form-control" value="{{ old('website', $companyinfo->website ?? '') }}">
</div>

<div class="mb-3">
    <label>Founder Name</label>
    <input type="text" name="founder_name" class="form-control" value="{{ old('founder_name', $companyinfo->founder_name ?? '') }}">
</div>

<div class="mb-3">
    <label>Description</label>
    <textarea name="description" class="form-control">{{ old('description', $companyinfo->description ?? '') }}</textarea>
</div>

<div class="mb-3">
    <label>Location</label>
    <input type="text" name="location" class="form-control" value="{{ old('location', $companyinfo->location ?? '') }}">
</div>

<div class="mb-3">
    <label>Email</label>
    <input type="email" name="email" class="form-control" value="{{ old('email', $companyinfo->email ?? '') }}">
</div>

{{-- <button type="submit" class="btn btn-success">Save</button> --}}
<button type="submit" class="btn btn-success">
    @if(isset($companyinfo))
        <i class="fas fa-edit"></i> Update
    @else
        <i class="fas fa-plus"></i> Create
    @endif
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

