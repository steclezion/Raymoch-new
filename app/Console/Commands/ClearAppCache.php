<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ClearAppCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clear-app-cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $this->call('config:clear');
        $this->info('✅ Config cleared.');

        $this->call('cache:clear');
        $this->info('✅ Cache cleared.');

        $this->call('route:clear');
        $this->info('✅ Route cleared.');

        $this->call('view:clear');
        $this->info('✅ View cleared.');

        $this->info('🎉 All cleared successfully!');
    }
}
