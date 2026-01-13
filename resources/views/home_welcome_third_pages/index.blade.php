@extends('layouts_admin.app')

@section('content')
<div class="container">
    <div class="container">
        <h4>Welcome Third  Section Pages</h4>
        <a href="{{ route('home-welcome-third-page.create') }}" class="btn btn-primary mb-3">Add New</a>

        {{-- <h4>Welcome Third  Section Pages</h4>
        <a href="{{ route('home-welcome-third-page.create') }}" class="btn btn-primary">Add New</a> --}}
    </div>

    <div class="table-responsive">
   <table  class="table table-bordered table-responsive-md" id="welcomeThirdTable">
        <thead>
            <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pages as $page)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $page->title }}</td>
                    <td  >  <span class="text-primary description-preview" data-full="{{$page->description}}"> {!! Str::limit($page->description, 60) !!}</span>
                 </td>
                    <td>
                        <span class="badge {{ $page->status === 'active' ? 'bg-success' : 'bg-secondary' }}">
                            {{ ucfirst($page->status) }}
                        </span>
                    </td>
                    <td class="d-flex gap-2">
                        <a href="{{ route('home-welcome-third-page.edit', $page->id) }}" class="btn btn-sm btn-warning">
                            <i class="fas fa-edit"></i> Edit
                        </a>

                        <form action="{{ route('home-welcome-third-page.destroy', $page->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this item?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-sm btn-danger">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
    @include('home_welcome_third_pages.description')
</div>
</div>

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



<script>
    $(document).ready(function () {
        $('#welcomeThirdTable').DataTable({
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

    $(document).on('click', '.description-preview', function () {
  const fullText = decodeURIComponent($(this).data('full'));
  $('#descriptionModalBody').text(fullText);
  $('#descriptionModal').modal('show');
});


</script>
@endsection
