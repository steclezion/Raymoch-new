<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>@yield('title', config('app.name', 'Laravel'))</title>

  {{-- Base fonts/css/js you always want --}}
  <link rel="stylesheet" href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" />

  {{-- If you’re using plain public assets (no Vite) --}}
  <link rel="stylesheet" href="{{ asset('css/app.css') }}">
  <script src="{{ asset('js/app.js') }}" defer></script>

  {{-- Page-/layout-specific additions to <head> (styles, metas, etc.) --}}
  @stack('head')
</head>
<body class="font-sans antialiased">
  @hasSection('body')
    {{-- A child layout/page provided its own full body markup --}}
    @yield('body')
  @else
    {{-- Default wrapper (when children only provide @section("content")) --}}
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      @include('layouts.navigation')

      @hasSection('header')
        <header class="bg-white dark:bg-gray-800 shadow">
          <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            @yield('header')
          </div>
        </header>
      @endif

      <main>
        @yield('content')
      </main>
    </div>
  @endif

  {{-- Page-/layout-specific scripts at end of body --}}
  @stack('scripts')
</body>
</html>
