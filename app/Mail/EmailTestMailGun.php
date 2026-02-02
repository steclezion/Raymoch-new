<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmailTestMailGun extends Mailable
{
    use Queueable, SerializesModels;

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Email Test Mail Gun',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.welcome', // ✅ correct view
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
