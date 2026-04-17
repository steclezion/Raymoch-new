<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CountryAfrican extends Model
{
    //
    use HasFactory;
    protected $table = 'countries_africans';
    protected $fillable = [
        'country_code',
        'country_name',
        'flag_icon',
    ];
}
