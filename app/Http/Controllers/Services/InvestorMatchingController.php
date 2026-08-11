<?php

namespace App\Http\Controllers\Services;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvestorPreferenceRequest;
use App\Http\Resources\InvestorMatchResource;
use App\Http\Resources\InvestorSearchHistoryResource;
use App\Models\CountryAfrican;
use App\Models\FundingInstrument;
use App\Models\InvestorPreference;
use App\Models\Sector;
use App\Services\InvestorMatchingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Collection;

class InvestorMatchingController extends Controller
{
    /**
     * Return all selectable modal options.
     */
    public function options(): JsonResponse
    {
        /*
     * Fetch every funding instrument.
     *
     * Inactive instruments are also returned so React may
     * show them as disabled checkboxes.
     */
        $fundingInstruments = FundingInstrument::query()
            ->select([
                'id',
                'code',
                'name',
                'description',
                'is_active',
            ])
            ->orderBy('name')
            ->get();

        /*
     * Fetch the existing sector master records.
     */
        $sectors = Sector::query()
            ->select('id')
            ->selectRaw('title AS name')
            ->orderBy('title')
            ->get();

        /*
         * Retrieve African countries_africans.
         *
         * The database column is "country_name",
         * but React expects "name".
         */
        $countries = CountryAfrican::query()
            ->select('id')
            ->selectRaw('country_name AS name')
            ->orderBy('country_name')
            ->get();

        /*
         * Return the database records as JSON.
         */
        return response()->json([
            'funding_instruments' => $fundingInstruments,
            'sectors' => $sectors,
            'countries' => $countries,
        ]);
    }

    /**
     * Save the submitted preference and generate matches.
     *
     * This method is triggered by the React Continue button.
     */
    public function storeAndMatch(
        StoreInvestorPreferenceRequest $request,
        InvestorMatchingService $matchingService
    ): JsonResponse {
        $result =
            $matchingService
            ->saveSearchAndMatch(
                $request->user(),
                $request->validated()
            );

        return $this->matchingResponse(
            request: $request,
            preference: $result['preference'],
            matches: $result['matches'],
            message: $result['matches']->isEmpty()
                ? 'The search was saved, but no eligible companies matched the current preferences.'
                : 'The search was saved and matching companies were generated.',
            status: 201
        );
    }

    /**
     * List all previous searches belonging to the
     * authenticated investor.
     */
    public function history(
        Request $request
    ): AnonymousResourceCollection {
        $preferences =
            InvestorPreference::query()
            ->where(
                'user_id',
                $request->user()->getKey()
            )
            ->with([
                'fundingInstruments:id,code,name',
                'sectors:id,title',
                'countries:id,country_name',
            ])
            ->withCount('matches')
            ->latest('created_at')
            ->paginate(10);

        return InvestorSearchHistoryResource::collection(
            $preferences
        );
    }

    /**
     * Return one previous search and its saved results.
     */
    public function showHistory(
        Request $request,
        InvestorPreference $investorPreference
    ): JsonResponse {
        $this->ensurePreferenceBelongsToUser(
            $request,
            $investorPreference
        );

        $investorPreference->load([
            'fundingInstruments:id,code,name',
            'sectors:id,title',
            'countries:id,country_name',
        ]);

        $investorPreference->loadCount(
            'matches'
        );

        $matches =
            $investorPreference
            ->matches()
            ->with([
                'opportunity.company',

                'opportunity.fundingInstruments:id,code,name',

                'opportunity.sectors:id,title',

                'opportunity.countries:id,country_name',
            ])
            ->orderByDesc('private_score')
            ->get();

        return $this->matchingResponse(
            request: $request,
            preference: $investorPreference,
            matches: $matches,
            message: 'The saved search was loaded successfully.'
        );
    }

    /**
     * Rerun the matching algorithm using a previous search.
     */
    public function rerunHistory(
        Request $request,
        InvestorPreference $investorPreference,
        InvestorMatchingService $matchingService
    ): JsonResponse {
        $this->ensurePreferenceBelongsToUser(
            $request,
            $investorPreference
        );

        $result =
            $matchingService
            ->rerunSavedSearch(
                $investorPreference
            );

        return $this->matchingResponse(
            request: $request,
            preference: $result['preference'],
            matches: $result['matches'],
            message: $result['matches']->isEmpty()
                ? 'The search was refreshed, but no eligible companies currently match it.'
                : 'The saved search was refreshed successfully.'
        );
    }

    /**
     * Create the common JSON shape used by:
     *
     * - New searches
     * - Previous searches
     * - Refreshed searches
     */
    private function matchingResponse(
        Request $request,
        InvestorPreference $preference,
        Collection $matches,
        string $message,
        int $status = 200
    ): JsonResponse {
        $preference->loadMissing([
            'fundingInstruments:id,code,name',
            'sectors:id,title',
            'countries:id,country_name',
        ]);

        $preference->loadCount('matches');

        return response()->json([
            'data' => InvestorMatchResource::collection(
                $matches
            )->resolve($request),

            'meta' => [
                'preference' => (new InvestorSearchHistoryResource(
                    $preference
                ))->resolve($request),

                'total_matches' => $matches->count(),

                'message' => $message,
            ],
        ], $status);
    }

    /**
     * Prevent one investor from reading another
     * investor's search history.
     */
    private function ensurePreferenceBelongsToUser(
        Request $request,
        InvestorPreference $preference
    ): void {
        abort_unless(
            (string) $preference->user_id
                ===
                (string) $request
                    ->user()
                    ->getKey(),
            403,
            'You are not authorized to access this search.'
        );
    }
}
