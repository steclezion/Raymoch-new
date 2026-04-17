<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Stage extends Model
{
    //
    use HasFactory;
    protected $table = 'stages';
    protected $guarded = [];
    function companies()
    {
        return $this->hasMany(Company::class, 'stage_id');
    }
}
