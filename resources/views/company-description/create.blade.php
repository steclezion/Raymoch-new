@extends('layouts_admin.app')

@section('content')
<div class="container">
    <h2>{{ isset($editing) ? 'Edit' : 'Create' }} Company Descriptions</h2>

    <form method="POST" action="{{ isset($editing) ? route('descriptions.update', $companyinfo->id) : route('descriptions.store') }}">
        @csrf
        @if(isset($editing)) @method('PUT') @endif

        <div class="mb-3">
            <label>Select Company</label>
            <select name="companyinfo_id" class="form-control" required>
                <option value="">-- Choose Company --</option>
                @foreach($companies as $company)
                    <option value="{{ $company->id }}" {{ old('companyinfo_id') == $company->id ? 'selected' : '' }}>
                        {{ $company->company_title }}
                    </option>
                @endforeach
            </select>
        </div>

        <div id="description-rows">
            <div class="row description-row mb-2">
                <div class="col-md-4">
                    <select name="description_type[]" class="form-control">
                        <option value="">-- Type --</option>
                        <option value="mission">Mission</option>
                        <option value="vision">Vision</option>
                        <option value="goal">Goal</option>
                        <option value="value">Value</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <input type="text" required name="description[]" class="form-control" placeholder="Enter Description">
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger" onclick="removeRow(this)">❌</button>
                </div>
            </div>
        </div>

        <button type="button" class="btn btn-sm btn-primary my-2" onclick="addRow()">+ Add Row</button>

        <br><br>
        <button type="submit" class="btn btn-sm btn-success my-2">Save Descriptions</button>
    </form>
</div>



<script>
    function addRow() {
          const row = `
            <div class="row description-row mb-2">
                <div class="col-md-4">
                    <select name="description_type[]" class="form-control">
                        <option value="">-- Type --</option>
                        <option value="mission">Mission</option>
                        <option value="vision">Vision</option>
                        <option value="goal">Goal</option>
                        <option value="value">Value</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <input type="text" name="description[]" class="form-control" placeholder="Enter Description">
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger" onclick="removeRow(this)">❌</button>
                </div>
            </div>`;
        document.getElementById('description-rows').insertAdjacentHTML('beforeend', row);
    }

    function removeRow(button) {
    const rows = document.querySelectorAll('.description-row');

    if (rows.length > 1) {
        button.closest('.description-row').remove();
    } else {
        alert('At least one row is required.');
    }
}

</script>



@endsection
