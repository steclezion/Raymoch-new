<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrialRequest extends Model
{
    //

    protected $fillable = [
        'first_name',
        'last_name',
        'business_email',
        'phone',
        'company',
        'agree_privacy',
        'status',
        'ip',
        'user_agent'
    ];

    protected function casts(): array
    {
        return [
            'agree_privacy' => 'boolean',
            'code_expires_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }
}
