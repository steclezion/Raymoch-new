<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessModel extends Model
{
    use HasFactory;

    protected $table = 'businesses_model';

    protected $fillable = [
        'icon',
        'title',
        'description',
    ];
}
