<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvestorMatchResource extends JsonResource
{
    /**
     * Transform a matching record into public API data.
     *
     * The private_score field is intentionally excluded.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $opportunity = $this->opportunity;
        $company = $opportunity?->company;

        return [
            // Match identifier.
            'match_id' => $this->id,

            // Public band only; the numeric score remains private.
            'match_band' => $this->match_band,

            // Reasons explaining why the company matched.
            'match_reasons' => $this->match_reasons ?? [],

            'company' => [
                'id' => $company?->id,
                'name' => $company?->name,

                /*
                 * Adapt these values to the actual Company model.
                 */
                'verification_status' =>
                $company?->verification_status,

                'cti_tier' => $company?->cti_tier,
            ],

            'opportunity' => [
                'id' => $opportunity?->id,
                'title' => $opportunity?->title,
                'description' => $opportunity?->description,

                /*
                 * Money is returned as a precise decimal string.
                 */
                'amount_min' => $opportunity?->amount_min,
                'amount_max' => $opportunity?->amount_max,
                'currency_code' => $opportunity?->currency_code,

                'start_from_month' =>
                $opportunity?->start_from_month,

                'start_to_month' =>
                $opportunity?->start_to_month,

                'funding_instruments' =>
                $opportunity?->fundingInstruments
                    ?->map(fn($instrument) => [
                        'id' => $instrument->id,
                        'code' => $instrument->code,
                        'name' => $instrument->name,
                    ])
                    ->values(),

                'sectors' =>
                $opportunity?->sectors
                    ?->map(fn($sector) => [
                        'id' => $sector->id,
                        'name' => $sector->name,
                    ])
                    ->values(),

                'countries' =>
                $opportunity?->countries
                    ?->map(fn($country) => [
                        'id' => $country->id,
                        'name' => $country->name,
                    ])
                    ->values(),
            ],

            'calculated_at' =>
            $this->calculated_at?->toISOString(),
        ];
    }
}
