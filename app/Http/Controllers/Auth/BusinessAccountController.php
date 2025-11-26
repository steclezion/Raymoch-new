<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Models\User;
use Stripe\Stripe;
use Stripe\Customer;
use Stripe\PaymentMethod;
use Stripe\Subscription;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;
use App\Notifications\BusinessWelcomeNotification;

class BusinessAccountController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }


    public function __invoke(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $email = strtolower(trim($request->input('email')));

        $exists = User::where('email', $email)->exists();

        return response()->json([
            'taken' => $exists
        ]);
    }


    public function createBusiness()
    {
        return view('pages.auth.signup.signup-business'); // create this blade below
    }

    // POST /signup/business/complete
    public function complete(Request $req)
    {
        $req->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|max:255|unique:users,email',
            'display_name'  => 'required|string|max:255',
            'company_name'  => 'required|string|max:255',
            'password'      => 'required|string|min:9',
            'type_account'  => ['required', Rule::in(['business'])],
            'payment_method' => 'required|string',
            'billing'       => 'array',
        ]);

        $email = strtolower(trim($req->input('email')));
        // must be verified via OTP
        if (!Cache::get("otp:business:verified:$email")) {
            return response()->json(['message' => 'Email is not verified.'], 422);
        }

        $pmId   = $req->input('payment_method');
        $price  = config('services.stripe.price_business_monthly'); // STRIPE_PRICE_BUSINESS_MONTHLY
        if (!$price) {
            return response()->json(['message' => 'Stripe price is not configured.'], 500);
        }

        // 1) Create user (inactive until subscription succeeds)
        $user = User::create([
            'name'           => $req->input('name'),
            'email'          => $email,
            'password'       => Hash::make($req->input('password')),
            'type_account'   => 'business',
            'company_name'   => $req->input('company_name'),
            'display_name'   => $req->input('display_name'),
            'email_verified_at' => now(), // we validated OTP
        ]);

        // 2) Create Stripe Customer & attach payment method
        $billing = $req->input('billing', []);
        $customer = Customer::create([
            'email' => $email,
            'name'  => $user->name,
            'address' => [
                'line1'       => $billing['address_line1'] ?? null,
                'line2'       => $billing['address_line2'] ?? null,
                'city'        => $billing['city'] ?? null,
                'state'       => $billing['state'] ?? null,
                'postal_code' => $billing['postal_code'] ?? null,
                'country'     => $billing['country'] ?? null,
            ],
            'phone' => $billing['phone'] ?? null,
        ]);

        $paymentMethod = PaymentMethod::retrieve($pmId);
        $paymentMethod->attach(['customer' => $customer->id]);

        // set default invoice settings
        $customer->invoice_settings = ['default_payment_method' => $pmId];
        $customer->save();

        // 3) Create Subscription ($69/mo)
        // Expand latest_invoice.payment_intent to detect SCA
        $subscription = Subscription::create([
            'customer' => $customer->id,
            'items' => [['price' => $price]],
            'payment_behavior' => 'default_incomplete',
            'expand' => ['latest_invoice.payment_intent'],
            'trial_period_days' => 30,
        ]);

        $user->stripe_customer_id    = $customer->id;
        $user->stripe_subscription_id = $subscription->id;
        $user->save();

        $pi = $subscription->latest_invoice->payment_intent ?? null;
        if ($pi && $pi->status === 'requires_action') {
            // Client must confirm SCA
            return response()->json([
                'requires_action' => true,
                'payment_intent_client_secret' => $pi->client_secret,
                'subscription_id' => $subscription->id,
                'redirect' => route('dashboard'), // optional
            ]);
        }

        // If here, first invoice succeeded – notify and return
        Notification::send($user, new BusinessWelcomeNotification($user));

        return response()->json([
            'ok' => true,
            'subscription_id' => $subscription->id,
            'redirect' => route('dashboard'),
        ]);
    }

    // POST /signup/business/finalize
    public function finalize(Request $req)
    {
        $req->validate(['subscription_id' => 'required|string']);
        $subId = $req->input('subscription_id');

        // If needed, you can retrieve the subscription and double-check status here
        $subscription = Subscription::retrieve($subId);
        // Find the user by subscription id and send welcome
        $user = User::where('stripe_subscription_id', $subId)->first();
        if ($user) {
            Notification::send($user, new BusinessWelcomeNotification($user));
        }

        return response()->json(['ok' => true]);
    }
}
