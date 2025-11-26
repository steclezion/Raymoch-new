<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class PaymentFailedNotification extends Notification
{
    use Queueable;

    public function __construct(public $user, public $invoice) {}

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $amount = number_format($this->invoice->amount_due / 100, 2);
        return (new MailMessage)
            ->subject('Payment Failed — Action Needed')
            ->greeting('Hi ' . $this->user->name . ',')
            ->line("Your recent payment of \${$amount} failed. Please update your payment method to avoid interruption.")
            ->action('Update Billing', url('/billing'))
            ->line('If you need help, reply to this email.');
    }
}
