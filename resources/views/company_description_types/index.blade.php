@extends('layouts_admin.app')


@section('content')
<div class="container">
    <h2>Company Description Types</h2>
    <a href="{{ route('company_description_types.create') }}" class="btn btn-primary mb-3">+ Add New Type</a>

    <table id="example" class="table table-bordered table-striped">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($types as $type)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>{{ $type->name }}</td>

                <td>
                    <span style="cursor: pointer; color: blue;" data-bs-toggle="modal" data-bs-target="#descModal{{ $type->id }}">
                        {{ Str::words(strip_tags($type->description), 10, '...') }}
                    </span>

                    <!-- Modal -->
                    <div class="modal fade" id="descModal{{ $type->id }}" tabindex="-1" aria-labelledby="descModalLabel{{ $type->id }}" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="descModalLabel{{ $type->id }}">Full Description - {{ $type->name }}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    {!! nl2br(e($type->description)) !!}
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    @if($type->status === 'active')
                        <span class="badge bg-success">Active</span>
                    @elseif($type->status === 'inactive')
                        <span class="badge bg-warning text-dark">Inactive</span>
                    @else
                        <span class="badge bg-secondary">{{ ucfirst($type->status) }}</span>
                    @endif
                </td>

                <td>
                    <a href="{{ route('company_description_types.edit', $type->id) }}" class="btn btn-warning btn-sm">Edit</a>
                    <form action="{{ route('company_description_types.destroy', $type->id) }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
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
