<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerificationType extends Model
{
    //
    protected $table = 'verification_types';
    protected $guarded = [];

    public function organizationVerification()
    {
        return $this->hasMany(OrganizationVerification::class, 'verification_type_id');
    }
}
