<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CookieConsent;
use App\Models\CookieConsentPreference;
use Illuminate\View\View;

class CookieConsentAdminController extends Controller
{
    public function index(): View
    {
        $total = CookieConsent::count();
        $linked = CookieConsent::whereNotNull('user_id')->count();
        $enabledCounts = CookieConsentPreference::query()
            ->where('enabled', true)
            ->selectRaw('category, COUNT(*) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        $consents = CookieConsent::query()
            ->with(['user:id,name,email', 'preferences'])
            ->latest('accepted_at')
            ->paginate(25);

        return view('admin.cookie-consents.index', compact('total', 'linked', 'enabledCounts', 'consents'));
    }
}
