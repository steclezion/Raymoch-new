<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\View\View;

class NotificationController extends Controller
{
    public function page(): View
    {
        return view('pages.notifications');
    }

    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->paginate(20);

        return response()->json([
            'notifications' => collect($notifications->items())
                ->map(fn (DatabaseNotification $notification) => $this->present($notification))
                ->values(),
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'total' => $notifications->total(),
                'unread' => $request->user()->unreadNotifications()->count(),
            ],
        ]);
    }

    public function update(Request $request, string $notification): JsonResponse
    {
        $data = $request->validate(['read' => ['required', 'boolean']]);
        $item = $request->user()->notifications()->whereKey($notification)->firstOrFail();

        $data['read'] ? $item->markAsRead() : $item->markAsUnread();

        return response()->json([
            'message' => $data['read'] ? 'Notification marked as read.' : 'Notification marked as unread.',
            'notification' => $this->present($item->fresh()),
            'unread' => $request->user()->unreadNotifications()->count(),
        ]);
    }

    public function readAll(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read.', 'unread' => 0]);
    }

    public function destroy(Request $request, string $notification): JsonResponse
    {
        $request->user()->notifications()->whereKey($notification)->firstOrFail()->delete();

        return response()->json([
            'message' => 'Notification removed.',
            'unread' => $request->user()->unreadNotifications()->count(),
        ]);
    }

    public function clearRead(Request $request): JsonResponse
    {
        $deleted = $request->user()->readNotifications()->delete();

        return response()->json([
            'message' => $deleted === 1 ? 'One read notification cleared.' : "{$deleted} read notifications cleared.",
            'deleted' => $deleted,
            'unread' => $request->user()->unreadNotifications()->count(),
        ]);
    }

    private function present(DatabaseNotification $notification): array
    {
        $data = is_array($notification->data) ? $notification->data : [];
        $class = class_basename($notification->type);
        $kind = (string) ($data['kind'] ?? '');

        [$title, $message, $category, $actionLabel, $actionUrl] = match (true) {
            $kind === 'trial_expiring_tomorrow' || $class === 'TrialExpiringTomorrowNotification' => [
                'Your trial ends tomorrow',
                'Choose a plan to keep your Raymoch workspace and services active.',
                'billing', 'Review plans', '/pricing',
            ],
            $class === 'TrialWelcomeNotification' => [
                'Welcome to your Raymoch trial',
                'Your trial workspace is ready'.(isset($data['trial_days']) ? " for {$data['trial_days']} days." : '.'),
                'account', 'Open workspace', '/home',
            ],
            str_contains(strtolower($class), 'payment') => [
                'Billing action required',
                'We could not process a recent payment. Review your billing information to prevent interruption.',
                'billing', 'Review billing', '/settings',
            ],
            str_contains(strtolower($class), 'security') || str_contains(strtolower($kind), 'security') => [
                'Security update',
                'A security-related change or sign-in event needs your attention.',
                'security', 'Review security', '/settings',
            ],
            default => [
                (string) ($data['title'] ?? $data['subject'] ?? 'Raymoch update'),
                (string) ($data['message'] ?? $data['body'] ?? 'There is a new update in your Raymoch workspace.'),
                (string) ($data['category'] ?? 'system'),
                (string) ($data['action_label'] ?? 'View details'),
                (string) ($data['action_url'] ?? '/home'),
            ],
        };

        // Notification actions must remain inside this application.
        if (!str_starts_with($actionUrl, '/') || str_starts_with($actionUrl, '//')) {
            $actionUrl = '/home';
        }

        return [
            'id' => $notification->id,
            'title' => $title,
            'message' => $message,
            'category' => $category,
            'action_label' => $actionLabel,
            'action_url' => $actionUrl,
            'read' => $notification->read_at !== null,
            'read_at' => $notification->read_at?->toIso8601String(),
            'created_at' => $notification->created_at?->toIso8601String(),
            'relative_time' => $notification->created_at?->diffForHumans() ?? 'Recently',
        ];
    }
}
