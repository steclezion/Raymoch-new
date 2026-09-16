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

class BuildCompanySearchResults implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 180;

    public function __construct(
        public readonly string $searchId,
        public readonly array $payload,
    ) {}

    public function handle(): void
    {
        if ($this->batch()?->cancelled()) return;

        $base = CompanySearchQuery::results($this->payload);
        $total = (clone $base)->distinct()->count('id');
        $data = $base
            ->select(CompanySearchQuery::safeColumns())
            ->orderByDesc('CTI_Score')
            ->orderBy('CompanyName')
            ->limit(250)
            ->get();

        Cache::put("raymoch-search:{$this->searchId}:results", [
            'total' => $total,
            'data' => $data,
            'limited' => $total > 250,
        ], now()->addMinutes(30));
    }
}
