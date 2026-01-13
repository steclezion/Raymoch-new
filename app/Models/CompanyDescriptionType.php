<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CompanyDescriptionType extends Model
{
    //
    use HasFactory;

    // Optional: Define the table name if it doesn't follow Laravel's plural naming rule
    protected $table = 'company_description_types';

    // Allow mass assignment for these fields
    protected $fillable = [
        'name',
        'description',
        'status',
    ];
}
