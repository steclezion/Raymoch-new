<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Company;

class OrganizationCtiScore extends Model
{
    //
    use HasFactory;
    protected $table = 'organization_cti_scores';
    protected $guarded = [];
    public function company()
    {
        return $this->belongsTo(Company::class, 'id');
    }
}
