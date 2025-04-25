@extends('layouts_admin.app')

@section('content')
<div class="container">
    <h2>{{ isset($editing) ? 'Edit' : 'Create' }} Company Classification</h2>

    <div class="container">
    <h2>Import Industry & Business Types from Excel</h2>

    <form method="POST" action="{{ route('company_classifications.import') }}" enctype="multipart/form-data" class="mb-4">
        @csrf
        <div class="mb-3">
            <label for="import_file">Upload File (.csv, .xlsx, .xls)</label>
            <input type="file" name="import_file" class="form-control" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" required>
        </div>
        <button type="submit" class="btn btn-primary">Import</button>
    </form>

    <hr>
</div>

    <form method="POST" action="{{ isset($editing) ? route('company_classifications.update', $classification->id) : route('company_classifications.store') }}">
        @csrf
        @if(isset($editing)) @method('PUT') @endif

        <div class="mb-3">
            <label>Industry</label>
            <select name="industry" id="industry-select" class="form-control" required>
        <option value="">-- Select Industry --</option>
                @php
                    $industries = [
                    'Technology',
                    'Manufacturing',
                    'Healthcare',
                    'Education',
                    'Finance',
                    'Construction',
                    'Retail',
                    'Agriculture & Forestry/Wildlife',
                    'Business & Information',
                    'Construction/Utilities/Contracting',
                    'Finance & Insurance',
                    'Food & Hospitality',
                    'Gaming',
                    'Motor Vehicle',
                    'Natural Resources/Environmental',
                    'Personal Services',
                    'Safety/Security & Legal',
                    'Transportation'];
                @endphp
                @foreach($industries as $industry)
                    <option value="{{ $industry }}" {{ old('industry', $classification->industry ?? '') == $industry ? 'selected' : '' }}>
                        {{ $industry }}
                    </option>
                @endforeach
            </select>
        </div>
        <div class="mb-3">
            <label>Business Type</label>
            <input type="text" name="business_type" class="form-control" value="{{ old('business_type', $classification->business_type ?? '') }}" required>
        </div>

        <div class="mb-3">
            <label>Description</label>
            <textarea name="description" class="form-control">{{ old('description', $classification->description ?? '') }}</textarea>
        </div>

        <div class="mb-3">
            <label>Status</label>
            <select name="status" class="form-control">
                <option value="active" {{ old('status', $classification->status ?? '') == 'active' ? 'selected' : '' }}>Active</option>
                <option value="inactive" {{ old('status', $classification->status ?? '') == 'inactive' ? 'selected' : '' }}>Inactive</option>
            </select>
        </div>

        <button type="submit" class="btn btn-success">{{ isset($editing) ? 'Update' : 'Save' }}</button>
    </form>
</div>
<!-- Select2 CSS -->
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />

@stack('scripts')
<script>
    $(function() {
        $('#industry-select').select2();
    });
</script>


@endsection
