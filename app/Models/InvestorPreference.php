<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InvestorPreference extends Model
{
    use HasUuids;

    /**
     * This model uses UUID primary keys.
     */
    public $incrementing = false;

    /**
     * UUID values are stored as strings.
     */
    protected $keyType = 'string';

    /**
     * Fields allowed for mass assignment.
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
     * Convert database values into appropriate PHP types.
     */
    protected function casts(): array
    {
        return [
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
     * User who owns this preference.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'user_id'
        );
    }

    /**
     * Funding instruments selected by the investor.
     */
    public function fundingInstruments(): BelongsToMany
    {
        return $this->belongsToMany(
            FundingInstrument::class,

            // Pivot table
            'investor_preference_funding_instrument',

            // Pivot key referring to InvestorPreference
            'investor_preference_id',

            // Pivot key referring to FundingInstrument
            'funding_instrument_id'
        )->withTimestamps();
    }

    /**
     * Sectors selected by the investor.
     *
     * The inverse relationship in Sector.php must use:
     *
     * - investor_preference_business_sector
     * - business_sector_id
     * - investor_preference_id
     */
    public function sectors(): BelongsToMany
    {
        return $this->belongsToMany(
            Sector::class,

            // Pivot table
            'investor_preference_business_sector',

            // Pivot key referring to InvestorPreference
            'investor_preference_id',

            // Pivot key referring to Sector
            'business_sector_id'
        )->withTimestamps();
    }

    /**
     * African countries selected by the investor.
     *
     * Your CountryAfrican model indicates that the pivot
     * column is countries_africans_id, not country_id.
     */
    /**
     * African countries selected by the investor.
     */
    public function countries(): BelongsToMany
    {
        return $this->belongsToMany(
            CountryAfrican::class,

            // Pivot table
            'investor_preference_country',

            // Pivot column referring to InvestorPreference
            'investor_preference_id',

            // Pivot column referring to CountryAfrican
            'country_african_id'
        )->withTimestamps();
    }

    /**
     * Matching results generated for this preference.
     */
    public function matches(): HasMany
    {
        return $this->hasMany(
            InvestorCompanyMatch::class,
            'investor_preference_id'
        );
    }
}
