<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class HomeWelcomeSecondPage extends Model
{
    //

    use HasFactory;
    protected $fillable = [
        'title',
        'picture',
        'description_one',
        'description_two',
        'description_three',
        'status'
    ];
    
    protected $guard = ['id'];
}
