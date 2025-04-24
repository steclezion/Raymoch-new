@extends('layouts_admin.app')

@section('content')
<div class="container">
    <h2>{{ isset($editing) ? 'Edit' : 'Create' }} Description Type</h2>

    <form method="POST" action="{{ isset($editing) ? route('company_description_types.update', $type->id) : route('company_description_types.store') }}">
        @csrf
        @if(isset($editing)) @method('PUT') @endif

        <div class="mb-3">
            <label>Name</label>
            <input type="text" name="name" class="form-control" value="{{ old('name', $type->name ?? '') }}" required>
        </div>

        <div class="mb-3">
            <label>Description</label>
            <textarea name="description" class="form-control">{{ old('description', $type->description ?? '') }}</textarea>
        </div>

        <div class="mb-3">
            <label>Status</label>
            <select name="status" class="form-control">
                <option value="active" {{ old('status', $type->status ?? '') == 'active' ? 'selected' : '' }}>Active</option>
                <option value="inactive" {{ old('status', $type->status ?? '') == 'inactive' ? 'selected' : '' }}>Inactive</option>
            </select>
        </div>

        <button type="submit" class="btn btn-success">Save</button>
    </form>
</div>
@endsection
