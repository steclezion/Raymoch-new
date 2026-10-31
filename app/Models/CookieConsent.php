<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CookieConsent extends Model
{
    protected $fillable = [
        'user_id', 'anonymous_id', 'consent_version', 'ip_address_hash',
        'user_agent', 'accepted_at',
    ];

    protected function casts(): array
    {
        return ['accepted_at' => 'datetime'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function preferences(): HasMany
    {
        return $this->hasMany(CookieConsentPreference::class);
    }
}
