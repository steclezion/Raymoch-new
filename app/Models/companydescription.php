<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\companyinfos;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CompanyDescription extends Model
{
    //
    public $table = 'company_descriptions';

    use HasFactory;

    protected $fillable = [

        'companyinfo_id',
        'description_type',
        'description',
    ];

    // public function companyinfo()
    // {
    //     return $this->belongsTo(companyinfos::class);
    // }

    public function companyinfos()
{
    return $this->belongsTo(companyinfos::class, 'companyinfo_id');

}

}
