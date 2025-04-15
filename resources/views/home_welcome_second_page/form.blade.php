
<div class="mb-3">
    <label>Title</label>
    <input type="text" readonly name="title" class="form-control" value="{{ old('title', $homeWelcomeSecondPage->title ?? '') }}">
</div>
<div class="mb-3">
    <label>Picture</label>
    <input type="file" name="picture" class="form-control" id="pictureInput"  accept=".jpeg,.jpg,.png,image/jpeg,image/jpg,image/png">

    {{-- Preview for existing picture --}}
    @if(!empty($homeWelcomeSecondPage->picture))
        <p class="mt-2">Current Picture:</p>
        <img src="{{ asset('storage/' . $homeWelcomeSecondPage->picture) }}" width="80">
    @endif

    {{-- Preview for newly selected file --}}
    <div class="mt-3" id="previewContainer" style="display: none;">
        <p>New Preview:</p>
        <img id="picturePreview" src="" style="max-width: 100px;" class="img-thumbnail">
        <div class="mt-2" id="fileInfo" style="font-size: 0.9rem; color: #555;"></div>
    </div>
</div>


<div class="mb-3">
    <label>Description One</label>
    <textarea name="description_one" class="form-control">{{ old('description_one', $homeWelcomeSecondPage->description_one ?? '') }}</textarea>
</div>
<div class="mb-3">
    <label>Description Two</label>
    <textarea name="description_two" class="form-control">{{ old('description_two', $homeWelcomeSecondPage->description_two ?? '') }}</textarea>
</div>
<div class="mb-3">
    <label>Description Three</label>
    <textarea name="description_three" class="form-control">{{ old('description_three', $homeWelcomeSecondPage->description_three ?? '') }}</textarea>
</div>
<div class="mb-3">
    <label>Status</label>
    <select name="status" class="form-control">
        <option value="active" {{ old('status', $homeWelcomeSecondPage->status ?? '') == 'active' ? 'selected' : '' }}>Active</option>
        <option value="inactive" {{ old('status', $homeWelcomeSecondPage->status ?? '') == 'inactive' ? 'selected' : '' }}>Inactive</option>
    </select>
</div>


<script>
    document.getElementById('pictureInput').addEventListener('change', function (event) {
        const file = event.target.files[0];
        const preview = document.getElementById('picturePreview');
        const container = document.getElementById('previewContainer');
        const fileInfo = document.getElementById('fileInfo');

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Set canvas to original dimensions
                    canvas.width = img.width;
                    canvas.height = img.height;

                    ctx.drawImage(img, 0, 0);

                    // Compress to JPEG (quality = 0.7 ≈ ~1.5MB for large images)
                    canvas.toBlob(function (blob) {
                        if (blob.size / 1024 > 1536) {
                            alert("Image is still larger than 1.5 MB after compression.");
                        }

                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });

                        // Replace the file in the input using DataTransfer
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(compressedFile);
                        document.getElementById('pictureInput').files = dataTransfer.files;

                        // Show preview
                        preview.src = URL.createObjectURL(blob);
                        container.style.display = 'block';

                        const sizeInKB = (blob.size / 1024).toFixed(1);
                        const formattedSize = sizeInKB > 1024
                            ? (sizeInKB / 1024).toFixed(1) + ' MB'
                            : sizeInKB + ' KB';

                        fileInfo.innerHTML = `<strong>Type:</strong> ${compressedFile.type} &nbsp; <strong>Size:</strong> ${formattedSize}`;
                    }, 'image/jpeg', 0.7); // Adjust quality here
                };

                img.src = e.target.result;
            };

            reader.readAsDataURL(file);
        } else {
            container.style.display = 'none';
            fileInfo.innerHTML = '';
        }
    });
    </script>
