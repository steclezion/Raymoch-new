@extends('layouts_admin.app')

@section('content')
<div class="container">
    <h2>All Company Descriptions</h2>
    <div class="container">
        <a href="{{ url('descriptions/create') }}" class="btn btn-primary mb-3"> <i class="fas fa-plus"></i> Add New</a>
        <table id="example" class="table table-bordered table-striped">

        <thead>
            <tr>
                <th>ID</th>

                <th>Company</th>
                <th>Type</th>
                <th>Description</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            @foreach($descriptions as $desc)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $desc->company_title }}</td>
                    <td>{{ $desc->description_type }}</td>
                    <td>{{ $desc->description }}</td>
                    <td>
                        <a href="{{ route('descriptions.edit', [$desc->companyinfo_id, $desc->id]) }}" class="btn btn-sm btn-warning">Edit</a>

                            <form action="{{ route('descriptions.destroy', $desc->id) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-sm btn-danger" onclick="return confirm('Delete this record?')">Delete</button>
                            </form>

                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
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
