@extends('layouts_admin.app')

@section('content')
<div class="container">
    <h2>Edit Company Descriptions</h2>

    <form method="POST" action="{{ route('descriptions.update', $companyinfo->id) }}">
        @csrf
        @method('PUT')

        <!-- Select Company -->
        <div class="mb-3">
            <label>Select Company</label>
            <select name="companyinfo_id" class="form-control" required>
                <option value="">-- Choose Company --</option>
                @foreach($companies as $company)
                    <option value="{{ $company->id }}" {{ $company->id == $companyinfo->id ? 'selected' : '' }}>
                        {{ $company->company_title }}
                    </option>
                @endforeach
            </select>
        </div>

        <!-- Existing Descriptions -->
        <div id="description-rows">
            @foreach($descriptions as $desc)
            <div class="row description-row mb-2">
                <div class="col-md-4">
                    <select name="description_type[]" class="form-control">
                        <option value="">-- Type --</option>
                        <option value="mission" {{ $desc->description_type == 'mission' ? 'selected' : '' }}>Mission</option>
                        <option value="vision" {{ $desc->description_type == 'vision' ? 'selected' : '' }}>Vision</option>
                        <option value="goal" {{ $desc->description_type == 'goal' ? 'selected' : '' }}>Goal</option>
                        <option value="value" {{ $desc->description_type == 'value' ? 'selected' : '' }}>Value</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <input type="text" required  name="description[]" class="form-control" value="{{ $desc->description }}" placeholder="Enter Description">
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger" onclick="removeRow(this)">❌</button>
                </div>
            </div>
            @endforeach
        </div>

        <button type="button" class="btn btn-sm btn-primary my-2" onclick="addRow()">+ Add Row</button>

        <br><br>
        <button type="submit" class="btn btn-sm btn-success my-2">Update Descriptions</button>
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
        button.closest('.description-row').remove();
    }
</script>
@endsection
