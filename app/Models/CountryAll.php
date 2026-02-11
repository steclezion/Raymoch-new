<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CountryAll extends Model
{
    protected $table = 'countries_all';

    protected $fillable = [
        'name',
        'tele_code',
        'country_code',
    ];
}
