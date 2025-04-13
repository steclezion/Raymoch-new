@extends('layouts_admin.app')
@section('content')
<div class="container">
    <a href="{{ route('home-welcome-second-page.create') }}" class="btn btn-primary mb-3">Add New</a>
    <table class="table table-bordered" id="welcomeSecondTable">
        <thead>
            <tr>
                <th>#</th>
                <th>Title</th>
                <th>Picture</th>
                <th>1st Description </th>
                <th>2nd Description </th>
                <th>3rd Description </th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pages as $page)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $page->title }}</td>
                    <td>
                        @if($page->picture)
                            <img src="{{ asset('storage/' . $page->picture) }}" width="60">
                        @endif
                    </td>
                    <td>{{ $page->description_one }}</td>
                    <td>{{ $page->description_two }}</td>
                    <td>{{ $page->description_three }}</td>
                    <td>  <span class="badge {{ $page->status === 'active' ? 'bg-success' : 'bg-warning' }}">
                        {{ ucfirst($page->status) }}
                    </span></td>
                    <td class="d-flex group-checked@aware(['fs'])">
                        <a href="{{ route('home-welcome-second-page.edit', $page->id) }}" class="btn btn-warning btn-sm me-2">
                            <i class="fas fa-edit"></i> Edit
                        </a>

                        <form action="{{ route('home-welcome-second-page.destroy', $page->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this item?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </form>

                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
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


<link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.bootstrap5.min.css">
<script src="https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.min.js"></script>
<script src="https://cdn.datatables.net/responsive/2.5.0/js/responsive.bootstrap5.min.js"></script>



@endsection

