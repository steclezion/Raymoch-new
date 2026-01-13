<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyLog extends Model
{
    //
    protected $fillable = [
        'company_id',
        'event_type',
        'tab',
        'session_id',
        'ip_address',
        'user_agent',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
