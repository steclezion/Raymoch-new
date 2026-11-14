<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TrialCouponMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $firstName,
        public string $email,
        public string $coupon,
        public string $loginUrl,
        public \DateTimeInterface $trialEndsAt,
    ) {}

    public function build(): static
    {
        return $this->subject('Your Raymoch trial access coupon')
            ->view('emails.trial-coupon');
    }
}
