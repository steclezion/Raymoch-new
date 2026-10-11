<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contacts extends Model
{
    protected $fillable = [
        'reference',
        'user_id',
        'name',
        'email',
        'organization',
        'topic',
        'subject',
        'message',
        'consent_given',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'consent_given' => 'boolean',
            'responded_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
