<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvestorPreferenceRequest;
use App\Http\Resources\InvestorMatchResource;
use App\Services\InvestorMatchingService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class InvestorMatchingController extends Controller
{
    /**
     * Save the preference submitted from the Continue button
     * and return matched companies.
     */
    public function storeAndMatch(
        StoreInvestorPreferenceRequest $request,
        InvestorMatchingService $matchingService
    ): AnonymousResourceCollection {
        /*
         * The Form Request has already validated the payload.
         */
        $result = $matchingService
            ->savePreferenceAndFindMatches(
                $request->user(),
                $request->validated()
            );

        /*
         * Return matching records without exposing private_score.
         */
        return InvestorMatchResource::collection(
            $result['matches']
        )->additional([
            'meta' => [
                'preference_id' =>
                $result['preference']->id,

                'preference_name' =>
                $result['preference']->preference_name,

                'total_matches' =>
                $result['matches']->count(),

                'message' =>
                $result['matches']->isEmpty()
                    ? 'No eligible companies matched the current preference.'
                    : 'Matching companies generated successfully.',
            ],
        ]);
    }
}
