<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TransactionHistory extends Model
{
    //
    use HasFactory;
    protected $table = 'transaction_histories';

    protected  $gurded = [];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
