<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OtpCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public int $code;

    public function __construct(int $code)
    {
        $this->code = $code;
    }

    public function build()
    {
        return $this->subject('Your Raymoch Verification Code')
            ->view('emails.otp')
            ->with(['code' => $this->code]);
    }
}
