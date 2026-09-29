<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoreSessionSearchController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'keyword' => ['nullable', 'string', 'max:255'],
            'region' => ['nullable', 'string', 'max:64'],
            'country' => ['nullable', 'string', 'max:64'],
            'state' => ['nullable', 'string', 'max:64'],
            'city' => ['nullable', 'string', 'max:64'],
            'sector' => ['nullable', 'string', 'max:64'],
            'industry' => ['nullable', 'string', 'max:64'],
            'verification' => ['required', 'boolean'],
        ]);
        $filters = $this->normalize($validated);
        $request->session()->put('previous_search_filters', $filters);

        return response()->json([
            'ok' => true,
            'data' => $filters,
            'url' => $this->url($filters),
        ]);
    }

    public function current(Request $request): JsonResponse
    {
        $filters = $request->session()->get(
            'previous_search_filters',
            $this->normalize(['verification' => false]),
        );

        return response()->json([
            'ok' => true,
            'data' => $filters,
            'url' => $this->url($filters),
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $request->session()->forget('previous_search_filters');

        return response()->json(['ok' => true]);
    }

    private function normalize(array $values): array
    {
        $dimension = static function (string $key) use ($values): string {
            $value = trim((string) ($values[$key] ?? ''));

            return $value === '' || strtolower($value) === 'all' ? 'all' : $value;
        };

        return [
            'keyword' => trim((string) ($values['keyword'] ?? '')),
            'region' => $dimension('region'),
            'country' => $dimension('country'),
            'state' => $dimension('state'),
            'city' => $dimension('city'),
            'sector' => $dimension('sector'),
            'industry' => $dimension('industry'),
            'verification' => (bool) ($values['verification'] ?? false),
        ];
    }

    private function url(array $filters): string
    {
        $parameters = array_filter(
            $filters,
            static fn(mixed $value): bool => !in_array($value, [null, '', 'all', false], true),
        );
        $parameters['from'] = 'explore';

        return '/companies?' . http_build_query($parameters);
    }
}
