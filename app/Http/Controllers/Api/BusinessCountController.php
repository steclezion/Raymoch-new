<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class BusinessCountController extends Controller
{
    private const BUSINESS_SEARCH_VIEW = 'raymoch_business_search_view';

    public function __invoke(): JsonResponse
    {
        $total = Cache::remember('navigation:business-count', now()->addMinute(), function (): int {
            return DB::table(self::BUSINESS_SEARCH_VIEW)
                ->distinct()
                ->count('id');
        });

        return response()->json([
            'ok' => true,
            'data' => [
                'total' => $total,
            ],
        ]);
    }
}
