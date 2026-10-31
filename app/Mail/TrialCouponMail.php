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
        public string $verificationUrl,
        public int $expiresInMinutes = 15,
    ) {
    }

    public function build(): static
    {
        return $this->subject('Your Raymoch trial coupon')
            ->view('emails.trial-coupon');
    }
}
