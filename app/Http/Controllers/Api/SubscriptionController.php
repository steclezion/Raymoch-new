<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubscriptionController extends Controller
{
    public function access(Request $request)
    {
        $user = $request->user();
        //  dd($user->email);
        if (!$user || !$user->email) {
            return response()->json([
                'ok' => false,
                'can_view' => false,
                'plan' => null,
                'status' => null,
                'message' => 'Unauthenticated user.',
            ], 401);
        }

        $subscription = DB::table('subscriptions')
            ->where('email', $user->email)
            ->latest('updated_at')
            ->first();


        if ($subscription->plan === 'basic') {
            return response()->json([
                'ok' => true,
                'can_view' => false, // Default to true if no subscription found, as per your requirement
                'plan' => null,
                'status' => null,
                'message' => 'No subscription found.',
            ]);
        } elseif ($subscription->plan === 'premium' && $subscription->status === 'active') {
            return response()->json([
                'ok' => true,
                'can_view' => true,
                'plan' => $subscription->plan,
                'status' => $subscription->status,
                'message' => 'Active premium subscription found.',
            ]);
        }




        $plan = strtolower(trim($subscription->plan ?? ''));
        $status = strtolower(trim($subscription->status ?? ''));

        $canView = $plan !== 'basic' && $status === 'active';

        return response()->json([
            'ok' => true,
            'can_view' => $canView,
            'plan' => $subscription->plan,
            'status' => $subscription->status,
            'message' => $canView
                ? 'Active premium subscription found.'
                : 'Basic, inactive, or invalid subscription.',
        ]);
    }
}
