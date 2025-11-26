<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CompanyContact extends Model
{
    //

    protected $guarded = [];


    protected $fillable = [
        'company_id',
        'contact_name',
        'role',
        'email',
        'phone',
        'website',
        'linkedin_url',
        'address_line1',
        'address_line2',
        'city',
        'state',
        'postal_code',
        'country',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
