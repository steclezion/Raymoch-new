<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyReaction;
use Illuminate\Http\Request;

class CompanyReactionController extends Controller
{
    /**
     * List reactions for a company (optional, useful for admin/analytics).
     */
    public function index(Request $request, Company $company)
    {
        $reactions = $company->reactions()
            ->latest()
            ->paginate(20);

        return response()->json([
            'data' => $reactions,
        ]);
    }

    /**
     * Store a reaction + comment for a company.
     *
     * Expected payload (JSON):
     * {
     *   "reaction_type": "marked|future|satisfied|unsatisfied",
     *   "comment": "string (optional)",
     *   "session_id": "string (optional)"
     * }
     */
    public function storeReaction(Request $request, Company $company)
    {
        $validated = $request->validate([
            'reaction_type' => 'required|string|in:marked,future,satisfied,unsatisfied',
            'comment'       => 'nullable|string|max:2000',
            'session_id'    => 'nullable|string|max:100',
        ]);

        $reaction = CompanyReaction::create([
            'company_id'  => $company->id,
            'user_id'     => optional($request->user())->id,
            'reaction_type' => $validated['reaction_type'],
            'comment'       => $validated['comment'] ?? null,
            'session_id'    => $validated['session_id'] ?? $request->input('session_id'),
            'ip_address'    => $request->ip(),
            'user_agent'    => substr((string) $request->userAgent(), 0, 500),
        ]);

        return response()->json([
            'message' => 'Your comment has been posted.',
            'data'    => $reaction,
        ], 201);
    }
}
