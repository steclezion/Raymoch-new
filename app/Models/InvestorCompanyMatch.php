<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvestorCompanyMatch extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * Fields allowed during insertion and updates.
     */
    protected $fillable = [
        'investor_preference_id',
        'investment_opportunity_id',
        'private_score',
        'match_band',
        'match_reasons',
        'calculated_at',
    ];

    /**
     * Database-to-PHP type conversions.
     */
    protected function casts(): array
    {
        return [
            'private_score' => 'decimal:2',
            'match_reasons' => 'array',
            'calculated_at' => 'datetime',
        ];
    }

    /**
     * Investor preference that generated the match.
     */
    public function preference(): BelongsTo
    {
        return $this->belongsTo(
            InvestorPreference::class,
            'investor_preference_id'
        );
    }

    /**
     * Company opportunity matched to the investor.
     */
    public function opportunity(): BelongsTo
    {
        return $this->belongsTo(
            InvestmentOpportunity::class,
            'investment_opportunity_id'
        );
    }
}
