@extends('layouts_admin.app')

@section('content')
<div class="container">
    <h2>Company Info List</h2>
    <a href="{{ route('companyinfos.create') }}" class="btn btn-primary mb-3"><i class="fa fa-plus"> </i>Add New Company</a>
        <div class="table-responsive">
        <table class="table table-bordered table-responsive-md" id="welcomeSecondTable">
            <thead>
                <tr>
                    <th>ID</th>
                <th>Title</th>
                <th>Company Type</th>
                <th>Company Business Classification</th>
                <th>Tagline</th>
                <th>First Picture</th>
                <th>Second Picture</th>
                <th>Third Picture</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($companyinfos as $info)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>{{ $info->company_title }}</td>
                <td>{{ $info->industry ?? 'N/A' }}</td>
                <td>{{ $info->business_type ?? 'N/A' }}</td>
                <td>{{ $info->tagline }}</td>

                <td>
                    @if($info->first_picture)
                        <img src="{{ asset('storage/' . $info->first_picture) }}" alt="First" width="60">
                    @else
                        <span class="text-muted">N/A</span>
                    @endif
                </td>

                <td>
                    @if($info->second_picture)
                        <img src="{{ asset('storage/' . $info->second_picture) }}" alt="Second" width="60">
                    @else
                        <span class="text-muted">N/A</span>
                    @endif
                </td>

                <td>
                    @if($info->third_picture)
                        <img src="{{ asset('storage/' . $info->third_picture) }}" alt="Third" width="60">
                    @else
                        <span class="text-muted">N/A</span>
                    @endif
                </td>

                <td>{{ $info->status }}</td>
                <td>
                    <a href="{{ route('companyinfos.edit', $info->id) }}" class="btn btn-sm btn-warning">Edit</a>
                    <form action="{{ route('companyinfos.destroy', $info->id) }}" method="POST" style="display:inline;">
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
</div>
<!-- DataTables CSS -->
<link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet" />

<!-- jQuery & DataTables JS -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>

<script>
    $(document).ready(function () {
        $('#welcomeSecondTable').DataTable({
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


<!-- DataTables CSS -->
<link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet" />
<!-- jQuery & DataTables JS -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>
<link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.bootstrap5.min.css">
<script src="https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.min.js"></script>
<script src="https://cdn.datatables.net/responsive/2.5.0/js/responsive.bootstrap5.min.js"></script>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">



@endsection

