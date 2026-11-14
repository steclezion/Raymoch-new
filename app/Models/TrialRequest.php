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
        'country',
        'country_code',
        'phone',
        'company',
        'agree_privacy',
        'coupon',
        'status',
        'trial_ends_at',
        'verification_code',
        'code_expires_at',
        'verified_at',
        'users_trail_request_id',
        'ip',
        'user_agent',
    ];

    protected $hidden = [
        'coupon',
        'verification_code',
    ];

    protected function casts(): array
    {
        return [
            'agree_privacy' => 'boolean',
            'code_expires_at' => 'datetime',
            'verified_at' => 'datetime',
            'trial_ends_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'users_trail_request_id');
    }
}
