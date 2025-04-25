<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\companydescription;
use App\Models\CompanyClassification;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class companyinfos extends Model
{
    //
    use HasFactory;
    public $table = 'companyinfos';

    protected $fillable = [
        'company_title',
        'tagline',
        'first_picture',
        'second_picture',
        'third_picture',
        'status',
        'classification_id',
        'website',
        'founder_name',
        'location',
        'description',

    ];

    // If you have a relation to descriptions (like one-to-many)
    public function companydescription()
    {
        return $this->hasMany(companydescription::class);
    }


      // If you have a relation to descriptions (like one-to-many)

public function classification()
{
    return $this->belongsTo(CompanyClassification::class, 'classification_id');
}



}
