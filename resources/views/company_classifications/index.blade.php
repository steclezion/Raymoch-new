@extends('layouts_admin.app')

@section('content')
<div class="container">
    <h2>Company Classifications</h2>
    <a href="{{ route('company_classifications.create') }}" class="btn btn-primary mb-3">+ Add New</a>

    <table class="table table-bordered table-striped">
        <thead>
            <tr>
                <th>ID</th>
                <th>Industry</th>
                <th>Business Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($classifications as $item)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>{{ $item->industry }}</td>
                <td>{{ $item->business_type }}</td>
                <td>{{ Str::words(strip_tags($item->description), 10, '...') }}</td>
                <td>
                    <span class="badge bg-{{ $item->status === 'active' ? 'success' : 'warning text-dark' }}">
                        {{ ucfirst($item->status) }}
                    </span>
                </td>
                <td>
                    <a href="{{ route('company_classifications.edit', $item->id) }}" class="btn btn-warning btn-sm">Edit</a>
                    <form action="{{ route('company_classifications.destroy', $item->id) }}" method="POST" style="display:inline;">
                        @csrf @method('DELETE')
                        <button class="btn btn-danger btn-sm" onclick="return confirm('Delete this?')">Delete</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
