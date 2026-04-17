<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrganizationCapability extends Model
{
    //
    use HasFactory;
    protected $table = 'organization_capabilities';

    protected  $gurded = [];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
