<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\CompanyFinancial;
use App\Models\CompanyTeamMember;
use App\Models\CompanyDocument;
use App\Models\CompanyLog;
use App\Models\CompanyContact;
use App\Models\CompanyGallery;
use App\Models\CompanyLocation;
use App\Models\CompanyReaction;


use App\Models\OrganizationProfile;
use App\Models\OrganizationLocation;
use App\Models\OrganizationOperatingCountry;
use App\Models\OrganizationCapability;
use App\Models\ProductService;
use App\Models\MatchPreference;
use App\Models\OrganizationNeed;
use App\Models\OrganizationInterestTag;
use App\Models\ProcurementRequest;
use App\Models\ProcurementBidSubmission;
use App\Models\DocumentAndMedia;
use App\Models\OrganizationVerification;
use App\Models\OrganizationMedia;
use App\Models\VerificationDocument;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\OrganizationReview;
use App\Models\OrganizationTestimonial;
use App\Models\TransactionHistory;
use App\Models\OrganizationTag;
use App\Models\Notification;
use App\Models\ActivityLog;
use App\Models\AuditLog;
use App\Models\SystemSetting;
use App\Models\ScoringRule;
use App\Models\User;

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
        'location_name',
        'latitude',
        'longitude',
    ];
    public function OrganizationMedias()
    {
        return $this->hasMany(OrganizationMedia::class, 'company_id');
    }

    public function OrganizationCtiScores()
    {
        return $this->hasMany(OrganizationCtiScore::class, 'company_id');
    }


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

    public function location()
    {
        return $this->hasOne(CompanyLocation::class);
    }
    public function reactions()
    {
        return $this->hasMany(CompanyReaction::class);
    }

    public function organizationProfile()
    {
        return $this->hasOne(OrganizationProfile::class, 'company_id');
    }
    public function organizationLocations()
    {
        return $this->hasMany(OrganizationLocation::class, 'company_id');
    }

    public function organizationOperatingCountries()
    {
        return $this->hasMany(OrganizationOperatingCountry::class, 'company_id');
    }

    public function organizationCapabilities()
    {
        return $this->hasMany(OrganizationCapability::class, 'company_id');
    }

    public function productServices()
    {
        return $this->hasMany(ProductService::class, 'company_id');
    }

    public function MatchPreference()
    {
        return $this->hasMany(MatchPreference::class, 'company_id');
    }


    public function organizationVerification()
    {
        return $this->hasMany(OrganizationVerification::class, 'company_id');
    }


    public function organizationNeeds()
    {
        return $this->hasMany(OrganizationNeed::class, 'company_id');
    }

    public function organizationInterestTags()
    {
        return $this->hasMany(OrganizationInterestTag::class, 'company_id');
    }

    public function matchPreferences()
    {
        return $this->hasOne(MatchPreference::class, 'company_id');
    }

    public function procurementRequests()
    {
        return $this->hasMany(ProcurementRequest::class, 'company_id');
    }

    public function procurementBidSubmissions()
    {
        return $this->hasMany(ProcurementBidSubmission::class, 'company_id');
    }

    public function documentsAndMedia()
    {
        return $this->hasMany(DocumentAndMedia::class, 'company_id');
    }

    public function verifications()
    {
        return $this->hasMany(OrganizationVerification::class, 'company_id');
    }

    public function media()
    {
        return $this->hasMany(OrganizationMedia::class, 'company_id');
    }

    public function verificationDocuments()
    {
        return $this->hasMany(VerificationDocument::class, 'company_id');
    }
    public function conversations()
    {
        return $this->hasMany(Conversation::class, 'company_id');
    }
    public function messages()
    {
        return $this->hasMany(Message::class, 'company_id');
    }

    public function reviews()
    {
        return $this->hasMany(OrganizationReview::class, 'company_id');
    }

    public function testimonials()
    {
        return $this->hasMany(OrganizationTestimonial::class, 'company_id');
    }

    public function transactionHistories()
    {
        return $this->hasMany(TransactionHistory::class, 'company_id');
    }

    public function tags()
    {
        return $this->hasMany(OrganizationTag::class, 'company_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'company_id');
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class, 'company_id');
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class, 'company_id');
    }
    public function OrganizationAtsScores()
    {
        return $this->hasMany(OrganizationAtsScore::class, 'company_id');
    }
}
