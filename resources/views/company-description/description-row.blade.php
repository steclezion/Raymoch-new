<div class="row description-row mb-2">
    <div class="col-md-4">
        <select name="description_type[]" class="form-control" required>
            <option value="">-- Choose Type --</option>
            @foreach($descriptionTypes as $type)
                <option value="{{ $type->name }}">{{ ucfirst($type->name) }}</option>
            @endforeach
        </select>
    </div>
    <div class="col-md-6">
        <input type="text" name="description[]" class="form-control" placeholder="Enter Description" required>
    </div>
    <div class="col-md-2">
        <button type="button" class="btn btn-danger" onclick="removeRow(this)">❌</button>
    </div>
</div>
