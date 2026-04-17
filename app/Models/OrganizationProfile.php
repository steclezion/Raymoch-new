<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class OrganizationProfile extends Model
{
    //
    use HasFactory;
    protected $table = 'organization_profiles';

    protected  $gurded = [];
    // protected $fillable = [
    //     'company_id',
    //     'mission',
    //     'vision_statement',
    //     'core_values',
    //     'history',
    //     'leadership_team',
    //     'awards_and_recognition',
    // ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
