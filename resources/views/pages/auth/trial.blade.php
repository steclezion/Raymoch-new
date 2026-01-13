{{-- from Entire.html --}}
@extends('layouts.app_raymoch_new')
<link href="{{ asset('css/style_entire.css')  }}" rel="stylesheet" type="text/css" id="bootstrap">
{{-- <link href="{{ asset('css/style_entire_2.css')  }}" rel="stylesheet" type="text/css" id="bootstrap"> --}}
<!-- JS libs -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
 {{-- <script rel="stylesheet" src="{{ asset('js/script_african_slider.js') }}"></script> --}}


<!-- Bootstrap CSS for Section 4 African Slides -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>

  <style>
    :rooot{
      --page-bg:#f5f6f7; --ink:#0f172a; --muted:#6b7280;
      --primary:#3b57d0; --primary-600:#2f46ad;
      --border:#e5e7eb; --card:#ffffff;
    }
    html,body{height:100%}
    body{margin:0;background:var(--page-bg);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial}
    /* .wrap{min-height:100%;display:grid;place-items:start center;padding:32px} */
    .hdr{width:100%;max-width:1200px;margin-bottom:20px;display:flex;align-items:center;gap:8px;color:var(--ink)}
    .logo{font-weight:700}
    #root{width:100%}

    
    
  </style>


@viteReactRefresh
@vite('resources/js/app.jsx')
<script>
  window.APP = {
    apiTrial: "{{ route('api.trial-requests.store') }}",
    csrf: "{{ csrf_token() }}"
  }
</script>


@section('title','Raymoch • Request a Trial')
@section('content')
  <main class="wrap">
    <div class="hdr"><!--<div class="logo">Raymoch</div>--> </div>
    <div id="root"></div>
  </main>
  <br><br><br>
 
@endsection