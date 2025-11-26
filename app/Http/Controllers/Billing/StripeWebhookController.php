<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Webhook;
use App\Models\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\PaymentFailedNotification;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (\Throwable $e) {
            return response('Invalid signature', 400);
        }

        switch ($event->type) {
            case 'invoice.payment_succeeded':
                // good — could log or update last_paid_at
                break;

            case 'invoice.payment_failed':
                $invoice = $event->data->object;
                $subId = $invoice->subscription;
                $user = User::where('stripe_subscription_id', $subId)->first();
                if ($user) {
                    Notification::send($user, new PaymentFailedNotification($user, $invoice));
                }
                break;
        }

        return response('ok', 200);
    }
}
