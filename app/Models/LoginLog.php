<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoginLog extends Model
{
    protected $table = 'login_logs';

    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'logged_in_at',
        'logged_out_at',
    ];

    public $timestamps = false;

    protected $casts = [
        'logged_in_at' => 'datetime',
        'logged_out_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
