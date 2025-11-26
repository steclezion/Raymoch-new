{{-- @extends('layouts.app_raymoch_new') --}}
<link href="{{ asset('css/style_entire.css')  }}" rel="stylesheet" type="text/css" id="bootstrap">
<!-- Bootstrap CSS for Section 4 African Slides -->
@section('title','Raymoch • Business Explorer')
@section('content')

  @viteReactRefresh
  @vite('resources/js/app.jsx')
<script>
  window.ROUTES = {
    privacy: "{{ url('/privacy') }}",
    terms: "{{ url('/terms') }}",
    cookies: "{{ url('/cookies') }}",
  };
</script>
  <div id="explore-companies"></div>


@push('scripts')

@endpush




