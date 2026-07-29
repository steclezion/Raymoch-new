<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\CountryAll;
use App\Models\Sector;

class InvestorPreference extends Model
{
    use HasUuids;

    /**
     * The model uses a UUID rather than an auto-incrementing number.
     */
    public $incrementing = false;

    /**
     * UUID primary keys are strings.
     */
    protected $keyType = 'string';

    /**
     * Fields that may be mass assigned.
     */
    protected $fillable = [
        'user_id',
        'preference_name',
        'ticket_min',
        'ticket_max',
        'currency_code',
        'start_from_month',
        'start_to_month',
        'verified_companies_only',
        'minimum_cti_tier',
        'is_default',
        'is_active',
    ];

    /**
     * Convert database values into appropriate PHP values.
     */
    protected function casts(): array
    {
        return [
            // Keep money precise when stored and displayed.
            'ticket_min' => 'decimal:2',
            'ticket_max' => 'decimal:2',

            'start_from_month' => 'integer',
            'start_to_month' => 'integer',

            'verified_companies_only' => 'boolean',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * User who owns the preference.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Funding instruments selected by the investor.
     */
    public function fundingInstruments(): BelongsToMany
    {
        return $this->belongsToMany(
            FundingInstrument::class,
            'investor_preference_funding_instrument'
        );
    }

    /**
     * Business sectors selected by the investor.
     */
    public function sectors(): BelongsToMany
    {
        return $this->belongsToMany(
            Sector::class,
            'investor_preference_business_sector',
            'investor_preference_id',
            'business_sector_id'
        );
    }

    /**
     * Countries selected by the investor.
     */
    public function countries(): BelongsToMany
    {
        return $this->belongsToMany(
            CountryAfrican::class,
            'investor_preference_country',
            'investor_preference_id',
            'country_id'
        );
    }

    /**
     * Calculated matching results for this preference.
     */
    public function matches(): HasMany
    {
        return $this->hasMany(
            InvestorCompanyMatch::class,
            'investor_preference_id'
        );
    }
}
