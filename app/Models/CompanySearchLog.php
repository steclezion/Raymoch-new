<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanySearchLog extends Model
{
    use HasFactory;

    protected $table = 'company_search_logs';

    protected $fillable = [
        'user_id',
        'session_id',
        'event',
        'q',
        'sector',
        'country',
        'verified',
        'page',
        'ip',
        'user_agent',
        'referer',
    ];

    protected $casts = [
        'verified' => 'boolean',
        'page'     => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
