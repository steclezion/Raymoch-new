<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrganizationMedia extends Model
{
    //

    use HasFactory;
    protected $table = 'organization_media';

    protected  $gurded = [];
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
