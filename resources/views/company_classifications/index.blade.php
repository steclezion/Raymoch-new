@extends('layouts_admin.app')

@section('content')
<div class="container">
    <h2>Company Classifications</h2>
    <a href="{{ route('company_classifications.create') }}" class="btn btn-primary mb-3">+ Add New</a>

    <table id="example" class="table table-bordered table-striped">
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



<!-- In layouts_admin/app.blade.php -->
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- jQuery (required for Bootstrap < 5.2) -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Bootstrap JS Bundle (includes Popper) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<!-- DataTables CSS -->
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css">
<!-- DataTables CSS -->
<link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet" />

<!-- jQuery & DataTables JS -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>

<script>
    $(document).ready(function () {
        $('#example').DataTable({
            pageLength: 10,
            ordering: true,
            responsive: true,
            lengthChange: false,
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Search entries..."
            }
        });
    });
</script>
@endsection
