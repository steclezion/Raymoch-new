<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FundingInstrument extends Model
{
    /**
     * Attributes allowed during create() and update().
     */
    protected $fillable = [
        'code',
        'name',
        'description',
        'is_active',
    ];

    /**
     * Convert database values to appropriate PHP values.
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Investor preference profiles using this instrument.
     */
    public function investorPreferences(): BelongsToMany
    {
        return $this->belongsToMany(
            InvestorPreference::class,
            'investor_preference_funding_instrument'
        );
    }

    /**
     * Company opportunities accepting this instrument.
     */
    public function investmentOpportunities(): BelongsToMany
    {
        return $this->belongsToMany(
            InvestmentOpportunity::class,
            'investment_opportunity_funding_instrument'
        );
    }
}
