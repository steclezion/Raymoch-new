<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cookie Consent Administration | Raymoch</title>
    <style>
        :root { color-scheme: light; --espresso:#3b2518; --amber:#d97706; --cream:#fffbeb; --line:#efd49a; --muted:#745945; }
        * { box-sizing: border-box; }
        body { margin:0; color:var(--espresso); background:#f8f4ea; font-family:Inter,ui-sans-serif,system-ui,sans-serif; }
        main { width:min(1180px,calc(100% - 32px)); margin:40px auto; }
        .top { display:flex; align-items:end; justify-content:space-between; gap:20px; margin-bottom:24px; }
        h1 { margin:0 0 6px; font-size:30px; letter-spacing:-.03em; } p { margin:0; color:var(--muted); }
        .back { color:#8f4107; font-weight:700; }
        .stats { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; margin-bottom:24px; }
        .card { padding:18px; background:var(--cream); border:1px solid var(--line); border-radius:14px; box-shadow:0 6px 20px rgba(59,37,24,.06); }
        .card span { display:block; color:var(--muted); font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; }
        .card strong { display:block; margin-top:8px; font-size:27px; }
        .table-wrap { overflow:auto; background:#fff; border:1px solid var(--line); border-radius:14px; }
        table { width:100%; border-collapse:collapse; font-size:13px; }
        th,td { padding:13px 15px; text-align:left; border-bottom:1px solid #f0e4ca; white-space:nowrap; }
        th { color:#765037; background:#fff8df; font-size:11px; text-transform:uppercase; letter-spacing:.05em; }
        .yes,.no { display:inline-block; min-width:45px; padding:4px 8px; border-radius:999px; text-align:center; font-weight:800; }
        .yes { color:#fff; background:var(--amber); } .no { color:#765037; background:#eee2c8; }
        .identity small { display:block; color:var(--muted); }
        nav[role=navigation] { margin-top:18px; }
        @media(max-width:850px){.stats{grid-template-columns:repeat(2,1fr)}.top{align-items:start;flex-direction:column}}
    </style>
</head>
<body>
<main>
    <div class="top">
        <div><h1>Cookie consent records</h1><p>Anonymous browser choices and linked account preferences.</p></div>
        <a class="back" href="{{ route('users.index') }}">Admin users</a>
    </div>
    <section class="stats" aria-label="Consent statistics">
        <div class="card"><span>Total browsers</span><strong>{{ number_format($total) }}</strong></div>
        <div class="card"><span>Linked users</span><strong>{{ number_format($linked) }}</strong></div>
        @foreach(['functionality','measurement','marketing'] as $category)
            <div class="card"><span>{{ ucfirst($category) }} enabled</span><strong>{{ number_format($enabledCounts[$category] ?? 0) }}</strong></div>
        @endforeach
    </section>
    <div class="table-wrap">
        <table>
            <thead><tr><th>Saved</th><th>User / browser</th><th>Functionality</th><th>Measurement</th><th>Marketing</th><th>Version</th><th>Browser</th></tr></thead>
            <tbody>
            @forelse($consents as $consent)
                @php($preferences = $consent->preferences->keyBy('category'))
                <tr>
                    <td>{{ $consent->accepted_at?->format('M j, Y g:i A') }}</td>
                    <td class="identity">
                        @if($consent->user)
                            {{ $consent->user->name }}<small>{{ $consent->user->email }}</small>
                        @else
                            Anonymous<small>{{ Str::limit($consent->anonymous_id, 18) }}</small>
                        @endif
                    </td>
                    @foreach(['functionality','measurement','marketing'] as $category)
                        @php($enabled = (bool) optional($preferences->get($category))->enabled)
                        <td><span class="{{ $enabled ? 'yes' : 'no' }}">{{ $enabled ? 'Yes' : 'No' }}</span></td>
                    @endforeach
                    <td>{{ $consent->consent_version }}</td>
                    <td title="{{ $consent->user_agent }}">{{ Str::limit($consent->user_agent ?: 'Unknown', 34) }}</td>
                </tr>
            @empty
                <tr><td colspan="7">No consent records have been received yet.</td></tr>
            @endforelse
            </tbody>
        </table>
    </div>
    {{ $consents->links() }}
</main>
</body>
</html>
