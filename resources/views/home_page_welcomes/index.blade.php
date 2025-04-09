@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Home Page Welcomes</h1>
    <a href="{{ route('home_page_welcomes.create') }}" class="btn btn-primary mb-3">Add New</a>

    <table class="table table-bordered" id="homePageWelcomeTable">
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Second Picture</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
            </tr>
        </thead>
    </table>
</div>
@endsection

@push('scripts')
<!-- Include jQuery & DataTables -->
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.5/css/jquery.dataTables.min.css">
<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
<script src="https://cdn.datatables.net/1.13.5/js/jquery.dataTables.min.js"></script>

<script>
$(function () {
    $('#homePageWelcomeTable').DataTable({
        processing: true,
        serverSide: true,
        ajax: '{{ route('home_page_welcomes.index') }}',
        columns: [
            { data: 'id', name: 'id' },
            { data: 'title', name: 'title' },
            {
                data: 'second_picture',
                name: 'second_picture',
                render: function(data) {
                    return data ? `<img src="/storage/${data}" width="60">` : '';
                },
                orderable: false,
                searchable: false
            },
            { data: 'status', name: 'status' },
            { data: 'created_at', name: 'created_at' },
            {
                data: 'action',
                name: 'action',
                orderable: false,
                searchable: false
            },
        ]
    });
});
</script>
@endpush
