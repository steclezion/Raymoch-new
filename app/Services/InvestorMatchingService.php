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
     * Save the investor preference and generate matching results.
     *
     * @param  array<string, mixed>  $data
     * @return array{
     *     preference: InvestorPreference,
     *     matches: Collection<int, InvestorCompanyMatch>
     * }
     */
    public function savePreferenceAndFindMatches(
        User $user,
        array $data
    ): array {
        /*
         * Save the preference and all pivot selections together.
         *
         * A database transaction ensures that Laravel does not save
         * only part of the preference when one operation fails.
         */
        $preference = DB::transaction(
            function () use ($user, $data): InvestorPreference {
                /*
                 * Retrieve the user's existing default preference.
                 *
                 * When none exists, create a new UUID-based model.
                 */
                $preference = InvestorPreference::query()
                    ->where('user_id', $user->getKey())
                    ->where('is_default', true)
                    ->first();

                if (! $preference) {
                    $preference = new InvestorPreference();
                    $preference->user()->associate($user);
                }

                /*
                 * Apply the main preference fields.
                 */
                $preference->fill([
                    'preference_name' =>
                    $data['preference_name']
                        ?? 'Default Investment Preference',

                    'ticket_min' => $data['ticket_min'],
                    'ticket_max' => $data['ticket_max'],

                    'currency_code' =>
                    strtoupper($data['currency_code']),

                    'start_from_month' =>
                    $data['start_from_month'],

                    'start_to_month' =>
                    $data['start_to_month'],

                    'verified_companies_only' =>
                    $data['verified_companies_only'],

                    'minimum_cti_tier' =>
                    $data['minimum_cti_tier'] ?? null,

                    'is_default' => $data['is_default'] ?? true,
                    'is_active' => true,
                ]);

                $preference->save();

                /*
                 * Make sure this is the user's only default preference.
                 */
                if ($preference->is_default) {
                    InvestorPreference::query()
                        ->where('user_id', $user->getKey())
                        ->where('id', '<>', $preference->getKey())
                        ->update(['is_default' => false]);
                }

                /*
                 * sync() inserts newly selected IDs, retains current
                 * selected IDs, and removes unselected IDs.
                 */
                $preference->fundingInstruments()->sync(
                    $data['funding_instrument_ids']
                );

                $preference->sectors()->sync(
                    $data['business_sector_ids']
                );

                $preference->countries()->sync(
                    $data['country_ids']
                );

                /*
                 * Load the selected relationships for matching.
                 */
                return $preference->load([
                    'fundingInstruments:id,code,name',
                    'sectors:id,name',
                    'countries:id,name',
                ]);
            },
            attempts: 3
        );

        /*
         * Run the matching query after the preference has been saved.
         */
        $matches = $this->calculateAndStoreMatches($preference);

        return [
            'preference' => $preference,
            'matches' => $matches,
        ];
    }

    /**
     * Find eligible opportunities, calculate scores,
     * and save matching results.
     *
     * @return Collection<int, InvestorCompanyMatch>
     */
    private function calculateAndStoreMatches(
        InvestorPreference $preference
    ): Collection {
        /*
         * Selected IDs from the investor preference.
         */
        $instrumentIds = $preference->fundingInstruments
            ->pluck('id')
            ->map(fn($id) => (int) $id)
            ->values();

        $sectorIds = $preference->sectors
            ->pluck('id')
            ->map(fn($id) => (int) $id)
            ->values();

        $countryIds = $preference->countries
            ->pluck('id')
            ->map(fn($id) => (int) $id)
            ->values();

        /*
         * Build the initial eligibility query.
         *
         * Only eligible opportunities move to the scoring stage.
         */
        $query = InvestmentOpportunity::query()
            ->with([
                'company',
                'fundingInstruments:id,code,name',
                'sectors:id,name',
                'countries:id,name',
            ])

            // Match only opportunities currently accepting investment.
            ->where('status', 'open')

            // Do not compare amounts from different currencies.
            ->where(
                'currency_code',
                $preference->currency_code
            )

            /*
             * Amount ranges overlap when:
             *
             * company minimum <= investor maximum
             * AND
             * company maximum >= investor minimum
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
             * Timing windows use the same range-overlap principle.
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
            );

        /*
         * Require at least one matching funding instrument.
         */
        if ($instrumentIds->isNotEmpty()) {
            $query->whereHas(
                'fundingInstruments',
                function ($instrumentQuery) use ($instrumentIds): void {
                    $instrumentQuery->whereIn(
                        'funding_instruments.id',
                        $instrumentIds
                    );
                }
            );
        }

        /*
         * Require at least one matching business sector.
         */
        if ($sectorIds->isNotEmpty()) {
            $query->whereHas(
                'sectors',
                function ($sectorQuery) use ($sectorIds): void {
                    $sectorQuery->whereIn(
                        'business_sectors.id',
                        $sectorIds
                    );
                }
            );
        }

        /*
         * Require at least one matching investment country.
         */
        if ($countryIds->isNotEmpty()) {
            $query->whereHas(
                'countries',
                function ($countryQuery) use ($countryIds): void {
                    $countryQuery->whereIn(
                        'countries.id',
                        $countryIds
                    );
                }
            );
        }

        /*
         * Adapt this line to your real company verification column.
         *
         * Current example assumes:
         * companies.verification_status = "verified"
         *
         * When your table uses is_verified, use:
         * ->where('is_verified', true)
         */
        if ($preference->verified_companies_only) {
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

        /*
         * Retrieve all candidates passing mandatory conditions.
         */
        $opportunities = $query->get();

        /*
         * Remove previous results when no opportunities remain eligible.
         */
        if ($opportunities->isEmpty()) {
            $preference->matches()->delete();

            return collect();
        }

        /*
         * Calculate and store one result for every eligible opportunity.
         */
        foreach ($opportunities as $opportunity) {
            $result = $this->scoreOpportunity(
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
                    'private_score' => $result['score'],
                    'match_band' => $result['band'],
                    'match_reasons' => $result['reasons'],
                    'calculated_at' => now(),
                ]
            );
        }

        /*
         * Remove results belonging to opportunities that no longer
         * satisfy the investor's latest preferences.
         */
        $currentOpportunityIds = $opportunities
            ->pluck('id')
            ->all();

        $preference->matches()
            ->whereNotIn(
                'investment_opportunity_id',
                $currentOpportunityIds
            )
            ->delete();

        /*
         * Return the strongest results first.
         */
        return $preference->matches()
            ->with([
                'opportunity.company',
                'opportunity.fundingInstruments:id,code,name',
                'opportunity.sectors:id,name',
                'opportunity.countries:id,name',
            ])
            ->orderByDesc('private_score')
            ->get();
    }

    /**
     * Calculate the internal score for one opportunity.
     *
     * Weight distribution:
     *
     * Ticket range       30 points
     * Sector match       25 points
     * Country match      20 points
     * Funding instrument 15 points
     * Timing window       5 points
     * Verification        5 points
     *
     * Total             100 points
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
        /*
         * Calculate how much of the investor's ticket range
         * overlaps the company's requested range.
         */
        $ticketRatio = $this->numericRangeOverlapRatio(
            (float) $preference->ticket_min,
            (float) $preference->ticket_max,
            (float) $opportunity->amount_min,
            (float) $opportunity->amount_max
        );

        /*
         * Calculate timing-window compatibility.
         */
        $timingRatio = $this->numericRangeOverlapRatio(
            (float) $preference->start_from_month,
            (float) $preference->start_to_month,
            (float) $opportunity->start_from_month,
            (float) $opportunity->start_to_month
        );

        /*
         * Calculate multi-select overlap percentages.
         */
        $sectorRatio = $this->selectionOverlapRatio(
            $preference->sectors->pluck('id'),
            $opportunity->sectors->pluck('id')
        );

        $countryRatio = $this->selectionOverlapRatio(
            $preference->countries->pluck('id'),
            $opportunity->countries->pluck('id')
        );

        $instrumentRatio = $this->selectionOverlapRatio(
            $preference->fundingInstruments->pluck('id'),
            $opportunity->fundingInstruments->pluck('id')
        );

        /*
         * Determine company verification using common field names.
         * Keep the field that matches your existing Company model.
         */
        $companyVerified = $this->companyIsVerified(
            $opportunity->company
        );

        /*
         * Calculate the private weighted score.
         */
        $score =
            ($ticketRatio * 30)
            + ($sectorRatio * 25)
            + ($countryRatio * 20)
            + ($instrumentRatio * 15)
            + ($timingRatio * 5)
            + ($companyVerified ? 5 : 0);

        $score = round(min(100, max(0, $score)), 2);

        /*
         * Build reasons visible to the investor.
         */
        $reasons = [];

        if ($ticketRatio > 0) {
            $reasons[] =
                'The company funding requirement overlaps your investment range.';
        }

        if ($timingRatio > 0) {
            $reasons[] =
                'The company start window matches your preferred timing.';
        }

        $matchedSectors = $opportunity->sectors
            ->whereIn(
                'id',
                $preference->sectors->pluck('id')
            )
            ->pluck('name')
            ->take(3)
            ->values();

        if ($matchedSectors->isNotEmpty()) {
            $reasons[] =
                'Matching sectors: '
                . $matchedSectors->implode(', ')
                . '.';
        }

        $matchedCountries = $opportunity->countries
            ->whereIn(
                'id',
                $preference->countries->pluck('id')
            )
            ->pluck('name')
            ->take(3)
            ->values();

        if ($matchedCountries->isNotEmpty()) {
            $reasons[] =
                'Matching countries: '
                . $matchedCountries->implode(', ')
                . '.';
        }

        $matchedInstruments = $opportunity->fundingInstruments
            ->whereIn(
                'id',
                $preference->fundingInstruments->pluck('id')
            )
            ->pluck('name')
            ->take(3)
            ->values();

        if ($matchedInstruments->isNotEmpty()) {
            $reasons[] =
                'Matching funding instruments: '
                . $matchedInstruments->implode(', ')
                . '.';
        }

        if ($companyVerified) {
            $reasons[] = 'The company is verified by Raymoch.';
        }

        return [
            'score' => $score,
            'band' => $this->scoreToBand($score),
            'reasons' => $reasons,
        ];
    }

    /**
     * Measure how much of the preferred range overlaps
     * the opportunity range.
     */
    private function numericRangeOverlapRatio(
        float $preferredMin,
        float $preferredMax,
        float $offeredMin,
        float $offeredMax
    ): float {
        /*
         * Handle a preference containing one exact value.
         *
         * Example:
         * investor ticket = exactly $25,000.
         */
        if ($preferredMin === $preferredMax) {
            return $preferredMin >= $offeredMin
                && $preferredMin <= $offeredMax
                ? 1.0
                : 0.0;
        }

        $overlapStart = max($preferredMin, $offeredMin);
        $overlapEnd = min($preferredMax, $offeredMax);

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
     * Calculate the percentage of selected values
     * that are supported by the opportunity.
     */
    private function selectionOverlapRatio(
        Collection $preferredIds,
        Collection $offeredIds
    ): float {
        $preferredIds = $preferredIds
            ->map(fn($id) => (string) $id)
            ->unique()
            ->values();

        $offeredIds = $offeredIds
            ->map(fn($id) => (string) $id)
            ->unique()
            ->values();

        /*
         * An empty preference imposes no restriction.
         */
        if ($preferredIds->isEmpty()) {
            return 1.0;
        }

        $matchedCount = $preferredIds
            ->intersect($offeredIds)
            ->count();

        return $matchedCount / $preferredIds->count();
    }

    /**
     * Determine whether the related company is verified.
     *
     * Remove unused alternatives after confirming the exact
     * verification column in your companies table.
     */
    private function companyIsVerified(?Model $company): bool
    {
        if (! $company) {
            return false;
        }

        return $company->getAttribute(
            'verification_status'
        ) === 'verified'
            || (bool) $company->getAttribute('is_verified')
            || (bool) $company->getAttribute('verified');
    }

    /**
     * Convert the private score into a public match band.
     */
    private function scoreToBand(float $score): string
    {
        return match (true) {
            $score >= 90 => 'Excellent Match',
            $score >= 75 => 'Strong Match',
            $score >= 60 => 'Moderate Match',
            default => 'Limited Match',
        };
    }
}
