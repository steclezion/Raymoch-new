<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProcurementRequest extends Model
{
    //
    use HasFactory;
    protected $table = 'procurement_requests';

    protected  $gurded = [];
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
