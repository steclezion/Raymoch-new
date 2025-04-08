<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeGoogleUser extends Notification
{
    use Queueable;
private $name;
    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
         $this->name;

    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome to Raymoch!')
            ->greeting('Hello ' . $notifiable->name . ' 👋')
            ->line('Thank you for signing in with your Google account.')
            ->line('We’re excited to have you on board!')
            ->action('Go to Dashboard', url('/dashboard'))
            ->line('Cheers!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
