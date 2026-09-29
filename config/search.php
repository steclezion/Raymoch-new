<?php

return [
    // Queue connection name, not the database name.
    'connection' => env('SEARCH_QUEUE_CONNECTION', 'database'),

    // Queue consumed by the company-search worker.
    'queue' => env('SEARCH_QUEUE', 'company-search'),


    // Queue consumed by the company-search worker.
    'queue_ai_search' => env('SEARCH_QUEUE_AI_BASED', 'search'),

    // Store defined in config/cache.php.
    'cache_store' => env('SEARCH_CACHE_STORE', 'database'),

    // Search lifetime in seconds.
    'ttl_seconds' => (int) env('SEARCH_TTL_SECONDS', 1800),

    // Database view queried by CompanySearchEngineService.
    'source_view' => env(
        'SEARCH_SOURCE_VIEW_COMPANY_SEARCH',
        'raymoch_business_search_view'
    ),

    // One queued job instance per search dimension.
    'steps' => [
        'keyword',
        'region',
        'country',
        'state',
        'city',
        'sector',
        'industry',
        'verification',
    ],
];
