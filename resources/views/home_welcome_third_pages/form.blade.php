@extends('layouts_admin.app')

<script src="https://cdn.ckeditor.com/4.21.0/standard/ckeditor.js"></script>

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">{{ isset($page) ? 'Edit Page' : 'Create New Page' }}</h5>
                    <a href="{{ url('/home-welcome-third-page') }}" class="float-right">
                        <button class="btn btn-secondary"> <span class="far fa-arrow-alt-circle-left"> Back </button>
                    </a>
                </div>





                <div class="card-body">
                    <form action="{{ isset($page) ? route('home-welcome-third-page.update', $page->id) : route('home-welcome-third-page.store') }}" method="POST">
                        @csrf
                        @if(isset($page))
                            @method('PUT')
                        @endif

                        <div class="mb-3">
                            <label for="title" class="form-label">Title <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" value="{{ old('title', $page->title ?? '') }}" class="form-control @error('title') is-invalid @enderror" required>
                            @error('title')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="description" class="form-label">Description <span class="text-danger">*</span></label>
                            <textarea name="description" id="description" class="form-control @error('description') is-invalid @enderror" required>{{ old('description', $page->description ?? '') }}</textarea>
                            @error('description')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>


                        <div class="mb-3">
                            <label for="status" class="form-label">Status <span class="text-danger">*</span></label>
                            <select name="status" id="status" class="form-control @error('status') is-invalid @enderror" required>
                                <option value="active" {{ old('status', $page->status ?? '') === 'active' ? 'selected' : '' }}>Active</option>
                                <option value="inactive" {{ old('status', $page->status ?? '') === 'inactive' ? 'selected' : '' }}>Inactive</option>
                            </select>
                            @error('status')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="d-flex justify-content-end">
                            <button type="submit" class="btn btn-success">
                                {{ isset($page) ? 'Update' : 'Create' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    CKEDITOR.replace('descriptionn');
</script>
@endsection
