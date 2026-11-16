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
            'regions' => ['nullable', 'array'],
            'regions.*' => ['integer', 'distinct', 'min:1'],
            'region' => ['nullable', 'string', 'max:64'],
            'countries' => ['nullable', 'array'],
            'countries.*' => ['integer', 'distinct', 'min:1'],
            'country' => ['nullable', 'string', 'max:64'],
            'states' => ['nullable', 'array'],
            'states.*' => ['integer', 'distinct', 'min:1'],
            'state' => ['nullable', 'string', 'max:64'],
            'city' => ['nullable', 'string', 'max:64'],
            'sectors' => ['nullable', 'array'],
            'sectors.*' => ['integer', 'distinct', 'min:1'],
            'sector' => ['nullable', 'string', 'max:64'],
            'industries' => ['nullable', 'array'],
            'industries.*' => ['integer', 'distinct', 'min:1'],
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

        $collection = static function (string $plural, string $singular) use ($values): array {
            return collect($values[$plural] ?? (! empty($values[$singular]) && $values[$singular] !== 'all' ? [$values[$singular]] : []))
                ->map(fn ($value) => (string) $value)
                ->unique()
                ->values()
                ->all();
        };

        $regions = $collection('regions', 'region');
        $countries = $collection('countries', 'country');
        $states = $collection('states', 'state');
        $sectors = $collection('sectors', 'sector');
        $industries = $collection('industries', 'industry');

        return [
            'keyword' => trim((string) ($values['keyword'] ?? '')),
            'regions' => $regions,
            'region' => $regions[0] ?? 'all',
            'countries' => $countries,
            'country' => $countries[0] ?? 'all',
            'states' => $states,
            'state' => $states[0] ?? 'all',
            'city' => $dimension('city'),
            'sectors' => $sectors,
            'sector' => $sectors[0] ?? 'all',
            'industries' => $industries,
            'industry' => $industries[0] ?? 'all',
            'verification' => (bool) ($values['verification'] ?? false),
        ];
    }

    private function url(array $filters): string
    {
        $parameters = array_filter(
            collect($filters)->except([
                'region', 'regions', 'country', 'countries', 'state', 'states',
                'sector', 'sectors', 'industry', 'industries',
            ])->all(),
            static fn(mixed $value): bool => !in_array($value, [null, '', 'all', false], true),
        );
        foreach (['region', 'country', 'state', 'sector', 'industry'] as $dimension) {
            $plural = $dimension === 'country' ? 'countries' : $dimension . 's';
            if (! empty($filters[$plural])) {
                $parameters[$dimension . '_ids'] = implode(',', $filters[$plural]);
            }
        }
        $parameters['from'] = 'explore';

        return '/companies?' . http_build_query($parameters);
    }
}
