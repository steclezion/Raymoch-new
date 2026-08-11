<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Sector extends Model
{
    use HasFactory;

    protected $table = 'sectors';

    protected $guarded = [];

    /**
     * Investor preferences interested in this sector.
     */
    public function investorPreferences(): BelongsToMany
    {
        return $this->belongsToMany(
            InvestorPreference::class,

            // Must match InvestorPreference::sectors()
            'investor_preference_business_sector',

            // Pivot key referring to Sector
            'business_sector_id',

            // Pivot key referring to InvestorPreference
            'investor_preference_id'
        )->withTimestamps();
    }

    /**
     * Investment opportunities operating in this sector.
     *
     * This is correct only when the pivot table contains:
     *
     * - sector_id
     * - investment_opportunity_id
     */
    public function investmentOpportunities(): BelongsToMany
    {
        return $this->belongsToMany(
            InvestmentOpportunity::class,
            'investment_opportunity_sector',
            'sector_id',
            'investment_opportunity_id'
        )->withTimestamps();
    }
}
