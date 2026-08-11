<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CountryAfrican extends Model
{
    use HasFactory;

    /**
     * The actual database table.
     *
     * Laravel would otherwise infer:
     * country_africans
     */
    protected $table = 'countries_africans';

    protected $fillable = [
        'country_code',
        'country_name',
        'flag_icon',
    ];

    /**
     * Investor preferences that selected this country.
     */
    public function investorPreferences(): BelongsToMany
    {
        return $this->belongsToMany(
            InvestorPreference::class,

            // Pivot table
            'investor_preference_country',

            // Pivot column referring to InvestorPreference

            'investor_preference_id',
            // Pivot column referring to CountryAfrican
            'country_african_id'


        )->withTimestamps();
    }

    /**
     * Investment opportunities operating in this country.
     */
    public function investmentOpportunities(): BelongsToMany
    {
        return $this->belongsToMany(
            InvestmentOpportunity::class,

            // Pivot table
            'investment_opportunity_country',



            // Pivot column referring to InvestmentOpportunity
            'investment_opportunity_id',
              // Pivot column referring to CountryAfrican
            'country_african_id'
        )->withTimestamps();
    }
}
