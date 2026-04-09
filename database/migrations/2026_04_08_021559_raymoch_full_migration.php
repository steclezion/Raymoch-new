<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
|--------------------------------------------------------------------------
| Core access-control tables
|--------------------------------------------------------------------------
*/

return new class extends Migration {


    public function up(): void
    {
        Schema::dropIfExists('scoring_rules');
        Schema::dropIfExists('system_settings');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('recommendation_logs');
        Schema::dropIfExists('search_logs');
        Schema::dropIfExists('organization_tags');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('transaction_histories');
        Schema::dropIfExists('organization_testimonials');
        Schema::dropIfExists('organization_reviews');
        Schema::dropIfExists('organization_media');
        Schema::dropIfExists('documents_and_media');
        Schema::dropIfExists('procurement_bid_submissions');
        Schema::dropIfExists('procurement_requests');
        Schema::dropIfExists('organization_pipelines');
        Schema::dropIfExists('pipeline_stages');
        Schema::dropIfExists('favorite_organizations');
        Schema::dropIfExists('saved_matches');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversation_participants');
        Schema::dropIfExists('conversations');
        Schema::dropIfExists('match_requests');
        Schema::dropIfExists('organization_cti_histories');
        Schema::dropIfExists('organization_cti_scores');
        Schema::dropIfExists('organization_ats_scores');
        Schema::dropIfExists('verification_documents');
        Schema::dropIfExists('organization_verifications');
        Schema::dropIfExists('match_feedback');
        Schema::dropIfExists('match_score_breakdowns');
        Schema::dropIfExists('matches');
        Schema::dropIfExists('match_preference_exclusions');
        Schema::dropIfExists('match_preference_capabilities');
        Schema::dropIfExists('match_preference_countries');
        Schema::dropIfExists('match_preference_industries');
        Schema::dropIfExists('match_preferences');
        Schema::dropIfExists('organization_interest_tags');
        Schema::dropIfExists('organization_needs');
        Schema::dropIfExists('product_services');
        Schema::dropIfExists('organization_capabilities');
        Schema::dropIfExists('organization_operating_countries');
        Schema::dropIfExists('organization_locations');
        Schema::dropIfExists('organization_profiles');
        Schema::dropIfExists('trust_dimensions');
        Schema::dropIfExists('verification_types');
        Schema::dropIfExists('capabilities');
        Schema::dropIfExists('annual_revenue_ranges');
        Schema::dropIfExists('stages');
        Schema::dropIfExists('organization_sizes');
        // Schema::dropIfExists('countries');
        Schema::dropIfExists('regions');


        // Schema::create('roles', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        //     $table->string('code')->unique();
        //     $table->text('description')->nullable();
        //     $table->timestamps();
        // });

        // Schema::create('permissions', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        //     $table->string('code')->unique();
        //     $table->text('description')->nullable();
        //     $table->timestamps();
        // });

        // Schema::create('role_user', function (Blueprint $table) {
        //     $table->id();
        //     $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        //     $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
        //     $table->timestamps();
        //     $table->unique(['user_id', 'role_id']);
        // });

        // Schema::create('permission_role', function (Blueprint $table) {
        //     $table->id();
        //     $table->foreignId('permission_id')->constrained('permissions')->cascadeOnDelete();
        //     $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
        //     $table->timestamps();
        //     $table->unique(['permission_id', 'role_id']);
        // });


        Schema::create('regions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Schema::create('countries', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        //     $table->string('iso2', 2)->unique();
        //     $table->string('iso3', 3)->unique();
        //     $table->string('phone_code')->nullable();
        //     $table->string('currency_code', 3)->nullable();
        //     $table->string('region')->nullable();
        //     $table->string('subregion')->nullable();
        //     $table->boolean('status')->default(true);
        //     $table->timestamps();
        // });

        Schema::create('organization_sizes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->integer('min_employees')->nullable();
            $table->integer('max_employees')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('stages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('annual_revenue_ranges', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->decimal('min_amount', 18, 2)->nullable();
            $table->decimal('max_amount', 18, 2)->nullable();
            $table->string('currency_code', 3)->default('USD');
            $table->timestamps();
        });

        Schema::create('capabilities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->enum('capability_type', ['product', 'service', 'technology', 'capacity', 'expertise']);
            $table->timestamps();
        });

        Schema::create('verification_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->decimal('weight', 5, 2)->default(1.00);
            $table->timestamps();
        });

        Schema::create('trust_dimensions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->decimal('default_weight', 5, 2)->default(1.00);
            $table->timestamps();
        });

        Schema::create('organization_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete()->unique();
            $table->text('mission')->nullable();
            $table->text('vision')->nullable();
            $table->longText('business_summary')->nullable();
            $table->unsignedBigInteger('primary_industry_id')->nullable();
            $table->unsignedBigInteger('secondary_industry_id')->nullable();
            $table->string('business_model')->nullable();
            $table->foreignId('stage_id')->nullable()->constrained('stages')->nullOnDelete();
            $table->date('founded_date')->nullable();
            $table->boolean('women_led')->default(false);
            $table->boolean('youth_led')->default(false);
            $table->boolean('export_ready')->default(false);
            $table->boolean('has_cross_border_operations')->default(false);
            $table->string('logo')->nullable();
            $table->string('cover_image')->nullable();
            $table->timestamps();
        });

        Schema::create('organization_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('country_id')->constrained('countries')->cascadeOnDelete();
            $table->foreignId('region_id')->nullable()->constrained('regions')->nullOnDelete();
            $table->string('city')->nullable();
            $table->string('address_line_1')->nullable();
            $table->string('address_line_2')->nullable();
            $table->string('postal_code')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->enum('location_type', ['head_office', 'branch', 'factory', 'warehouse', 'service_area']);
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });

        Schema::create('organization_operating_countries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('country_id')->constrained('countries')->cascadeOnDelete();
            $table->enum('market_role', ['origin', 'destination', 'operating', 'target']);
            $table->timestamps();
            $table->unique(['company_id', 'country_id', 'market_role'], 'org_country_market_role_unique');
        });

        Schema::create('organization_capabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('capability_id')->constrained('capabilities')->cascadeOnDelete();
            $table->text('description')->nullable();
            $table->decimal('capacity_value', 18, 2)->nullable();
            $table->string('capacity_unit')->nullable();
            $table->boolean('quality_certified')->default(false);
            $table->boolean('export_ready')->default(false);
            $table->timestamps();
        });

        Schema::create('product_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['product', 'service']);
            $table->string('name');
            $table->string('category')->nullable();
            $table->longText('description')->nullable();
            $table->unsignedBigInteger('industry_id')->nullable();
            $table->string('unit_of_measure')->nullable();
            $table->decimal('min_order_quantity', 18, 2)->nullable();
            $table->decimal('production_capacity', 18, 2)->nullable();
            $table->string('production_capacity_unit')->nullable();
            $table->decimal('price_range_min', 18, 2)->nullable();
            $table->decimal('price_range_max', 18, 2)->nullable();
            $table->string('currency_code', 3)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('organization_needs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->enum('need_type', ['supplier', 'buyer', 'investor', 'distributor', 'service_provider', 'technology_partner', 'market_access', 'procurement']);
            $table->string('title');
            $table->longText('description')->nullable();
            $table->unsignedBigInteger('industry_id')->nullable();
            $table->foreignId('country_id')->nullable()->constrained('countries')->nullOnDelete();
            $table->decimal('budget_min', 18, 2)->nullable();
            $table->decimal('budget_max', 18, 2)->nullable();
            $table->string('currency_code', 3)->nullable();
            $table->enum('urgency_level', ['low', 'medium', 'high'])->default('medium');
            $table->enum('status', ['open', 'matched', 'closed', 'draft'])->default('draft');
            $table->timestamps();
        });

        Schema::create('organization_interest_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('tag');
            $table->enum('tag_type', ['sector', 'market', 'product', 'service', 'goal', 'theme']);
            $table->timestamps();
        });

        Schema::create('match_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('seeking_investment')->default(false);
            $table->boolean('seeking_suppliers')->default(false);
            $table->boolean('seeking_buyers')->default(false);
            $table->boolean('seeking_distributors')->default(false);
            $table->boolean('seeking_service_providers')->default(false);
            $table->boolean('seeking_market_access')->default(false);
            $table->foreignId('preferred_company_size_id')->nullable()->constrained('organization_sizes')->nullOnDelete();
            $table->foreignId('preferred_stage_id')->nullable()->constrained('stages')->nullOnDelete();
            $table->decimal('preferred_min_cti_score', 6, 2)->nullable();
            $table->text('preferred_regions')->nullable();
            $table->text('preferred_languages')->nullable();
            $table->decimal('budget_min', 18, 2)->nullable();
            $table->decimal('budget_max', 18, 2)->nullable();
            $table->string('currency_code', 3)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('match_preference_industries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_preference_id')->constrained('match_preferences')->cascadeOnDelete();
            $table->unsignedBigInteger('industry_id');
            $table->decimal('weight', 5, 2)->default(1.00);
            $table->timestamps();
        });

        Schema::create('match_preference_countries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_preference_id')->constrained('match_preferences')->cascadeOnDelete();
            $table->foreignId('country_id')->constrained('countries')->cascadeOnDelete();
            $table->decimal('weight', 5, 2)->default(1.00);
            $table->timestamps();
        });

        Schema::create('match_preference_capabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_preference_id')->constrained('match_preferences')->cascadeOnDelete();
            $table->foreignId('capability_id')->constrained('capabilities')->cascadeOnDelete();
            $table->decimal('weight', 5, 2)->default(1.00);
            $table->timestamps();
        });

        Schema::create('match_preference_exclusions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_preference_id')->constrained('match_preferences')->cascadeOnDelete();
            $table->string('field_name');
            $table->string('field_value');
            $table->text('reason')->nullable();
            $table->timestamps();
        });

        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('source_company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('target_company_id')->constrained('companies')->cascadeOnDelete();
            $table->enum('match_type', ['buyer_supplier', 'investor_sme', 'partner_partner', 'service_provider_client', 'procurement']);
            $table->decimal('overall_score', 6, 2);
            $table->decimal('preference_score', 6, 2)->nullable();
            $table->decimal('industry_score', 6, 2)->nullable();
            $table->decimal('location_score', 6, 2)->nullable();
            $table->decimal('capacity_score', 6, 2)->nullable();
            $table->decimal('trust_score', 6, 2)->nullable();
            $table->text('explanation')->nullable();
            $table->enum('status', ['suggested', 'viewed', 'accepted', 'rejected', 'expired', 'connected'])->default('suggested');
            $table->enum('generated_by', ['system', 'manual', 'hybrid'])->default('system');
            $table->timestamp('generated_at');
            $table->timestamps();
        });

        Schema::create('match_score_breakdowns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_id')->constrained('matches')->cascadeOnDelete();
            $table->string('score_component');
            $table->decimal('raw_score', 8, 2);
            $table->decimal('weighted_score', 8, 2);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('match_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_id')->constrained('matches')->cascadeOnDelete();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->enum('feedback_type', ['like', 'dislike', 'shortlist', 'not_relevant', 'contacted']);
            $table->text('feedback_reason')->nullable();
            $table->timestamps();
        });

        Schema::create('organization_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('verification_type_id')->constrained('verification_types')->cascadeOnDelete();
            $table->enum('status', ['pending', 'approved', 'rejected', 'expired'])->default('pending');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->date('expiry_date')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('score', 6, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('verification_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_verification_id')->constrained('organization_verifications')->cascadeOnDelete();
            $table->string('document_type');
            $table->string('file_path');
            $table->string('original_name');
            $table->string('mime_type');
            $table->unsignedBigInteger('file_size')->nullable();
            $table->enum('status', ['uploaded', 'under_review', 'approved', 'rejected'])->default('uploaded');
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('organization_ats_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('trust_dimension_id')->constrained('trust_dimensions')->cascadeOnDelete();
            $table->decimal('score', 6, 2);
            $table->decimal('max_score', 6, 2)->default(100.00);
            $table->timestamp('calculated_at');
            $table->string('calculation_version')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('organization_cti_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->decimal('score', 6, 2);
            $table->enum('risk_level', ['low', 'medium', 'high']);
            $table->enum('confidence_level', ['low', 'medium', 'high']);
            $table->timestamp('calculated_at');
            $table->string('calculation_version')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('organization_cti_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->decimal('previous_score', 6, 2)->nullable();
            $table->decimal('new_score', 6, 2);
            $table->text('change_reason')->nullable();
            $table->timestamp('calculated_at');
            $table->timestamps();
        });

        Schema::create('match_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_id')->nullable()->constrained('matches')->nullOnDelete();
            $table->foreignId('requester_company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('target_company_id')->constrained('companies')->cascadeOnDelete();
            $table->text('message')->nullable();
            $table->enum('status', ['pending', 'accepted', 'declined', 'withdrawn'])->default('pending');
            $table->timestamps();
        });

        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_id')->nullable()->constrained('matches')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->timestamps();
        });

        Schema::create('conversation_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('conversations')->cascadeOnDelete();
            $table->foreignId('company_id')->nullable()->constrained('companies')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('conversations')->cascadeOnDelete();
            $table->foreignId('sender_user_id')->constrained('users')->cascadeOnDelete();
            $table->longText('message');
            $table->enum('message_type', ['text', 'file', 'system'])->default('text');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        Schema::create('saved_matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('match_id')->constrained('matches')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['company_id', 'match_id']);
        });

        Schema::create('favorite_organizations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('favorite_company_id')->constrained('companies')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(
                ['company_id', 'favorite_company_id'],
                'org_fav_unique'
            );
        });

        Schema::create('pipeline_stages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('organization_pipelines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('related_company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('pipeline_stage_id')->constrained('pipeline_stages')->cascadeOnDelete();
            $table->foreignId('owner_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('procurement_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('title');
            $table->longText('description')->nullable();
            $table->string('category')->nullable();
            $table->decimal('budget_min', 18, 2)->nullable();
            $table->decimal('budget_max', 18, 2)->nullable();
            $table->string('currency_code', 3)->nullable();
            $table->foreignId('country_id')->nullable()->constrained('countries')->nullOnDelete();
            $table->date('deadline')->nullable();
            $table->enum('status', ['draft', 'published', 'closed', 'awarded'])->default('draft');
            $table->timestamps();
        });

        Schema::create('procurement_bid_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('procurement_request_id')->constrained('procurement_requests')->cascadeOnDelete();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->longText('proposal_summary')->nullable();
            $table->decimal('amount', 18, 2)->nullable();
            $table->string('currency_code', 3)->nullable();
            $table->string('delivery_timeline')->nullable();
            $table->enum('status', ['submitted', 'shortlisted', 'rejected', 'awarded'])->default('submitted');
            $table->timestamps();
        });

        Schema::create('documents_and_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('document_type');
            $table->string('title');
            $table->string('file_path');
            $table->string('mime_type');
            $table->unsignedBigInteger('file_size')->nullable();
            $table->boolean('is_public')->default(false);
            $table->enum('status', ['active', 'archived'])->default('active');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('organization_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->enum('media_type', ['logo', 'cover', 'gallery', 'video']);
            $table->string('file_path');
            $table->string('caption')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('organization_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reviewer_company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('reviewed_company_id')->constrained('companies')->cascadeOnDelete();
            $table->decimal('rating', 3, 2);
            $table->text('review_text')->nullable();
            $table->enum('status', ['pending', 'published', 'hidden'])->default('pending');
            $table->timestamps();
        });

        Schema::create('organization_testimonials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('author_name');
            $table->string('author_title')->nullable();
            $table->string('author_organization')->nullable();
            $table->text('testimonial');
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamps();
        });

        Schema::create('transaction_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('counterparty_company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('transaction_type');
            $table->decimal('amount', 18, 2)->nullable();
            $table->string('currency_code', 3)->nullable();
            $table->enum('status', ['pending', 'completed', 'failed', 'cancelled'])->default('pending');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('tag_type')->nullable();
            $table->timestamps();
        });

        Schema::create('organization_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained('tags')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['company_id', 'tag_id']);
        });

        Schema::create('search_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained('companies')->nullOnDelete();
            $table->foreignId('tag_id')->nullable()->constrained('tags')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('recommendation_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('recommended_company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('recommendation_type');
            $table->decimal('score', 6, 2);
            $table->text('reason')->nullable();
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('body');
            $table->json('data')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->string('type');
            $table->morphs('notifiable');
            $table->timestamps();
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('company_id')->nullable()->constrained('companies')->nullOnDelete();
            $table->string('action');
            $table->string('entity_type');
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->json('meta')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('company_id')->nullable()->constrained('companies')->nullOnDelete();
            $table->string('action');
            $table->string('entity_type');
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->json('meta')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });

        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->longText('value')->nullable();
            $table->string('type')->nullable();
            $table->timestamps();
        });

        Schema::create('scoring_rules', function (Blueprint $table) {
            $table->id();
            $table->longText('rule_value');
            $table->string('rule_group', 100);
            $table->string('rule_key', 100);
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['rule_group', 'rule_key'], 'scoring_rules_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scoring_rules');
        Schema::dropIfExists('system_settings');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('recommendation_logs');
        Schema::dropIfExists('search_logs');
        Schema::dropIfExists('organization_tags');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('transaction_histories');
        Schema::dropIfExists('organization_testimonials');
        Schema::dropIfExists('organization_reviews');
        Schema::dropIfExists('organization_media');
        Schema::dropIfExists('documents_and_media');
        Schema::dropIfExists('procurement_bid_submissions');
        Schema::dropIfExists('procurement_requests');
        Schema::dropIfExists('organization_pipelines');
        Schema::dropIfExists('pipeline_stages');
        Schema::dropIfExists('favorite_organizations');
        Schema::dropIfExists('saved_matches');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversation_participants');
        Schema::dropIfExists('conversations');
        Schema::dropIfExists('match_requests');
        Schema::dropIfExists('organization_cti_histories');
        Schema::dropIfExists('organization_cti_scores');
        Schema::dropIfExists('organization_ats_scores');
        Schema::dropIfExists('verification_documents');
        Schema::dropIfExists('organization_verifications');
        Schema::dropIfExists('match_feedback');
        Schema::dropIfExists('match_score_breakdowns');
        Schema::dropIfExists('matches');
        Schema::dropIfExists('match_preference_exclusions');
        Schema::dropIfExists('match_preference_capabilities');
        Schema::dropIfExists('match_preference_countries');
        Schema::dropIfExists('match_preference_industries');
        Schema::dropIfExists('match_preferences');
        Schema::dropIfExists('organization_interest_tags');
        Schema::dropIfExists('organization_needs');
        Schema::dropIfExists('product_services');
        Schema::dropIfExists('organization_capabilities');
        Schema::dropIfExists('organization_operating_countries');
        Schema::dropIfExists('organization_locations');
        Schema::dropIfExists('organization_profiles');
        Schema::dropIfExists('trust_dimensions');
        Schema::dropIfExists('verification_types');
        Schema::dropIfExists('capabilities');
        Schema::dropIfExists('annual_revenue_ranges');
        Schema::dropIfExists('stages');
        Schema::dropIfExists('organization_sizes');
        // Schema::dropIfExists('countries');
        Schema::dropIfExists('regions');
        // Schema::dropIfExists('permission_role');
        // Schema::dropIfExists('role_user');
        // Schema::dropIfExists('permissions');
        // Schema::dropIfExists('roles');
    }
};
