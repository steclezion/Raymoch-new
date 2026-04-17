<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrganizationPipeline extends Model
{
    //
    protected $table = 'organization_pipelines';
    protected $guarded = [];

    public function organization()
    {
        return $this->belongsTo(Company::class);
    }
}
