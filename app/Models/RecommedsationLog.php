<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class RecommedsationLog extends Model
{
    //
    protected $table = 'recommendation_logs';
    protected $guarded = [];

    public function organization()
    {
        return $this->belongsTo(Company::class);
    }
}
