<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\User;

class BusinessWelcomeNotification extends Notification
{
    use Queueable;

    public function __construct(public User $user) {}

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Your Raymoch Business Account is Active')
            ->greeting('Welcome to Raymoch Business!')
            ->line('Your $69/month plan is now active. We’ll bill monthly unless canceled.')
            ->action('Go to Dashboard', url('/dashboard'))
            ->line('Thanks for choosing Raymoch.');
    }
}
