<?php

namespace App\Services;

use App\Models\InvestmentOpportunity;
use App\Models\InvestorCompanyMatch;
use App\Models\InvestorPreference;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class InvestorMatchingService
{
    /**
     * Save a new investor search and execute matching.
     *
     * Every Continue click creates a new preference record.
     * Older preference records remain available as history.
     *
     * @param  array<string, mixed>  $data
     * @return array{
     *     preference: InvestorPreference,
     *     matches: Collection<int, InvestorCompanyMatch>
     * }
     */
    public function saveSearchAndMatch(
        User $user,
        array $data
    ): array {
        return DB::transaction(
            function () use ($user, $data): array {
                /*
             * Mark the user's older default search
             * as non-default.
             */
                InvestorPreference::query()
                    ->where(
                        'user_id',
                        $user->getKey()
                    )
                    ->where('is_default', true)
                    ->update([
                        'is_default' => false,
                    ]);

                /*
             * Create the new preference record.
             */
                $preference = $user
                    ->investorPreferences()
                    ->create([
                        'preference_name' =>
                        $data['preference_name']
                            ?? 'Search '
                            . now()->format(
                                'M j, Y g:i A'
                            ),

                        'ticket_min' =>
                        $data['ticket_min'],

                        'ticket_max' =>
                        $data['ticket_max'],

                        'currency_code' =>
                        strtoupper(
                            $data['currency_code']
                        ),

                        'start_from_month' =>
                        $data['start_from_month'],

                        'start_to_month' =>
                        $data['start_to_month'],

                        /*
                     * Use a fallback because this field
                     * may not always be present.
                     */
                        'verified_companies_only' =>
                        $data['verified_companies_only'] ?? false,

                        'is_default' => true,
                        'is_active' => true,
                    ]);

                /*
             * Save many-to-many selections.
             */
                $preference
                    ->fundingInstruments()
                    ->sync(
                        $data['funding_instrument_ids']
                    );

                $preference
                    ->sectors()
                    ->sync(
                        $data['business_sector_ids']
                    );

                $preference
                    ->countries()
                    ->sync(
                        $data['country_ids']
                    );

                /*
             * Load relationships using:
             *
             * 1. Relationship method names
             * 2. Actual database column names
             */
                $preference->load([
                    'fundingInstruments:id,code,name',
                    'sectors:id,title',
                    'countries:id,country_name',
                ]);

                /*
             * Execute and store matching results.
             */
                $matches =
                    $this->calculateAndStoreMatches(
                        $preference
                    );

                $preference->loadCount(
                    'matches'
                );

                return [
                    'preference' => $preference,
                    'matches' => $matches,
                ];
            },
            attempts: 3
        );
    }

    /**
     * Execute the algorithm again using an existing preference.
     *
     * This is used by the Refresh Results button.
     *
     * @return array{
     *     preference: InvestorPreference,
     *     matches: Collection<int, InvestorCompanyMatch>
     * }
     */
    public function rerunSavedSearch(
        InvestorPreference $preference
    ): array {
        return DB::transaction(
            function () use ($preference): array {
                $preference->load([
                    'fundingInstruments:id,code,name',
                    'sectors:id,title',
                    'countries:id,country_name',
                ]);

                $preference
                    ->matches()
                    ->delete();

                $matches =
                    $this->calculateAndStoreMatches(
                        $preference
                    );

                $preference->touch();
                $preference->loadCount('matches');

                return [
                    'preference' => $preference,
                    'matches' => $matches,
                ];
            },
            attempts: 3
        );
    }

    /**
     * Filter eligible opportunities, calculate scores,
     * and store matching results.
     *
     * @return Collection<int, InvestorCompanyMatch>
     */
    private function calculateAndStoreMatches(
        InvestorPreference $preference
    ): Collection {
        $fundingInstrumentIds =
            $preference
            ->fundingInstruments
            ->modelKeys();

        $sectorIds =
            $preference
            ->sectors
            ->modelKeys();

        $countryIds =
            $preference
            ->countries
            ->modelKeys();

        /*
         * Begin with mandatory opportunity requirements.
         */
        $query =
            InvestmentOpportunity::query()
            ->with([
                'company',
                'fundingInstruments:id,code,name',
                'sectors:id,title',
                'countries:id,country_name',
            ])

            // Only active opportunities can be matched.
            ->where('status', 'open')

            // Amounts must be compared in the same currency.
            ->where(
                'currency_code',
                $preference->currency_code
            )

            /*
                 * Ticket ranges overlap when:
                 *
                 * opportunity minimum <= investor maximum
                 * AND
                 * opportunity maximum >= investor minimum
                 */
            ->where(
                'amount_min',
                '<=',
                $preference->ticket_max
            )
            ->where(
                'amount_max',
                '>=',
                $preference->ticket_min
            )

            /*
                 * Starting-time windows must overlap.
                 */
            ->where(
                'start_from_month',
                '<=',
                $preference->start_to_month
            )
            ->where(
                'start_to_month',
                '>=',
                $preference->start_from_month
            )

            /*
                 * Include opportunities without a closing date
                 * or whose closing date has not passed.
                 */
            ->where(function ($closingQuery): void {
                $closingQuery
                    ->whereNull('closes_at')
                    ->orWhere(
                        'closes_at',
                        '>=',
                        now()
                    );
            });

        /*
         * Require at least one matching funding instrument.
         */
        if (
            count($fundingInstrumentIds) > 0
        ) {
            $query->whereHas(
                'fundingInstruments',
                function (
                    $fundingQuery
                ) use (
                    $fundingInstrumentIds
                ): void {
                    $fundingQuery->whereIn(
                        'funding_instruments.id',
                        $fundingInstrumentIds
                    );
                }
            );
        }

        /*
         * Require at least one matching sector.
         */
        if (count($sectorIds) > 0) {
            $query->whereHas(
                'sectors',
                function (
                    $sectorQuery
                ) use ($sectorIds): void {
                    $sectorQuery->whereIn(
                        'sectors.id',
                        $sectorIds
                    );
                }
            );
        }

        /*
         * Require at least one matching country.
         */
        if ($countryIds !== []) {
            $query->whereHas(
                'countries',
                function (
                    $countryQuery
                ) use ($countryIds): void {
                    $countryQuery->whereKey(
                        $countryIds
                    );
                }
            );
        }

        /*
         * Apply the verified-company restriction only
         * when the investor selected it.
         *
         * This example assumes:
         *
         * companies.verification_status = "verified"
         *
         * Change this condition if your column is is_verified.
         */
        if (
            $preference
            ->verified_companies_only
        ) {
            $query->whereHas(
                'company',
                function ($companyQuery): void {
                    $companyQuery->where(
                        'verification_status',
                        'verified'
                    );
                }
            );
        }

        $opportunities = $query->get();

        /*
         * Calculate and store one match for each
         * eligible investment opportunity.
         */
        foreach (
            $opportunities as $opportunity
        ) {
            $scoreResult =
                $this->scoreOpportunity(
                    $preference,
                    $opportunity
                );

            InvestorCompanyMatch::updateOrCreate(
                [
                    'investor_preference_id' =>
                    $preference->getKey(),

                    'investment_opportunity_id' =>
                    $opportunity->getKey(),
                ],
                [
                    /*
                     * Stored internally but excluded
                     * from InvestorMatchResource.
                     */
                    'private_score' =>
                    $scoreResult['score'],

                    'match_band' =>
                    $scoreResult['band'],

                    'match_reasons' =>
                    $scoreResult['reasons'],

                    'calculated_at' => now(),
                ]
            );
        }

        /*
         * Return stored matches with all information
         * required by InvestorMatchResource.
         */
        return $preference
            ->matches()
            ->with([
                'opportunity.company',

                'opportunity.fundingInstruments:id,code,name',

                'opportunity.sectors:id,title',

                'opportunity.countries:id,country_name',
            ])
            ->orderByDesc('private_score')
            ->get();
    }

    /**
     * Score one company opportunity.
     *
     * Weight distribution:
     *
     * Ticket compatibility:       30
     * Sector compatibility:       25
     * Country compatibility:      20
     * Funding compatibility:      15
     * Starting-time compatibility: 5
     * Company verification:        5
     *
     * Total:                     100
     *
     * @return array{
     *     score: float,
     *     band: string,
     *     reasons: array<int, string>
     * }
     */
    private function scoreOpportunity(
        InvestorPreference $preference,
        InvestmentOpportunity $opportunity
    ): array {
        $ticketRatio =
            $this->numericRangeOverlapRatio(
                (float) $preference->ticket_min,
                (float) $preference->ticket_max,
                (float) $opportunity->amount_min,
                (float) $opportunity->amount_max
            );

        $timingRatio =
            $this->numericRangeOverlapRatio(
                (float) $preference
                    ->start_from_month,

                (float) $preference
                    ->start_to_month,

                (float) $opportunity
                    ->start_from_month,

                (float) $opportunity
                    ->start_to_month
            );

        $sectorRatio =
            $this->selectionOverlapRatio(
                $preference
                    ->sectors
                    ->pluck('id'),

                $opportunity
                    ->sectors
                    ->pluck('id')
            );

        $countryRatio =
            $this->selectionOverlapRatio(
                $preference
                    ->countries
                    ->pluck('id'),

                $opportunity
                    ->countries
                    ->pluck('id')
            );

        $fundingRatio =
            $this->selectionOverlapRatio(
                $preference
                    ->fundingInstruments
                    ->pluck('id'),

                $opportunity
                    ->fundingInstruments
                    ->pluck('id')
            );

        $companyIsVerified =
            $this->companyIsVerified(
                $opportunity->company
            );

        $score =
            ($ticketRatio * 30)
            + ($sectorRatio * 25)
            + ($countryRatio * 20)
            + ($fundingRatio * 15)
            + ($timingRatio * 5)
            + ($companyIsVerified ? 5 : 0);

        $score = round(
            min(100, max(0, $score)),
            2
        );

        $reasons = [];

        if ($ticketRatio > 0) {
            $reasons[] =
                'The company funding requirement overlaps your investment ticket range.';
        }

        if ($timingRatio > 0) {
            $reasons[] =
                'The company starting window overlaps your preferred timing.';
        }

        $matchingSectors = $opportunity
            ->sectors
            ->whereIn(
                'id',
                $preference
                    ->sectors
                    ->pluck('id')
            )
            ->pluck('title')
            ->take(4)
            ->values();

        if ($matchingSectors->isNotEmpty()) {
            $reasons[] =
                'Matching sectors: '
                . $matchingSectors->implode(', ')
                . '.';
        }

        $matchingCountries =
            $opportunity
            ->countries
            ->whereIn(
                'id',
                $preference
                    ->countries
                    ->pluck('id')
            )
            ->pluck('country_name')
            ->take(4)
            ->values();

        if (
            $matchingCountries->isNotEmpty()
        ) {
            $reasons[] =
                'Matching countries: '
                . $matchingCountries
                ->implode(', ')
                . '.';
        }

        $matchingFunding =
            $opportunity
            ->fundingInstruments
            ->whereIn(
                'id',
                $preference
                    ->fundingInstruments
                    ->pluck('id')
            )
            ->pluck('name')
            ->take(4)
            ->values();

        if ($matchingFunding->isNotEmpty()) {
            $reasons[] =
                'Matching funding instruments: '
                . $matchingFunding
                ->implode(', ')
                . '.';
        }

        if ($companyIsVerified) {
            $reasons[] =
                'The company has verified status.';
        }

        return [
            'score' => $score,

            'band' =>
            $this->scoreToBand($score),

            'reasons' => $reasons,
        ];
    }

    /**
     * Calculate the percentage of the investor range
     * covered by the opportunity range.
     */
    private function numericRangeOverlapRatio(
        float $preferredMin,
        float $preferredMax,
        float $opportunityMin,
        float $opportunityMax
    ): float {
        /*
         * Handle an exact preferred amount or month.
         */
        if ($preferredMin === $preferredMax) {
            return $preferredMin >=
                $opportunityMin
                && $preferredMin <=
                $opportunityMax
                ? 1.0
                : 0.0;
        }

        $overlapStart = max(
            $preferredMin,
            $opportunityMin
        );

        $overlapEnd = min(
            $preferredMax,
            $opportunityMax
        );

        $overlapLength = max(
            0,
            $overlapEnd - $overlapStart
        );

        $preferredLength = max(
            1,
            $preferredMax - $preferredMin
        );

        return min(
            1,
            $overlapLength / $preferredLength
        );
    }

    /**
     * Calculate how many investor selections are supported
     * by the opportunity.
     */
    private function selectionOverlapRatio(
        Collection $preferredIds,
        Collection $opportunityIds
    ): float {
        /*
         * Normalize numeric IDs and UUIDs into strings.
         */
        $preferredIds =
            $preferredIds
            ->map(
                fn($id) => (string) $id
            )
            ->unique()
            ->values();

        $opportunityIds =
            $opportunityIds
            ->map(
                fn($id) => (string) $id
            )
            ->unique()
            ->values();

        if ($preferredIds->isEmpty()) {
            return 1.0;
        }

        $matchingCount =
            $preferredIds
            ->intersect(
                $opportunityIds
            )
            ->count();

        return $matchingCount
            / $preferredIds->count();
    }

    /**
     * Support common company-verification column names.
     */
    private function companyIsVerified(
        ?Model $company
    ): bool {
        if (! $company) {
            return false;
        }

        return $company->getAttribute(
            'verification_status'
        ) === 'verified'
            || (bool) $company->getAttribute(
                'is_verified'
            )
            || (bool) $company->getAttribute(
                'verified'
            );
    }

    /**
     * Convert the private numeric score into a public band.
     */
    private function scoreToBand(
        float $score
    ): string {
        return match (true) {
            $score >= 90 =>
            'Excellent Match',

            $score >= 75 =>
            'Strong Match',

            $score >= 60 =>
            'Moderate Match',

            default =>
            'Limited Match',
        };
    }
}
