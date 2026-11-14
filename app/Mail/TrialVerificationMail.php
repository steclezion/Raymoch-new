<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TrialVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $firstName, public string $email, public string $verificationCode, public string $verificationUrl, public int $expiresInMinutes = 15) {}

    public function build(): static
    {
        return $this->subject('Verify your Raymoch trial request')->view('emails.trial-verification');
    }
}
