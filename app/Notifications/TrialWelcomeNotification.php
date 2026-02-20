<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TrialWelcomeNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public int $trialDays)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Raymoch Notification')
            ->view('mail.signupNotification', [
                'name' => $notifiable->name ?? 'there',
                'messageTitle' => 'Account Notification',
                'messageBody'  => 'Your account action was received successfully. Please follow the instructions below.',
                'ctaText'      => 'Open Raymoch',
                'ctaUrl'       => url('/dashboard'),
                'footerNote'   => 'If you didn’t request this, you can ignore this email.',
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return ['trial_days' => $this->trialDays];
    }
}
