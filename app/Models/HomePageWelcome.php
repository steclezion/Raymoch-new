<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomePageWelcome extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'first_picture', 'second_picture', 'status'];
}
