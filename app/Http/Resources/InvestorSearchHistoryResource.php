<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvestorSearchHistoryResource extends JsonResource
{
    /**
     * Convert a saved preference into history JSON.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'preference_name' =>
            $this->preference_name,

            'ticket_min' => $this->ticket_min,
            'ticket_max' => $this->ticket_max,

            'currency_code' =>
            $this->currency_code,

            'start_from_month' =>
            $this->start_from_month,

            'start_to_month' =>
            $this->start_to_month,

            'verified_companies_only' =>
            (bool) $this->verified_companies_only,

            /*
             * IDs are included so React can restore this
             * preference into the edit form.
             */
            'funding_instrument_ids' =>
            $this->fundingInstruments
                ->pluck('id')
                ->values(),

            'business_sector_ids' =>
            $this->sectors
                ->pluck('id')
                ->values(),

            'country_ids' =>
            $this->countries
                ->pluck('id')
                ->values(),

            /*
             * Names are included for displaying search history.
             */
            'funding_instruments' =>
            $this->fundingInstruments
                ->map(fn($instrument) => [
                    'id' => $instrument->id,
                    'code' => $instrument->code,
                    'name' => $instrument->name,
                ])
                ->values(),

            'sectors' =>
            $this->sectors
                ->map(fn($sector) => [
                    'id' => $sector->id,
                    'name' => $sector->name,
                ])
                ->values(),

            'countries' =>
            $this->countries
                ->map(fn($country) => [
                    'id' => $country->id,
                    'name' => $country->name,
                ])
                ->values(),

            'match_count' =>
            (int) ($this->matches_count ?? 0),

            // created_at represents when the search was performed.
            'searched_at' =>
            $this->created_at?->toISOString(),
        ];
    }
}
