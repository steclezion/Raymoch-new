<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VerificationDocument extends Model
{
    //
    use HasFactory;
    protected $table = 'verification_documents';

    protected  $gurded = [];

    public function organizationVerification()
    {
        return $this->belongsTo(OrganizationVerification::class, 'organization_verification_id');
    }
}
