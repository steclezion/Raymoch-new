<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyClassification extends Model
{
    use HasFactory;

    // Optional: define table name if it doesn't match Laravel's convention
    protected $table = 'company_classifications';

    // Allow mass assignment
    protected $fillable = [
        'industry',
        'business_type',
        'description',
        'status',
    ];
}
