<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class CompanyGallery extends Model
{
    //
    use HasFactory;
    protected $guarded = [];

    protected $fillable = [
        'company_id',
        'image_url',
        'caption',
        'sort_order',
        'is_primary',
        'alt_text',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
