<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Company;

class MatchPreference extends Model
{
    //
    use HasFactory;
    protected $table = 'match_preferences';

    protected  $gurded = [];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function preferredCompanySize()
    {
        return $this->belongsTo(
            OrganizationSize::class,
            'preferred_company_size_id'
        );
    }
}
