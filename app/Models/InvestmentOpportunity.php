<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InvestmentOpportunity extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * Fields allowed during mass assignment.
     */
    protected $fillable = [
        'company_id',
        'title',
        'description',
        'amount_min',
        'amount_max',
        'currency_code',
        'start_from_month',
        'start_to_month',
        'status',
        'published_at',
        'closes_at',
    ];

    /**
     * Database-to-PHP type conversions.
     */
    protected function casts(): array
    {
        return [
            'amount_min' => 'decimal:2',
            'amount_max' => 'decimal:2',

            'start_from_month' => 'integer',
            'start_to_month' => 'integer',

            'published_at' => 'datetime',
            'closes_at' => 'datetime',
        ];
    }

    /**
     * Company that published this opportunity.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Funding instruments accepted by the company.
     */
    public function fundingInstruments(): BelongsToMany
    {
        return $this->belongsToMany(
            FundingInstrument::class,
            'investment_opportunity_funding_instrument'
        );
    }

    /**
     * Sectors associated with the opportunity.
     */
    public function sectors(): BelongsToMany
    {
        return $this->belongsToMany(
            Sector::class,
            'investment_opportunity_business_sector',
            'investment_opportunity_id',
            'business_sector_id'
        );
    }

    /**
     * Countries in which the project will operate.
     */
    public function countries(): BelongsToMany
    {
        return $this->belongsToMany(
            CountryAfrican::class,
            'investment_opportunity_country',
            'investment_opportunity_id',
            'country_id'
        );
    }

    /**
     * Investor matches calculated for this opportunity.
     */
    public function matches(): HasMany
    {
        return $this->hasMany(
            InvestorCompanyMatch::class,
            'investment_opportunity_id'
        );
    }
}
