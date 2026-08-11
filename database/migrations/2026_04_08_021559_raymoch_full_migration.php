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
        Schema::dropIfExists('organization_industries');
        Schema::dropIfExists('system_settings');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('activity_logs');
        // Schema::dropIfExists('notifications');
        //schema::dropIfExists('industries');
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
        Schema::dropIfExists('match_preference_countries_all');
        Schema::dropIfExists('match_preference_industries');
        Schema::dropIfExists('match_preferences');
        Schema::dropIfExists('organization_interest_tags');
        Schema::dropIfExists('organization_needs');
        Schema::dropIfExists('product_services');
        Schema::dropIfExists('organization_capabilities');
        Schema::dropIfExists('organization_operating_countries_all');
        Schema::dropIfExists('organization_locations');
        Schema::dropIfExists('organization_profiles');
        Schema::dropIfExists('trust_dimensions');
        Schema::dropIfExists('verification_types');
        Schema::dropIfExists('capabilities');
        Schema::dropIfExists('annual_revenue_ranges');
        Schema::dropIfExists('stages');
        Schema::dropIfExists('organization_sizes');
        // Schema::dropIfExists('countries_all');
        // Schema::dropIfExists('regions');


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


        // Schema::create('regions', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        //     $table->string('code')->unique();
        //     $table->text('description')->nullable();
        //     $table->timestamps();
        // });





        // Schema::create('countries_all', function (Blueprint $table) {
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

        Schema::create('organization_industries', function (Blueprint $table) {
            $table->id();

            $table->foreignId('company_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('sector_id')
                ->constrained('sectors')
                ->cascadeOnDelete();

            $table->boolean('is_primary')->default(false);

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
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete()->unique();
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
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('country_id')->constrained('countries_all')->cascadeOnDelete();
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

        Schema::create('organization_operating_countries_all', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('country_id')->constrained('countries_all')->cascadeOnDelete();
            $table->enum('market_role', ['origin', 'destination', 'operating', 'target']);
            $table->timestamps();
            $table->unique(['company_id', 'country_id', 'market_role'], 'org_country_market_role_unique');
        });

        Schema::create('organization_capabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
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
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->enum('type', ['product', 'service']);
            $table->string('name');
            $table->string('category')->nullable();
            $table->longText('description')->nullable();
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
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->enum('need_type', ['supplier', 'buyer', 'investor', 'distributor', 'service_provider', 'technology_partner', 'market_access', 'procurement']);
            $table->string('title');
            $table->longText('description')->nullable();
            $table->unsignedBigInteger('industry_id')->nullable();
            $table->foreignId('country_id')->nullable()->constrained('countries_all')->nullOnDelete();
            $table->decimal('budget_min', 18, 2)->nullable();
            $table->decimal('budget_max', 18, 2)->nullable();
            $table->string('currency_code', 3)->nullable();
            $table->enum('urgency_level', ['low', 'medium', 'high'])->default('medium');
            $table->enum('status', ['open', 'matched', 'closed', 'draft'])->default('draft');
            $table->timestamps();
        });

        Schema::create('organization_interest_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('tag');
            $table->enum('tag_type', ['sector', 'market', 'product', 'service', 'goal', 'theme']);
            $table->timestamps();
        });

        Schema::create('match_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
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

        Schema::create('match_preference_countries_all', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_preference_id')->constrained('match_preferences')->cascadeOnDelete();
            $table->foreignId('country_id')->constrained('countries_all')->cascadeOnDelete();
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
            $table->enum('status', ['pending', 'verified', 'rejected', 'expired'])->default('pending');
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
            $table->foreignId('country_id')->nullable()->constrained('countries_all')->nullOnDelete();
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

        // Schema::create('notifications', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('title');
        //     $table->text('body');
        //     $table->json('data')->nullable();
        //     $table->timestamp('read_at')->nullable();
        //     $table->string('type');
        //     $table->morphs('notifiable');
        //     $table->timestamps();
        // });

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
        Schema::dropIfExists('match_preference_countries_all');
        Schema::dropIfExists('match_preference_industries');
        Schema::dropIfExists('match_preferences');
        Schema::dropIfExists('organization_interest_tags');
        Schema::dropIfExists('organization_needs');
        Schema::dropIfExists('product_services');
        Schema::dropIfExists('organization_capabilities');
        Schema::dropIfExists('organization_operating_countries_all');
        Schema::dropIfExists('organization_locations');
        Schema::dropIfExists('organization_profiles');
        Schema::dropIfExists('trust_dimensions');
        Schema::dropIfExists('verification_types');
        Schema::dropIfExists('capabilities');
        Schema::dropIfExists('annual_revenue_ranges');
        Schema::dropIfExists('stages');
        Schema::dropIfExists('organization_sizes');
        // Schema::dropIfExists('countries_all');
        Schema::dropIfExists('regions');
        // Schema::dropIfExists('permission_role');
        // Schema::dropIfExists('role_user');
        // Schema::dropIfExists('permissions');
        // Schema::dropIfExists('roles');
    }
};





