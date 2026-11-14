<?php

namespace App\Services;

use App\Models\User;

class ExpiredTrialUserService
{
    public function purge(): int
    {
        $deleted = 0;
        User::query()
            ->where('type_of_account', 'trial')
            ->whereNotNull('trial_ends_at')
            ->where('trial_ends_at', '<=', now())
            ->whereHas('trialRequest')
            ->chunkById(100, function ($users) use (&$deleted): void {
                foreach ($users as $user) {
                    $user->delete();
                    $deleted++;
                }
            });

        return $deleted;
    }
}
