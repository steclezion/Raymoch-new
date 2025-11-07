<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;
use App\Notifications\TrialExpiringTomorrowNotification;

class CheckExpiringAccounts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    // protected $signature = 'app:check-expiring-accounts';
    protected $signature = 'accounts:check-expiring';


    /**
     * The console command description.
     *
     * @var string
     */
    // protected $description = 'Command description';
    protected $description = 'Send day-before reminders and deactivate expired trials';
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        //
        $now = now();
        $tomorrow = $now->copy()->addDay()->startOfDay();
        $endOfTomorrow = $tomorrow->copy()->endOfDay();

        // 1) Remind users whose trial ends tomorrow (and are still active)
        User::query()
            ->where('is_active', true)
            ->whereNotNull('trial_ends_at')
            ->whereBetween('trial_ends_at', [$tomorrow, $endOfTomorrow])
            ->chunkById(200, function ($users) {
                foreach ($users as $u) {
                    $u->notify(new TrialExpiringTomorrowNotification());
                }
            });

        // 2) Deactivate users whose trial ended already
        User::query()
            ->where('is_active', true)
            ->whereNotNull('trial_ends_at')
            ->where('trial_ends_at', '<', $now)
            ->chunkById(200, function ($users) {
                foreach ($users as $u) {
                    $u->forceFill([
                        'is_active' => false,
                        'deactivated_at' => now(),
                    ])->save();
                }
            });

        $this->info('Checked expiring/deactivation.');
        return Command::SUCCESS;
    }
}
