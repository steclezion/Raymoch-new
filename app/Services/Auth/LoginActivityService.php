<?php

namespace App\Services\Auth;

use App\Models\LoginLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginActivityService
{
    private const SESSION_KEY = 'login_activity.last_at';

    public function start(Request $request): array
    {
        $request->session()->put(self::SESSION_KEY, now()->timestamp);
        return $this->status($request);
    }

    public function touch(Request $request): array
    {
        return Auth::check() ? $this->start($request) : $this->guestStatus();
    }

    public function status(Request $request): array
    {
        if (! Auth::check()) return $this->guestStatus();

        $lastActivityAt = (int) $request->session()->get(self::SESSION_KEY, 0);
        if ($lastActivityAt <= 0) {
            $lastActivityAt = now()->timestamp;
            $request->session()->put(self::SESSION_KEY, $lastActivityAt);
        }

        $idleSeconds = max(0, now()->timestamp - $lastActivityAt);
        $timeoutSeconds = $this->timeoutSeconds();
        $remainingSeconds = max(0, $timeoutSeconds - $idleSeconds);

        return [
            'authenticated' => true,
            'expired' => $remainingSeconds === 0,
            'acknowledged' => true,
            'idle_seconds' => $idleSeconds,
            'remaining_seconds' => $remainingSeconds,
            'timeout_seconds' => $timeoutSeconds,
            'last_activity_at' => now()->setTimestamp($lastActivityAt)->toIso8601String(),
            'expires_at' => now()->setTimestamp($lastActivityAt + $timeoutSeconds)->toIso8601String(),
        ];
    }

    public function isExpired(Request $request): bool
    {
        return (bool) ($this->status($request)['expired'] ?? false);
    }

    public function logout(Request $request): array
    {
        if ($loginLogId = $request->session()->get('current_login_log_id')) {
            LoginLog::whereKey($loginLogId)->update(['logged_out_at' => now()]);
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return ['authenticated' => false, 'expired' => true, 'acknowledged' => true, 'redirect' => '/'];
    }

    public function timeoutSeconds(): int
    {
        return max(60, (int) config('login_activity.timeout_minutes', 30) * 60);
    }

    private function guestStatus(): array
    {
        return [
            'authenticated' => false,
            'expired' => false,
            'acknowledged' => true,
            'idle_seconds' => 0,
            'remaining_seconds' => 0,
            'timeout_seconds' => $this->timeoutSeconds(),
            'redirect' => '/',
        ];
    }
}
