<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\StripeClient;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    //

    private function stripe(): StripeClient
    {
        return new StripeClient(config('services.stripe.secret'));
    }

    public function createSetupIntent(Request $req)
    {
        $data = $req->validate([
            'email' => 'required|email',
            'name' => 'required|string|max:200',
        ]);

        $stripe = $this->stripe();

        // find or create Stripe Customer mapped to email
        $customerId = DB::table('payment_methods')->where('email', $data['email'])->value('stripe_customer_id');
        if (!$customerId) {
            // check if we already created one for signup
            $existing = DB::table('premium_signups')->where('email', $data['email'])->first();
            if ($existing && $existing->stripe_customer_id) {
                $customerId = $existing->stripe_customer_id;
            } else {
                $customer = $stripe->customers->create([
                    'email' => $data['email'],
                    'name'  => $data['name'],
                ]);
                $customerId = $customer->id;
                DB::table('premium_signups')->where('email', $data['email'])->update(['stripe_customer_id' => $customerId]);
            }
        }

        $si = $stripe->setupIntents->create([
            'customer' => $customerId,
            'usage' => 'off_session',
        ]);

        return response()->json(['client_secret' => $si->client_secret]);
    }

    public function createSubscription(Request $req)
    {
        $data = $req->validate([
            'email' => 'required|email',
            'name' => 'required|string|max:200',
            'display_name' => 'required|string|max:150',
            'company_name' => 'required|string|max:200',
            'password' => 'required|string|min:9',
            'payment_method' => 'required|string',
            'plan' => 'required|in:premium',
        ]);

        // Ensure email was verified in OTP table
        $signup = DB::table('premium_signups')->where('email', $data['email'])->first();
        if (!$signup || (int)$signup->is_verified !== 1) {
            return response()->json(['ok' => false, 'message' => 'Email not verified'], 403);
        }

        $stripe = $this->stripe();
        $priceId = config('services.stripe.premium_price_id'); // set in config/services.php or .env

        // Ensure customer
        $customerId = $signup->stripe_customer_id;
        if (!$customerId) {
            $customer = $stripe->customers->create([
                'email' => $data['email'],
                'name'  => $data['name'],
            ]);
            $customerId = $customer->id;
            DB::table('premium_signups')->where('email', $data['email'])->update(['stripe_customer_id' => $customerId]);
        }

        // Attach payment method & set as default
        $stripe->paymentMethods->attach($data['payment_method'], ['customer' => $customerId]);
        $stripe->customers->update($customerId, [
            'invoice_settings' => ['default_payment_method' => $data['payment_method']]
        ]);

        // Create subscription (no trial -> first invoice attempts payment immediately)
        try {
            $subscription = $stripe->subscriptions->create([
                'customer' => $customerId,
                'items' => [['price' => $priceId]],
                'expand' => ['latest_invoice.payment_intent'],
            ]);
        } catch (\Stripe\Exception\CardException $e) {
            // Card declined / insufficient funds
            return response()->json(['ok' => false, 'message' => $e->getMessage()], 402);
        }

        $status = $subscription->status;
        $pi = $subscription->latest_invoice->payment_intent ?? null;

        // If payment needs SCA
        if ($pi && $pi->status === 'requires_action') {
            // front-end must handle confirmCardPayment
            DB::table('subscriptions')->insert([
                'email' => $data['email'],
                'stripe_subscription_id' => $subscription->id,
                'stripe_customer_id' => $customerId,
                'status' => $status,
                'plan' => 'premium',
                'created_at' => now(),
                'updated_at' => now()
            ]);
            return response()->json([
                'ok' => true,
                'status' => 'requires_action',
                'payment_intent_client_secret' => $pi->client_secret,
            ]);
        }

        // If payment failed
        if ($pi && $pi->status === 'requires_payment_method') {
            return response()->json(['ok' => false, 'message' => 'Payment failed; use another card.'], 402);
        }

        // At this point payment should be succeeded or subscription is active/ trialing.
        // Persist normalized records and CREATE the user account now that payment succeeded.
        DB::beginTransaction();
        try {
            // users (if not existing)
            $userId = DB::table('users')->where('email', $data['email'])->value('id');
            if (!$userId) {
                $userId = DB::table('users')->insertGetId([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => Hash::make($data['password']),
                    'display_name' => $data['display_name'],
                    'company_name' => $data['company_name'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            // payment_methods
            DB::table('payment_methods')->updateOrInsert(
                ['email' => $data['email'], 'stripe_payment_method_id' => $data['payment_method']],
                [
                    'stripe_customer_id' => $customerId,
                    'brand' => null,
                    'last4' => null,
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );

            // subscriptions
            DB::table('subscriptions')->updateOrInsert(
                ['email' => $data['email'], 'stripe_subscription_id' => $subscription->id],
                [
                    'stripe_customer_id' => $customerId,
                    'status' => $subscription->status,
                    'plan' => 'premium',
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );

            // transactions (initial invoice)
            if ($pi) {
                DB::table('transactions')->insert([
                    'email' => $data['email'],
                    'stripe_payment_intent_id' => $pi->id,
                    'amount' => $pi->amount_received,
                    'currency' => $pi->currency,
                    'status' => $pi->status,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            // cleanup: premium_signups row can be kept for audit, but mark completed
            DB::table('premium_signups')->where('email', $data['email'])->update(['completed' => 1, 'updated_at' => now()]);

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            // Optional: cancel subscription if app failed to persist
            try {
                $stripe->subscriptions->cancel($subscription->id);
            } catch (\Throwable $ignore) {
            }
            return response()->json(['ok' => false, 'message' => 'Internal persistence error'], 500);
        }

        return response()->json([
            'ok' => true,
            'status' => $subscription->status,
            'redirect' => url('/dashboard'),
        ]);
    }

    public function webhook(Request $request)
    {
        // Verify signature
        $payload = $request->getContent();
        $sig = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sig, $secret);
        } catch (\Throwable $e) {
            return response('Invalid', 400);
        }

        // Handle events (invoice.paid, invoice.payment_failed, customer.subscription.deleted, etc.)
        $type = $event->type;
        $obj = $event->data->object;

        try {
            if ($type === 'invoice.paid') {
                $email = $obj->customer_email ?? null;
                if ($email && isset($obj->payment_intent)) {
                    DB::table('transactions')->insert([
                        'email' => $email,
                        'stripe_payment_intent_id' => $obj->payment_intent,
                        'amount' => $obj->amount_paid,
                        'currency' => $obj->currency,
                        'status' => 'succeeded',
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            } elseif ($type === 'invoice.payment_failed') {
                $email = $obj->customer_email ?? null;
                if ($email) {
                    DB::table('transactions')->insert([
                        'email' => $email,
                        'stripe_payment_intent_id' => $obj->payment_intent ?? null,
                        'amount' => $obj->amount_due,
                        'currency' => $obj->currency,
                        'status' => 'failed',
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            } elseif ($type === 'customer.subscription.updated' || $type === 'customer.subscription.deleted') {
                $sub = $obj;
                $email = null; // fetch by customer id
                $row = DB::table('subscriptions')->where('stripe_subscription_id', $sub->id)->first();
                if ($row) {
                    DB::table('subscriptions')->where('stripe_subscription_id', $sub->id)->update([
                        'status' => $sub->status,
                        'updated_at' => now()
                    ]);
                }
            }
        } catch (\Throwable $e) {
            Log::error('Stripe webhook error: ' . $e->getMessage());
        }

        return response('OK', 200);
    }
}
