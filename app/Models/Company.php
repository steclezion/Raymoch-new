<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\CompanyFinancial;
use App\Models\CompanyTeamMember;
use App\Models\CompanyDocument;
use App\Models\CompanyLog;
use App\Models\CompanyContact;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'CompanyName',
        'Sector',
        'Country',
        'Region',
        'City',
        'FoundedYear',
        'Stage',
        'VerificationStatus',
        'VerificationStep',
        'CTI_Score',
        'CTI_Tier',
        'ProfileCompletenessPct',
        'Employees',
        'AnnualRevenueUSD',
        'TotalFundingUSD',
        'HasFinancials',
        'DiasporaOwned',
        'WomenLed',
        'YouthLed',
        'ListingBucket',
        'website',
        'Email',
        'Phone',
        'Description',
        'Employees_count',
        'Logo',
        'DataSourcesCount',
    ];
    public function financials()
    {
        return $this->hasMany(CompanyFinancial::class);
    }

    public function teamMembers()
    {
        return $this->hasMany(CompanyTeamMember::class);
    }

    public function documents()
    {
        return $this->hasMany(CompanyDocument::class);
    }

    public function galleries()
    {
        return $this->hasMany(CompanyGallery::class);
    }

    public function contacts()
    {
        return $this->hasMany(CompanyContact::class);
    }

    public function logs()
    {
        return $this->hasMany(CompanyLog::class);
    }
}
