<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CompanyDocument extends Model
{
    //

    use HasFactory;
    protected $guarded = [];

    protected $fillable = [
        'company_id',
        'title',
        'document_type',
        'file_path',
        'mime_type',
        'is_public',
        'source',
        'as_of_date',
    ];



    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
