@extends('layouts_admin.app')
@section('content')
<div class="container">
    <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="card shadow-sm">
                        <div class="card-header bg-primary text-white">
                            <div class="d-flex justify-content-between align-items-center">
    <h5>
    @if(isset($editing))
        <i class="fas fa-edit"></i> Edit
    @else
        <i class="fas fa-plus"></i> Create
    @endif
    Company Descriptions</h5>

    <a href="{{ url('/descriptions') }}" class="btn btn-secondary">
        <i class="far fa-arrow-alt-circle-left"></i> Back
    </a>
</div>
</div>
<div class="card-body">
    <form method="POST" action="{{ isset($editing) ? route('descriptions.update', $companyinfo->id) : route('descriptions.store') }}">
        @csrf
        @if(isset($editing)) @method('PUT') @endif

        <div class="mb-3">
            <label>Select Company</label>
            <select name="companyinfo_id" class="form-control" required>
                <option value="">-- Choose Company --</option>
                @foreach($companies as $company)
                <option value="{{ $company->id }}"
                    {{ (old('companyinfo_id', $companyinfo->id ?? '') == $company->id) ? 'selected' : '' }}>
                    {{ $company->company_title }}
                </option>
                @endforeach
            </select>
        </div>

        <div id="description-rows">
            @if(isset($editing) && count($descriptions))
                @foreach($descriptions as $desc)
                <div class="row description-row mb-2">
                    <div class="col-md-4">
                        <select name="description_type[]" class="form-control" required>
                            <option value="">-- Choose Type --</option>
                            @foreach($descriptionTypes as $type)
                                <option value="{{ $type->name }}"
                                    {{ $desc->description_type == $type->name ? 'selected' : '' }}>
                                    {{ ucfirst($type->name) }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-6">
                        <input type="text" name="description[]" class="form-control"
                               value="{{ $desc->description }}" required>
                    </div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-danger" onclick="removeRow(this)">❌</button>
                    </div>
                </div>
                @endforeach
            @else
                {{-- Default blank row --}}
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
            @endif
        </div>


        <button type="button" class="btn btn-sm btn-primary my-2" onclick="addRow()">+ Add Row</button>

        <br><br>
        <button type="submit" class="btn btn-success"><i class="fas fa-edit"></i>Update</button>
    </form>
</div>

<!-- Template row for JS cloning -->
<div id="description-row-template" class="d-none">
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
</div>

</div>
</div>
</div>
</div>
</div>


<script>
    function addRow() {
        const template = document.getElementById('description-row-template').innerHTML;
        const container = document.getElementById('description-rows');
        container.insertAdjacentHTML('beforeend', template);
    }

    function removeRow(button) {
        const rows = document.querySelectorAll('.description-row');

        if (rows.length > 2) {
            button.closest('.description-row').remove();

        } else {
            alert('At least one row is required.');
        }
    }
</script>

@endsection
