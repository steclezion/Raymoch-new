<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrganizationSize extends Model
{
    //
    public function matchPreferences()
    {
        return $this->hasMany(
            MatchPreference::class,
            'preferred_company_size_id'
        );
    }
}
