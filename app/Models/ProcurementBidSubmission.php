<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProcurementBidSubmission extends Model
{
    //
    use HasFactory;
    protected $table = 'procurement_bid_submissions';

    protected  $gurded = [];
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
