<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductService extends Model
{
    //
    use HasFactory;
    protected $table = 'product_services';

    protected  $gurded = [];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
