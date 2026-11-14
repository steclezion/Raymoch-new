<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use Billable, HasRoles;

    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'password',
        'display_name',
        'phone',
        'company_name',
        'type_of_account',
        'is_active',
        'trial_ends_at',
        'deactivated_at',
        'avatar',
        'settings',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {

        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_secret' => 'encrypted',
            'two_factor_confirmed_at' => 'datetime',
            'two_factor_last_used_step' => 'integer',
            'settings' => 'array',
            'trial_ends_at' => 'datetime',
            'deactivated_at' => 'datetime',
        ];
    }

    public function industry()
    {
        return $this->hasMany(Industry::class);
    }

    public function investorPreferences(): HasMany
    {
        return $this->hasMany(
            InvestorPreference::class
        );
    }

    public function trialRequest(): HasOne
    {
        return $this->hasOne(TrialRequest::class, 'users_trail_request_id');
    }
}
