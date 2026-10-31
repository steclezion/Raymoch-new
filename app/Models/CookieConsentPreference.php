<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CookieConsentPreference extends Model
{
    protected $fillable = ['category', 'enabled'];

    protected function casts(): array
    {
        return ['enabled' => 'boolean'];
    }

    public function consent(): BelongsTo
    {
        return $this->belongsTo(CookieConsent::class, 'cookie_consent_id');
    }
}
