<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrganizationAtsScore extends Model
{
    //
    use HasFactory;
    protected $table = 'organization_ats_scores';
    protected $guarded = [];

    public function company()
    {
        return $this->belongsTo(Company::class, 'id');
    }

    public function trustDimension()
    {
        return $this->belongsTo(TrustDimension::class, 'trust_dimension_id');
    }
}
