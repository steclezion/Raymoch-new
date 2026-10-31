<?php

namespace Tests\Feature;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class TrialRequestDuplicateTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => ':memory:',
        ]);

        DB::purge('sqlite');
        DB::reconnect('sqlite');

        Schema::create('trial_requests', function (Blueprint $table): void {
            $table->id();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('business_email');
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->boolean('agree_privacy')->default(false);
            $table->string('coupon')->nullable();
            $table->string('verification_code')->nullable();
            $table->timestamp('code_expires_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->string('status')->nullable();
            $table->string('ip')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
        });

        Schema::create('users', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('password');
            $table->timestamps();
        });
    }

    public function test_check_endpoint_reports_trial_request_email_and_phone_duplicates(): void
    {
        DB::table('trial_requests')->insert([
            'business_email' => 'trial@example.com',
            'phone' => '+1 555 100 2000',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->postJson('/api/trial-requests/check', [
            'email' => 'TRIAL@example.com',
            'phone' => '+1 555 100 2000',
        ])->assertOk()
            ->assertJsonPath('exists', true)
            ->assertJsonPath('errors.business_email.0', 'This email is already registered.')
            ->assertJsonPath('errors.phone.0', 'This phone number is already registered.');
    }

    public function test_check_endpoint_reports_user_email_and_phone_duplicates(): void
    {
        DB::table('users')->insert([
            'name' => 'Existing User',
            'email' => 'member@example.com',
            'phone' => '+1 555 300 4000',
            'password' => 'not-used-in-this-test',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->postJson('/api/trial-requests/check', [
            'email' => 'member@example.com',
            'phone' => '+1 555 300 4000',
        ])->assertOk()
            ->assertJsonPath('exists', true)
            ->assertJsonPath('errors.business_email.0', 'This email is already registered.')
            ->assertJsonPath('errors.phone.0', 'This phone number is already registered.');
    }

    public function test_submission_rechecks_duplicates_before_creating_a_request(): void
    {
        DB::table('users')->insert([
            'name' => 'Existing User',
            'email' => 'registered@example.com',
            'phone' => '+1 555 900 1000',
            'password' => 'not-used-in-this-test',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->postJson('/api/trial-requests', [
            'first_name' => 'Amara',
            'last_name' => 'Okafor',
            'business_email' => 'registered@example.com',
            'phone' => '+1 555 900 1000',
            'company' => 'Example Company',
            'agree_privacy' => true,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['business_email', 'phone'])
            ->assertJsonPath('errors.business_email.0', 'This email is already registered.')
            ->assertJsonPath('errors.phone.0', 'This phone number is already registered.');

        $this->assertDatabaseCount('trial_requests', 0);
    }

    public function test_coupon_verification_starts_a_trial_session_without_creating_a_user(): void
    {
        $trialId = DB::table('trial_requests')->insertGetId([
            'first_name' => 'Amara',
            'last_name' => 'Okafor',
            'business_email' => 'trial-only@example.com',
            'phone' => '+1 555 600 7000',
            'agree_privacy' => true,
            'coupon' => Hash::make('750964'),
            'code_expires_at' => now()->addMinutes(15),
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->postJson('/trial/verify-coupon', [
            'email' => 'trial-only@example.com',
            'coupon' => '750964',
        ])->assertOk()
            ->assertJsonPath('ok', true)
            ->assertJsonPath('redirect', url('/explore'))
            ->assertSessionHas('trial_access_id', $trialId);

        $this->assertDatabaseCount('users', 0);
        $this->assertDatabaseHas('trial_requests', [
            'id' => $trialId,
            'status' => 'verified',
        ]);
        $this->assertNotNull(DB::table('trial_requests')->where('id', $trialId)->value('trial_ends_at'));
    }
}
