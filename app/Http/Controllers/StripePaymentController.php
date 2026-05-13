<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;

use Stripe\Stripe;
use Stripe\Customer;
use Stripe\PaymentIntent;

class StripePaymentController extends Controller
{
    /**
     * Create Stripe Payment Intent
     */
    public function createPaymentIntent(Request $request)
    {
        DB::beginTransaction();

        try {

            $request->validate([
                'plan' => ['required', 'string', 'in:business,investor'],
            ]);

            $user = Auth::user();

            if (!$user) {
                throw new Exception('Unauthorized user.');
            }

            $amount = $request->plan === 'investor'
                ? 2699
                : 1999;

            Stripe::setApiKey(config('services.stripe.secret'));

            /**
             * Check existing subscription customer
             */
            $existingSubscription = DB::table('subscriptions')
                ->where('email', $user->email)
                ->first();

            /**
             * Reuse Stripe customer if exists
             */
            if (
                $existingSubscription &&
                !empty($existingSubscription->stripe_customer_id)
            ) {

                $customerId = $existingSubscription->stripe_customer_id;
            } else {

                /**
                 * Create new Stripe customer
                 */
                $customer = Customer::create([
                    'email' => $user->email,
                    'name'  => $user->name ?? $user->email,

                    'metadata' => [
                        'user_id' => $user->id,
                    ],
                ]);

                $customerId = $customer->id;
            }

            /**
             * Create Payment Intent
             */
            $intent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => 'usd',

                'customer' => $customerId,

                'automatic_payment_methods' => [
                    'enabled' => true,
                ],

                'metadata' => [
                    'plan'   => $request->plan,
                    'email'  => $user->email,
                    'user_id' => $user->id,
                ],
            ]);

            DB::commit();

            return response()->json([
                'ok' => true,
                'clientSecret' => $intent->client_secret,
            ]);
        } catch (\Stripe\Exception\ApiErrorException $e) {

            DB::rollBack();

            Log::error('Stripe API Error', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'ok' => false,
                'message' => 'Stripe payment service failed.',
                'error' => $e->getMessage(),
            ], 500);
        } catch (Exception $e) {

            DB::rollBack();

            Log::error('Payment Intent Error', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'ok' => false,
                'message' => 'Unable to create payment intent.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Membership Success
     */
    public function membershipSuccess(Request $request)
    {
        DB::beginTransaction();

        try {

            $paymentIntentId = $request->query('payment_intent');

            if (!$paymentIntentId) {
                throw new Exception('Missing payment intent.');
            }

            $user = Auth::user();

            if (!$user) {
                throw new Exception('Unauthorized user.');
            }

            Stripe::setApiKey(config('services.stripe.secret'));

            /**
             * Retrieve Stripe Payment Intent
             */
            $intent = PaymentIntent::retrieve($paymentIntentId);

            if ($intent->status !== 'succeeded') {
                throw new Exception('Payment not completed.');
            }

            $plan = $intent->metadata->plan ?? 'basic';

            /**
             * Insert / Update subscription
             */
            DB::table('subscriptions')->updateOrInsert(

                [
                    'email' => $user->email,
                ],

                [
                    'stripe_customer_id' =>
                    $intent->customer,

                    'stripe_subscription_id' =>
                    $intent->id,

                    'plan' => $plan,

                    'status' => 'active',

                    'updated_at' => now(),

                    'created_at' => now(),
                ]
            );

            DB::commit();

            return redirect(
                '/membership-success-page?plan=' . $plan
            );
        } catch (\Stripe\Exception\ApiErrorException $e) {

            DB::rollBack();

            Log::error('Stripe Verification Error', [
                'message' => $e->getMessage(),
            ]);

            return redirect('/pricing')
                ->with('error', 'Stripe verification failed.');
        } catch (Exception $e) {

            DB::rollBack();

            Log::error('Membership Success Error', [
                'message' => $e->getMessage(),
            ]);

            return redirect('/pricing')
                ->with('error', $e->getMessage());
        }
    }
}
