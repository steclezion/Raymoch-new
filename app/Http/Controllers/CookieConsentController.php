<?php

namespace App\Http\Controllers;

use App\Models\CookieConsent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CookieConsentController extends Controller
{
    private const CATEGORIES = ['functionality', 'measurement', 'marketing'];

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'anonymous_id' => ['required', 'uuid'],
            'consent_version' => ['required', 'string', 'max:20'],
            'preferences' => ['required', 'array'],
            'preferences.*' => ['required', 'boolean'],
        ]);

        foreach (self::CATEGORIES as $category) {
            if (! array_key_exists($category, $validated['preferences'])) {
                return response()->json(['message' => "The {$category} preference is required."], 422);
            }
        }

        $consent = DB::transaction(function () use ($request, $validated): CookieConsent {
            $consent = CookieConsent::updateOrCreate(
                [
                    'anonymous_id' => $validated['anonymous_id'],
                    'consent_version' => $validated['consent_version'],
                ],
                [
                    'user_id' => $request->user()?->id,
                    'ip_address_hash' => $request->ip()
                        ? hash_hmac('sha256', $request->ip(), config('app.key'))
                        : null,
                    'user_agent' => Str::limit((string) $request->userAgent(), 500, ''),
                    'accepted_at' => now(),
                ]
            );

            foreach (self::CATEGORIES as $category) {
                $consent->preferences()->updateOrCreate(
                    ['category' => $category],
                    ['enabled' => (bool) $validated['preferences'][$category]]
                );
            }

            return $consent;
        });

        return response()->json([
            'message' => 'Cookie preferences saved.',
            'consent_id' => $consent->id,
        ]);
    }
}