/*

1. Core platform concept

The software should answer these questions well:

Who is this business?
What does it want?
What can it offer?
In which countries_all/markets does it operate?
How trustworthy is it?
Which other businesses, investors, suppliers, buyers, or service providers match it?
What actions happened after a match?

So your database should support:

profiles
preferences
supply/demand
trust
matching
engagement
2. Main entity types

At minimum, your platform should support these entity types:

SME / business
investor
buyer
supplier
service provider
institution / partner / government agency
admin / analyst / verifier

You can model these with one organizations table plus subtype tables or classification tables.

3. Recommended core tables
A. Users and access
users
id
organization_id nullable
first_name
last_name
full_name
email unique
phone nullable
password
job_title nullable
avatar nullable
status enum('active','inactive','suspended','pending')
last_login_at nullable
email_verified_at nullable
phone_verified_at nullable
created_at
updated_at
roles
id
name
code unique
description nullable
created_at
updated_at

Examples:

super_admin
admin
analyst
verifier
company_owner
company_member
investor_user
partner_user
permissions
id
name
code unique
description nullable
created_at
updated_at
role_user
id
user_id
role_id
created_at
updated_at
permission_role
id
permission_id
role_id
created_at
updated_at
B. Organizations / companies
organizations

This is the main master table for any business or institution.

id
organization_type_id
legal_name
display_name
registration_number nullable
tax_id nullable
year_established nullable
website nullable
email nullable
phone nullable
description text nullable
tagline nullable
employee_count nullable
annual_revenue_range_id nullable
ownership_type nullable
is_sme boolean default true
status enum('draft','pending','active','suspended','archived')
created_by nullable
created_at
updated_at
organization_types
id
name
code unique
description nullable
created_at
updated_at

Examples:

sme
investor
supplier
buyer
service_provider
government_agency
ngo
accelerator
organization_profiles

Extended business profile.

id
organization_id unique
mission text nullable
vision text nullable
business_summary longtext nullable
primary_industry_id nullable
secondary_industry_id nullable
business_model nullable
stage_id nullable
founded_date nullable
women_led boolean default false
youth_led boolean default false
export_ready boolean default false
has_cross_border_operations boolean default false
logo nullable
cover_image nullable
created_at
updated_at
C. Geographic modeling
countries_all
id
name
iso2 unique
iso3 unique
phone_code nullable
currency_code nullable
region nullable
subregion nullable
status
created_at
updated_at
regions

Useful for East Africa, West Africa, Horn, SADC, etc.

id
name
code unique
description nullable
created_at
updated_at
organization_locations
id
organization_id
country_id
region_id nullable
city nullable
address_line_1 nullable
address_line_2 nullable
postal_code nullable
latitude nullable
longitude nullable
location_type enum('head_office','branch','factory','warehouse','service_area')
is_primary boolean default false
created_at
updated_at
organization_operating_countries_all
id
organization_id
country_id
market_role enum('origin','destination','operating','target')
created_at
updated_at
D. Industry and classification
industries
id
parent_id nullable
name
code unique
description nullable
created_at
updated_at

Examples:

agriculture
fintech
manufacturing
logistics
textile
renewable_energy
healthcare
organization_industries
id
organization_id
industry_id
is_primary boolean default false
created_at
updated_at



organization_sizes
id
name
code unique
min_employees nullable
max_employees nullable
description nullable
created_at
updated_at
stages
id
name
code unique
description nullable
created_at
updated_at

Examples:

startup
early_growth
growth
expansion
mature
annual_revenue_ranges
id
name
code unique
min_amount nullable
max_amount nullable
currency_code default 'USD'
created_at
updated_at
4. Supply, demand, and capability modeling

This is the heart of matching.

A. What the organization offers
capabilities
id
name
code unique
description nullable
capability_type enum('product','service','technology','capacity','expertise')
created_at
updated_at
organization_capabilities
id
organization_id
capability_id
description nullable
capacity_value nullable
capacity_unit nullable
quality_certified boolean default false
export_ready boolean default false
created_at
updated_at
products_services
id
organization_id
type enum('product','service')
name
category nullable
description longtext nullable
industry_id nullable
unit_of_measure nullable
min_order_quantity nullable
production_capacity nullable
production_capacity_unit nullable
price_range_min nullable
price_range_max nullable
currency_code nullable
is_active boolean default true
created_at
updated_at
B. What the organization wants
organization_needs
id
organization_id
need_type enum('supplier','buyer','investor','distributor','service_provider','technology_partner','market_access','procurement')
title
description longtext
industry_id nullable
country_id nullable
budget_min nullable
budget_max nullable
currency_code nullable
urgency_level enum('low','medium','high')
status enum('open','matched','closed','draft')
created_at
updated_at
organization_interest_tags
id
organization_id
tag
tag_type enum('sector','market','product','service','goal','theme')
created_at
updated_at
5. Preference and matching data model

This is what turns it into a preference engine.

A. Matching preferences
match_preferences

One record per organization or user.

id
organization_id
created_by nullable
seeking_investment boolean default false
seeking_suppliers boolean default false
seeking_buyers boolean default false
seeking_distributors boolean default false
seeking_service_providers boolean default false
seeking_market_access boolean default false
preferred_company_size_id nullable
preferred_stage_id nullable
preferred_min_cti_score nullable
preferred_regions text nullable
preferred_languages text nullable
budget_min nullable
budget_max nullable
currency_code nullable
is_active boolean default true
created_at
updated_at
match_preference_industries
id
match_preference_id
industry_id
weight decimal(5,2) default 1.00
created_at
updated_at
match_preference_countries_all
id
match_preference_id
country_id
priority_level enum('low','medium','high')
created_at
updated_at
match_preference_capabilities
id
match_preference_id
capability_id
weight decimal(5,2) default 1.00
created_at
updated_at
match_preference_exclusions
id
match_preference_id
field_name
field_value
reason nullable
created_at
updated_at

Examples:

exclude country
exclude sector
exclude organization type
exclude risk category
B. Matching engine output
matches

This stores generated matches.

id
source_organization_id
target_organization_id
match_type enum('buyer_supplier','investor_sme','partner_partner','service_provider_client','procurement')
overall_score decimal(6,2)
preference_score decimal(6,2) nullable
industry_score decimal(6,2) nullable
location_score decimal(6,2) nullable
capacity_score decimal(6,2) nullable
trust_score decimal(6,2) nullable
explanation text nullable
status enum('suggested','viewed','accepted','rejected','expired','connected')
generated_by enum('system','manual','hybrid')
generated_at
created_at
updated_at
match_score_breakdowns
id
match_id
score_component
raw_score decimal(8,2)
weighted_score decimal(8,2)
notes nullable
created_at
updated_at

Examples:

sector_fit
country_fit
trust_fit
size_fit
supply_demand_fit
match_feedback
id
match_id
organization_id
feedback_type enum('like','dislike','shortlist','not_relevant','contacted')
feedback_reason nullable
created_at
updated_at
6. Trust, ATS, and CTI data model

Since you asked before about ATS and CTI, this should be built in from day one.

A. Verification
verification_types
id
name
code unique
description nullable
weight decimal(5,2) default 1.00
created_at
updated_at

Examples:

business_registration
tax_verification
identity_verification
bank_verification
address_verification
certification_verification
legal_compliance
organization_verifications
id
organization_id
verification_type_id
status enum('pending','approved','rejected','expired')
submitted_at nullable
verified_at nullable
verified_by nullable
expiry_date nullable
notes text nullable
score decimal(6,2) nullable
created_at
updated_at
verification_documents
id
organization_verification_id
document_type
file_path
original_name
mime_type
file_size nullable
status enum('uploaded','under_review','approved','rejected')
uploaded_by nullable
created_at
updated_at
B. ATS scores
trust_dimensions

These are your ATS categories.

id
name
code unique
description nullable
default_weight decimal(5,2) default 1.00
created_at
updated_at

Examples:

identity_ats
compliance_ats
reputation_ats
transaction_ats
responsiveness_ats
capacity_ats
document_quality_ats
organization_ats_scores
id
organization_id
trust_dimension_id
score decimal(6,2)
max_score decimal(6,2) default 100.00
calculated_at
calculation_version nullable
notes text nullable
created_at
updated_at
C. CTI score
organization_cti_scores
id
organization_id
score decimal(6,2)
risk_level enum('low','medium','high')
confidence_level enum('low','medium','high')
calculated_at
calculation_version nullable
notes text nullable
created_at
updated_at
organization_cti_histories
id
organization_id
previous_score decimal(6,2)
new_score decimal(6,2)
change_reason nullable
calculated_at
created_at
updated_at

This lets you track how trust changes over time.

7. Interaction and workflow
A. Interests and contact
match_requests
id
match_id nullable
requester_organization_id
target_organization_id
message text nullable
status enum('pending','accepted','declined','withdrawn')
created_at
updated_at
conversations
id
match_id nullable
created_by
status enum('open','closed')
created_at
updated_at
conversation_participants
id
conversation_id
user_id
organization_id nullable
created_at
updated_at
messages
id
conversation_id
sender_user_id
message longtext
message_type enum('text','file','system')
read_at nullable
created_at
updated_at
B. Shortlists and saved items
saved_matches
id
organization_id
match_id
created_at
updated_at
favorite_organizations
id
organization_id
favorite_organization_id
created_at
updated_at
C. Workflow / pipeline
pipeline_stages
id
name
code unique
sort_order
created_at
updated_at

Examples:

discovered
shortlisted
contacted
qualified
negotiating
approved
onboarded
organization_pipelines
id
organization_id
related_organization_id
pipeline_stage_id
owner_user_id nullable
notes text nullable
created_at
updated_at
8. Procurement-specific tables

If the system also supports procurement workflows:

procurement_requests
id
organization_id
title
description longtext
category nullable
budget_min nullable
budget_max nullable
currency_code nullable
country_id nullable
deadline nullable
status enum('draft','published','closed','awarded')
created_at
updated_at
procurement_bid_submissions
id
procurement_request_id
organization_id
proposal_summary longtext nullable
amount nullable
currency_code nullable
delivery_timeline nullable
status enum('submitted','shortlisted','rejected','awarded')
created_at
updated_at
9. Documents and media
organization_documents
id
organization_id
document_type
title
file_path
mime_type
file_size nullable
is_public boolean default false
status enum('active','archived')
created_by nullable
created_at
updated_at
organization_media
id
organization_id
media_type enum('logo','cover','gallery','video')
file_path
caption nullable
sort_order default 0
created_at
updated_at
10. Reviews, reputation, and evidence
organization_reviews
id
reviewer_organization_id
reviewed_organization_id
rating decimal(3,2)
review_text text nullable
status enum('pending','published','hidden')
created_at
updated_at
organization_testimonials
id
organization_id
author_name
author_title nullable
author_organization nullable
testimonial text
status enum('draft','published')
created_at
updated_at
transaction_histories

If you want trust from completed deals.

id
organization_id
counterparty_organization_id
transaction_type
amount nullable
currency_code nullable
status enum('pending','completed','failed','cancelled')
completed_at nullable
created_at
updated_at
11. Search and recommendation support
tags
id
name
slug unique
tag_type nullable
created_at
updated_at
organization_tags
id
organization_id
tag_id
created_at
updated_at
search_logs
id
user_id nullable
organization_id nullable
query text
filters json nullable
results_count nullable
created_at
updated_at
recommendation_logs
id
organization_id
recommended_organization_id
recommendation_type
score decimal(6,2)
reason text nullable
created_at
updated_at
12. Notifications and activity
notifications
id
user_id
type
title
body text
data json nullable
read_at nullable
created_at
updated_at
activity_logs
id
user_id nullable
organization_id nullable
action
entity_type
entity_id nullable
meta json nullable
ip_address nullable
user_agent nullable
created_at
updated_at
audit_logs
id
actor_user_id nullable
action
table_name
record_id
old_values json nullable
new_values json nullable
created_at
updated_at
13. Admin and configuration
system_settings
id
key unique
value longtext nullable
type nullable
created_at
updated_at
scoring_rules

Used to change CTI/matching weights without code changes.

id
rule_group
rule_key
rule_value
description nullable
is_active boolean default true
created_at
updated_at
14. Minimum viable version vs full version
MVP tables to start immediately

If you want to launch fast, start with:

users
roles
organizations
organization_profiles
countries_all
industries
organization_industries
organization_locations
products_services
organization_needs
match_preferences
matches
verification_types
organization_verifications
organization_ats_scores
organization_cti_scores
conversations
messages
notifications

That is enough to build:

onboarding
profile creation
trust/verification
matchmaking
contact flow
Full platform later

Then add:

procurement tables
reviews/testimonials
recommendation logs
audit logs
transaction histories
advanced scoring rules
analytics
15. Matching logic design

A practical first version of the scoring engine:

overall_match_score =
  30% sector/industry fit
+ 20% country/market fit
+ 15% organization type fit
+ 10% stage/size fit
+ 15% need-capability fit
+ 10% CTI trust score

Then later:

CTI =
  25% verification ATS
+ 20% compliance ATS
+ 15% reputation ATS
+ 15% transaction ATS
+ 10% responsiveness ATS
+ 15% capacity ATS
16. Suggested Laravel module structure

For Laravel, break the project into these domains:

Auth
Users
Organizations
Profiles
Preferences
Matching
Verification
Trust Scoring
Messaging
Procurement
Analytics
Admin

This keeps the codebase maintainable.

17. Recommended build order
Phase 1
auth and roles
organization onboarding
company profiles
industries/countries_all
needs and capabilities
Phase 2
preferences
matching engine
shortlist/contact
notifications
Phase 3
verification document upload
ATS + CTI scoring
admin review dashboard
Phase 4
procurement workflows
reviews and evidence
analytics and ranking
18. Best answer to your task question

If someone asks, “How do we create a software for preference and matching for companies/SMEs in Africa?”, a strong answer is:

Start by modeling the platform around organizations, users, profiles, preferences, needs, capabilities, trust, and matches. The database should capture who the business is, what markets it operates in, what it offers, what it needs, and how trustworthy it is. Then build a matching engine that combines preference fit, supply-demand fit, geography, sector alignment, and trust scores such as ATS and CTI. Around that core, add messaging, verification, notifications, and workflow tracking so that matches become real business opportunities rather than just recommendations.

19. Practical first schema set

If you want the most realistic first database batch, create these first:

users
roles
organizations
organization_profiles
organization_locations
industries
organization_industries
products_services
organization_needs
match_preferences
matches
verification_types
organization_verifications
organization_ats_scores
organization_cti_scores
conversations
messages
notifications

That is the strongest starting point.

I can turn this next into a full Laravel migration plan with migration filenames, foreign keys, and model relationships.





*/