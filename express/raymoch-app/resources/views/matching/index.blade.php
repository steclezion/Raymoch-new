@extends('layouts.app')

@section('content')
<div class="container py-4">
  <h1 class="mb-3">Matching</h1>

  <h2 class="h5 mt-4">Top Matches</h2>
  <ul class="list-group mb-4">
    @foreach($matches as $m)
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>{{ $m['company']['name'] }}</strong>
          <small class="text-muted"> — {{ $m['company']['country'] }} • {{ $m['company']['sector'] }}</small>
          <div class="text-muted">{{ $m['company']['summary'] }}</div>
        </div>
        <span class="badge bg-primary rounded-pill">{{ number_format($m['score'],1) }}</span>
      </li>
    @endforeach
  </ul>

  <h2 class="h5">All Companies</h2>
  <div class="row row-cols-1 row-cols-md-2 g-3">
    @foreach($companies as $c)
      <div class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title mb-1">{{ $c['name'] }}</h5>
            <div class="text-muted mb-2">{{ $c['country'] }} • {{ $c['sector'] }}</div>
            <p class="mb-0">{{ $c['summary'] }}</p>
          </div>
        </div>
      </div>
    @endforeach
  </div>
</div>
@endsection
