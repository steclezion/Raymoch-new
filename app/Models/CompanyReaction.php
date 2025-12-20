<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyReaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'user_id',
        'reaction_type',
        'comment',
        'session_id',
        'ip_address',
        'user_agent',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
