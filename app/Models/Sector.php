<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;


class Sector extends Model
{
    //
    use HasFactory;
    protected $table = 'sectors';
    protected $guarded = [];

    /**
     * Investor profiles interested in this sector.
     */
    /**
     * Investor preferences interested in this sector.
     */
    public function investorPreferences(): BelongsToMany
    {
        return $this->belongsToMany(
            InvestorPreference::class,
            'investor_preference_sector',
            'sector_id',
            'investor_preference_id'
        )->withTimestamps();
    }

    /**
     * Investment opportunities operating in this sector.
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
