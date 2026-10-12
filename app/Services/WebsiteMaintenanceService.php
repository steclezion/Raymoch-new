<?php

namespace App\Services;

use Illuminate\Support\Facades\Artisan;

class WebsiteMaintenanceService
{
    public function takeDown(int $retryAfter = 120, int $refreshAfter = 60): int
    {
        return Artisan::call('down', [
            '--render' => 'errors.503',
            '--retry' => max(1, $retryAfter),
            '--refresh' => max(1, $refreshAfter),
            '--status' => 503,
        ]);
    }

    public function bringUp(): int
    {
        return Artisan::call('up');
    }
    //php artisan take:website down --retry=120 --refresh=60
    //php artisan take:website down 
    //php artisan take:website up 
}
