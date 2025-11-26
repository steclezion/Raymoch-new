<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CompanyFinancial extends Model
{
    //php artisan make:factory CompanyFactory --model=Company
    use HasFactory;

    protected $guarded = [];

    protected $fillable = [
        'company_id',
        'fiscal_year',
        'currency',
        'revenue',
        'ebitda',
        'net_income',
        'total_assets',
        'total_liabilities',
        'valuation',
        'source',
        'as_of_date',
    ];




    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
