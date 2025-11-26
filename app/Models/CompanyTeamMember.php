<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class CompanyTeamMember extends Model
{
    //
    protected $guarded = [];

    protected $fillable = [
        'company_id',
        'full_name',
        'title',
        'role_type',
        'bio',
        'email',
        'linkedin_url',
        'ownership_percent',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
