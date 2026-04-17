<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrganizationLocation extends Model
{
    //
    use HasFactory;
    protected $table = 'organization_locations';

    protected  $gurded = [];


    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
