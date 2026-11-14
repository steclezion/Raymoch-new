<?php

namespace App\Console\Commands;

use App\Services\ExpiredTrialUserService;
use Illuminate\Console\Command;

class PurgeExpiredTrialUsers extends Command
{
    protected $signature = 'trial-users:purge-expired';

    protected $description = 'Delete linked trial users whose trial period has ended';

    public function handle(ExpiredTrialUserService $service): int
    {
        $this->info("Deleted {$service->purge()} expired trial user(s).");

        return self::SUCCESS;
    }
}
