<?php

namespace App\Console\Commands;

use App\Services\WebsiteMaintenanceService;
use Illuminate\Console\Command;

class TakeWebsite extends Command
{
    protected $signature = 'take:website
                            {action : Action to perform: down or up}
                            {--retry=120 : Seconds before clients should retry}
                            {--refresh=60 : Seconds before the maintenance page refreshes}';

    protected $description = 'Enable or disable the Raymoch website maintenance page';

    public function handle(WebsiteMaintenanceService $maintenance): int
    {
        $action = strtolower((string) $this->argument('action'));

        if (! in_array($action, ['down', 'up'], true)) {
            $this->components->error('Invalid action. Use "down" or "up".');

            return self::INVALID;
        }

        $exitCode = $action === 'down'
            ? $maintenance->takeDown(
                (int) $this->option('retry'),
                (int) $this->option('refresh'),
            )
            : $maintenance->bringUp();

        if ($exitCode !== self::SUCCESS) {
            $this->components->error("Unable to bring the website {$action}.");

            return self::FAILURE;
        }

        $message = $action === 'down'
            ? 'The website is now in maintenance mode.'
            : 'The website is live and available to customers.';

        $this->components->info($message);

        return self::SUCCESS;
    }
}
