<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CountryAfrican extends Model
{
    //
    use HasFactory;
    protected $table = 'countries_africans';
    protected $fillable = [
        'country_code',
        'country_name',
        'flag_icon',
    ];
    /**
     * Investor profiles interested in this country.
     */
    public function investorPreferences(): BelongsToMany
    {
        return $this->belongsToMany(
            InvestorPreference::class,
            'investor_preference_country',
            'countries_africans_id',
            'investor_preference_id'
        );
    }

    /**
     * Investment opportunities operating in this country.
     */
    public function investmentOpportunities(): BelongsToMany
    {
        return $this->belongsToMany(
            InvestmentOpportunity::class,
            'investment_opportunity_country',
            'countries_africans_id',
            'investment_opportunity_id'
        );
    }
}
