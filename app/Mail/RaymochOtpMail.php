<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RaymochOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $code;
    public int $minutes;

    public function __construct(string $code, int $minutes = 5)
    {
        $this->code = $code;
        $this->minutes = $minutes;
    }

    public function build()
    {
        return $this->subject('Your Raymoch verification code')
            ->view('mail.raymoch-otp')
            ->with([
                'code' => $this->code,
                'minutes' => $this->minutes,
            ]);
    }
}
