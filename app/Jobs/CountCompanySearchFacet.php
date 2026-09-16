<?php

namespace App\Jobs;

use App\Services\CompanySearchQuery;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;

class CountCompanySearchFacet implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 120;

    public function __construct(
        public readonly string $searchId,
        public readonly array $payload,
        public readonly string $facetType,
        public readonly string $facetName,
    ) {}

    public function handle(): void
    {
        if ($this->batch()?->cancelled()) return;

        $count = CompanySearchQuery::facet(
            $this->payload,
            $this->facetType,
            $this->facetName,
        )->distinct()->count('id');

        Cache::put($this->cacheKey(), [
            'type' => $this->facetType,
            'name' => $this->facetName,
            'count' => $count,
        ], now()->addMinutes(30));
    }

    private function cacheKey(): string
    {
        return sprintf(
            'raymoch-search:%s:facet:%s',
            $this->searchId,
            sha1($this->facetType . '|' . $this->facetName),
        );
    }
}
