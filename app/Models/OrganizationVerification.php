<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrganizationVerification extends Model
{
    //
    use HasFactory;
    protected $table = 'organization_verifications';

    protected  $gurded = [];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
    public function verificationType()
    {
        return $this->belongsTo(VerificationType::class, 'id');
    }
    public function VerificationDocuments()
    {
        return $this->hasMany(VerificationDocument::class, 'organization_verification_id');
    }
}
