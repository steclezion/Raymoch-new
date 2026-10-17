<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the matching-engine tables from the supplied MySQL schema.
     * Requires the external referenced tables to exist first (see matching_engine.sql).
     * Target: MySQL 8.0+.
     */
    public function up(): void
    {
        // founders
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `founders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `account_type_id` bigint unsigned DEFAULT NULL,
  `status` enum('active','inactive','pending') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `founders_user_id_index` (`user_id`),
  KEY `founders_account_type_id_index` (`account_type_id`),
  CONSTRAINT `founders_account_type_id_foreign` FOREIGN KEY (`account_type_id`) REFERENCES `account_type` (`id`),
  CONSTRAINT `founders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1007 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // investors
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `investors` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `investor_class` enum('individual_personal','business_corporate','institutional') COLLATE utf8mb4_unicode_ci NOT NULL,
  `investor_subtype` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_type_id` bigint unsigned DEFAULT NULL,
  `ticket_min` decimal(20,2) DEFAULT NULL,
  `ticket_max` decimal(20,2) DEFAULT NULL,
  `ticket_currency_id` bigint unsigned DEFAULT NULL,
  `investment_objective` text COLLATE utf8mb4_unicode_ci,
  `investment_mandate` text COLLATE utf8mb4_unicode_ci,
  `investment_strategy` text COLLATE utf8mb4_unicode_ci,
  `investment_restrictions` text COLLATE utf8mb4_unicode_ci,
  `verified_companies_only` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('active','inactive','pending') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `investors_user_id_index` (`user_id`),
  KEY `investors_account_type_id_index` (`account_type_id`),
  KEY `fk_investors_ticket_currency` (`ticket_currency_id`),
  CONSTRAINT `fk_investors_ticket_currency` FOREIGN KEY (`ticket_currency_id`) REFERENCES `ticket_currency` (`id`),
  CONSTRAINT `investors_account_type_id_foreign` FOREIGN KEY (`account_type_id`) REFERENCES `account_type` (`id`),
  CONSTRAINT `investors_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `chk_investors_ticket_max_positive` CHECK (((`ticket_max` is null) or (`ticket_max` > 0))),
  CONSTRAINT `chk_investors_ticket_min_positive` CHECK (((`ticket_min` is null) or (`ticket_min` > 0))),
  CONSTRAINT `chk_investors_ticket_range` CHECK (((`ticket_min` is null) or (`ticket_max` is null) or (`ticket_min` <= `ticket_max`))),
  CONSTRAINT `chk_investors_verified_companies_only` CHECK ((`verified_companies_only` in (0,1)))
) ENGINE=InnoDB AUTO_INCREMENT=3009 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // matching_marketplace_synthetic_batches
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `matching_marketplace_synthetic_batches` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `batch_code` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `random_seed` bigint unsigned NOT NULL,
  `profiles_per_class` int unsigned NOT NULL,
  `generator_version` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_mm_synth_batch_code` (`batch_code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // matching_simulation_batches
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `matching_simulation_batches` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `batch_code` varchar(96) COLLATE utf8mb4_unicode_ci NOT NULL,
  `random_seed` bigint DEFAULT NULL,
  `target_population` int unsigned DEFAULT NULL,
  `status` enum('prepared','loaded','verified','retired') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'prepared',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_matching_simulation_batch_code` (`batch_code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // predictive_model_registries
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `predictive_model_registries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `registry_version` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_predictive_registry_version` (`registry_version`),
  CONSTRAINT `predictive_model_registries_chk_1` CHECK ((char_length(trim(`registry_version`)) > 0))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // investor_funding_instruments
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `investor_funding_instruments` (
  `investor_id` bigint unsigned NOT NULL,
  `funding_instrument_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`investor_id`,`funding_instrument_id`),
  KEY `fk_investor_funding_instruments_instrument` (`funding_instrument_id`),
  CONSTRAINT `fk_investor_funding_instruments_instrument` FOREIGN KEY (`funding_instrument_id`) REFERENCES `funding_instruments` (`id`),
  CONSTRAINT `fk_investor_funding_instruments_investor` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // investor_preferred_investment_stages
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `investor_preferred_investment_stages` (
  `investor_id` bigint unsigned NOT NULL,
  `preferred_investment_stage_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`investor_id`,`preferred_investment_stage_id`),
  KEY `fk_inv_pref_investment_stage_stage` (`preferred_investment_stage_id`),
  CONSTRAINT `fk_inv_pref_investment_stage_investor` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`id`),
  CONSTRAINT `fk_inv_pref_investment_stage_stage` FOREIGN KEY (`preferred_investment_stage_id`) REFERENCES `prefered_investment_stages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // investor_profile_metrics
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `investor_profile_metrics` (
  `investor_id` bigint unsigned NOT NULL,
  `metric_code` varchar(96) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metric_value` decimal(8,4) DEFAULT NULL,
  `metric_state` enum('AVAILABLE','UNAVAILABLE','UNRESOLVED','N/A') COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_type` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_reference` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `method_version` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `policy_version` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scale_version` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `effective_at` timestamp NULL DEFAULT NULL,
  `calculated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`investor_id`,`metric_code`),
  CONSTRAINT `fk_investor_profile_metrics_investor` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`id`),
  CONSTRAINT `chk_investor_profile_metric_range` CHECK (((`metric_value` is null) or ((`metric_value` >= 0) and (`metric_value` <= 100)))),
  CONSTRAINT `chk_investor_profile_metric_state_value` CHECK ((((`metric_state` = _utf8mb4'AVAILABLE') and (`metric_value` is not null)) or ((`metric_state` <> _utf8mb4'AVAILABLE') and (`metric_value` is null))))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // investor_sectors
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `investor_sectors` (
  `investor_id` bigint unsigned NOT NULL,
  `sector_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`investor_id`,`sector_id`),
  KEY `fk_investor_sectors_sector` (`sector_id`),
  CONSTRAINT `fk_investor_sectors_investor` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`id`),
  CONSTRAINT `fk_investor_sectors_sector` FOREIGN KEY (`sector_id`) REFERENCES `sectors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // investor_supported_objectives
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `investor_supported_objectives` (
  `investor_id` bigint unsigned NOT NULL,
  `objective_id` bigint unsigned NOT NULL,
  `objective_source` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'explicit_selection',
  `source_field` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objective_taxonomy_version` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'funding-objective-v1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`investor_id`,`objective_id`),
  KEY `fk_investor_supported_objectives_objective` (`objective_id`),
  CONSTRAINT `fk_investor_supported_objectives_investor` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`id`),
  CONSTRAINT `fk_investor_supported_objectives_objective` FOREIGN KEY (`objective_id`) REFERENCES `funding_objectives` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // investor_target_countries
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `investor_target_countries` (
  `investor_id` bigint unsigned NOT NULL,
  `country_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`investor_id`,`country_id`),
  KEY `fk_investor_target_countries_country` (`country_id`),
  CONSTRAINT `fk_investor_target_countries_country` FOREIGN KEY (`country_id`) REFERENCES `countries_all` (`id`),
  CONSTRAINT `fk_investor_target_countries_investor` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // investor_target_industries
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `investor_target_industries` (
  `investor_id` bigint unsigned NOT NULL,
  `industry_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`investor_id`,`industry_id`),
  KEY `fk_investor_target_industries_industry` (`industry_id`),
  CONSTRAINT `fk_investor_target_industries_industry` FOREIGN KEY (`industry_id`) REFERENCES `industries` (`id`),
  CONSTRAINT `fk_investor_target_industries_investor` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // investor_target_stages
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `investor_target_stages` (
  `investor_id` bigint unsigned NOT NULL,
  `stage_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`investor_id`,`stage_id`),
  KEY `fk_investor_target_stages_stage` (`stage_id`),
  CONSTRAINT `fk_investor_target_stages_investor` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`id`),
  CONSTRAINT `fk_investor_target_stages_stage` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // matching_applications
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `matching_applications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `business_profile_id` bigint unsigned DEFAULT NULL,
  `investor_profile_id` bigint unsigned DEFAULT NULL,
  `founder_profile_id` bigint unsigned DEFAULT NULL,
  `active_role` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `matching_action` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `matching_applications_user_id_index` (`user_id`),
  KEY `matching_applications_business_profile_index` (`business_profile_id`),
  KEY `matching_applications_investor_profile_index` (`investor_profile_id`),
  KEY `matching_applications_founder_profile_index` (`founder_profile_id`),
  CONSTRAINT `matching_applications_business_foreign` FOREIGN KEY (`business_profile_id`) REFERENCES `companies` (`id`),
  CONSTRAINT `matching_applications_founder_foreign` FOREIGN KEY (`founder_profile_id`) REFERENCES `founders` (`id`),
  CONSTRAINT `matching_applications_investor_foreign` FOREIGN KEY (`investor_profile_id`) REFERENCES `investors` (`id`),
  CONSTRAINT `matching_applications_user_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8080 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // matching_marketplace_synthetic_profiles
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `matching_marketplace_synthetic_profiles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `public_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch_id` bigint unsigned NOT NULL,
  `class_key` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `participant_kind` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `investor_class` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `investor_subtype` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_index` int unsigned NOT NULL,
  `profile_payload` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_mm_synth_profile_public` (`public_id`),
  UNIQUE KEY `uq_mm_synth_profile_identity` (`batch_id`,`class_key`,`profile_index`),
  KEY `idx_mm_synth_profile_class` (`class_key`),
  KEY `idx_mm_synth_profile_kind` (`participant_kind`),
  CONSTRAINT `fk_mm_synth_profile_batch` FOREIGN KEY (`batch_id`) REFERENCES `matching_marketplace_synthetic_batches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // matching_simulation_investors
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `matching_simulation_investors` (
  `batch_id` bigint unsigned NOT NULL,
  `investor_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`batch_id`,`investor_id`),
  UNIQUE KEY `uq_matching_simulation_investor` (`investor_id`),
  KEY `fk_matching_simulation_investors_user` (`user_id`),
  CONSTRAINT `fk_matching_simulation_investors_batch` FOREIGN KEY (`batch_id`) REFERENCES `matching_simulation_batches` (`id`),
  CONSTRAINT `fk_matching_simulation_investors_investor` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`id`),
  CONSTRAINT `fk_matching_simulation_investors_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // predictive_model_registry_entries
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `predictive_model_registry_entries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `registry_id` bigint unsigned NOT NULL,
  `model_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_version` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_kind` enum('BUSINESS_PROFILE','INVESTOR_PROFILE','RELATIONSHIP') COLLATE utf8mb4_unicode_ci NOT NULL,
  `goal_id` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_family` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `feature_schema_version` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `output_schema_version` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('CANDIDATE','APPROVED','RETIRED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `registered_at` datetime(6) NOT NULL,
  `approved_at` datetime(6) DEFAULT NULL,
  `calibration_version` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_registry_model_version` (`registry_id`,`model_id`,`model_version`),
  KEY `idx_predictive_registry_lookup` (`registry_id`,`model_kind`,`goal_id`,`status`),
  CONSTRAINT `fk_predictive_model_registry` FOREIGN KEY (`registry_id`) REFERENCES `predictive_model_registries` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `predictive_model_registry_entries_chk_1` CHECK ((char_length(trim(`model_id`)) > 0)),
  CONSTRAINT `predictive_model_registry_entries_chk_2` CHECK ((char_length(trim(`model_version`)) > 0)),
  CONSTRAINT `predictive_model_registry_entries_chk_3` CHECK ((char_length(trim(`goal_id`)) > 0)),
  CONSTRAINT `predictive_model_registry_entries_chk_4` CHECK ((char_length(trim(`model_family`)) > 0)),
  CONSTRAINT `predictive_model_registry_entries_chk_5` CHECK ((char_length(trim(`feature_schema_version`)) > 0)),
  CONSTRAINT `predictive_model_registry_entries_chk_6` CHECK ((char_length(trim(`output_schema_version`)) > 0)),
  CONSTRAINT `predictive_model_registry_entries_chk_7` CHECK (((`calibration_version` is null) or (char_length(trim(`calibration_version`)) > 0))),
  CONSTRAINT `predictive_model_registry_entries_chk_8` CHECK (((`approved_at` is null) or (`approved_at` >= `registered_at`))),
  CONSTRAINT `predictive_model_registry_entries_chk_9` CHECK (((`status` <> _utf8mb4'APPROVED') or (`approved_at` is not null)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // business_matching_inputs
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `business_matching_inputs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `application_id` bigint unsigned NOT NULL,
  `amount_mode` enum('specific','range') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'specific',
  `capital_requested` decimal(20,2) DEFAULT NULL,
  `capital_min` decimal(20,2) DEFAULT NULL,
  `capital_max` decimal(20,2) DEFAULT NULL,
  `currency_id` bigint unsigned DEFAULT NULL,
  `funding_purpose` text COLLATE utf8mb4_unicode_ci,
  `use_of_funds` text COLLATE utf8mb4_unicode_ci,
  `project_objective` text COLLATE utf8mb4_unicode_ci,
  `target_market` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `business_matching_inputs_application_unique` (`application_id`),
  KEY `business_matching_inputs_currency_index` (`currency_id`),
  CONSTRAINT `business_matching_inputs_application_foreign` FOREIGN KEY (`application_id`) REFERENCES `matching_applications` (`id`),
  CONSTRAINT `business_matching_inputs_currency_foreign` FOREIGN KEY (`currency_id`) REFERENCES `ticket_currency` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2042 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // founder_matching_inputs
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `founder_matching_inputs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `application_id` bigint unsigned NOT NULL,
  `amount_mode` enum('specific','range') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'specific',
  `capital_requested` decimal(20,2) DEFAULT NULL,
  `capital_min` decimal(20,2) DEFAULT NULL,
  `capital_max` decimal(20,2) DEFAULT NULL,
  `currency_id` bigint unsigned DEFAULT NULL,
  `venture_stage_id` bigint unsigned DEFAULT NULL,
  `venture_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `venture_summary` text COLLATE utf8mb4_unicode_ci,
  `funding_purpose` text COLLATE utf8mb4_unicode_ci,
  `use_of_funds` text COLLATE utf8mb4_unicode_ci,
  `project_objective` text COLLATE utf8mb4_unicode_ci,
  `target_market` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `founder_matching_inputs_application_unique` (`application_id`),
  KEY `founder_matching_inputs_currency_index` (`currency_id`),
  KEY `founder_matching_inputs_stage_index` (`venture_stage_id`),
  CONSTRAINT `fk_founder_matching_application` FOREIGN KEY (`application_id`) REFERENCES `matching_applications` (`id`),
  CONSTRAINT `fk_founder_matching_currency` FOREIGN KEY (`currency_id`) REFERENCES `ticket_currency` (`id`),
  CONSTRAINT `fk_founder_matching_stage` FOREIGN KEY (`venture_stage_id`) REFERENCES `prefered_investment_stages` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2010 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // investor_matching_application_contexts
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `investor_matching_application_contexts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `application_id` bigint unsigned NOT NULL,
  `investor_profile_id` bigint unsigned NOT NULL,
  `declared_investor_type` varchar(64) NOT NULL,
  `taxonomy_version` varchar(32) NOT NULL DEFAULT 'investor-type-v1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_imac_application` (`application_id`),
  KEY `idx_imac_investor` (`investor_profile_id`),
  KEY `idx_imac_declared_type` (`declared_investor_type`),
  CONSTRAINT `fk_imac_application` FOREIGN KEY (`application_id`) REFERENCES `matching_applications` (`id`),
  CONSTRAINT `fk_imac_investor` FOREIGN KEY (`investor_profile_id`) REFERENCES `investors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
SQL);

        // matching_marketplace
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `matching_marketplace` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `public_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `current_application_id` bigint unsigned NOT NULL,
  `participant_kind` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `participant_profile_id` bigint unsigned NOT NULL,
  `active_role` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `matching_action` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `participation_status` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `visibility` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'visible',
  `is_dummy` tinyint(1) NOT NULL DEFAULT '0',
  `is_synthetic` tinyint(1) NOT NULL DEFAULT '0',
  `activated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_evaluated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_matching_marketplace_public_id` (`public_id`),
  UNIQUE KEY `uq_matching_marketplace_current_application` (`current_application_id`),
  UNIQUE KEY `uq_matching_marketplace_identity` (`participant_kind`,`participant_profile_id`,`active_role`,`matching_action`),
  KEY `idx_matching_marketplace_status` (`participation_status`),
  KEY `idx_matching_marketplace_dummy` (`is_dummy`),
  CONSTRAINT `fk_matching_marketplace_application` FOREIGN KEY (`current_application_id`) REFERENCES `matching_applications` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8011 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // matching_marketplace_synthetic_activities
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `matching_marketplace_synthetic_activities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `public_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` bigint unsigned NOT NULL,
  `active_role` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `matching_action` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scenario_code` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `participation_status` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `visibility` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'visible',
  `activity_payload` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_mm_synth_activity_public` (`public_id`),
  UNIQUE KEY `uq_mm_synth_activity_identity` (`profile_id`,`active_role`,`matching_action`),
  KEY `idx_mm_synth_activity_route` (`active_role`,`matching_action`,`participation_status`,`visibility`),
  CONSTRAINT `fk_mm_synth_activity_profile` FOREIGN KEY (`profile_id`) REFERENCES `matching_marketplace_synthetic_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // business_matching_funding_instruments
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `business_matching_funding_instruments` (
  `business_matching_input_id` bigint unsigned NOT NULL,
  `funding_instrument_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`business_matching_input_id`,`funding_instrument_id`),
  KEY `idx_business_matching_funding_instrument_id` (`funding_instrument_id`),
  CONSTRAINT `fk_bmfi_business_input` FOREIGN KEY (`business_matching_input_id`) REFERENCES `business_matching_inputs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bmfi_funding_instrument` FOREIGN KEY (`funding_instrument_id`) REFERENCES `funding_instruments` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // business_matching_funding_objectives
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `business_matching_funding_objectives` (
  `business_matching_input_id` bigint unsigned NOT NULL,
  `objective_id` bigint unsigned NOT NULL,
  `objective_source` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'explicit_selection',
  `source_field` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objective_taxonomy_version` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'funding-objective-v1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`business_matching_input_id`,`objective_id`),
  KEY `idx_business_matching_funding_objective_id` (`objective_id`),
  CONSTRAINT `fk_bmfo_business_input` FOREIGN KEY (`business_matching_input_id`) REFERENCES `business_matching_inputs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bmfo_objective` FOREIGN KEY (`objective_id`) REFERENCES `funding_objectives` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // business_matching_target_countries
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `business_matching_target_countries` (
  `business_matching_input_id` bigint unsigned NOT NULL,
  `country_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`business_matching_input_id`,`country_id`),
  KEY `idx_business_matching_target_country_country_id` (`country_id`),
  CONSTRAINT `fk_bmtc_business_input` FOREIGN KEY (`business_matching_input_id`) REFERENCES `business_matching_inputs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bmtc_country` FOREIGN KEY (`country_id`) REFERENCES `countries_all` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // founder_matching_funding_instruments
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `founder_matching_funding_instruments` (
  `founder_matching_input_id` bigint unsigned NOT NULL,
  `funding_instrument_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`founder_matching_input_id`,`funding_instrument_id`),
  KEY `idx_founder_matching_instrument_id` (`funding_instrument_id`),
  CONSTRAINT `fk_fmfi_founder_input` FOREIGN KEY (`founder_matching_input_id`) REFERENCES `founder_matching_inputs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fmfi_instrument` FOREIGN KEY (`funding_instrument_id`) REFERENCES `funding_instruments` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // founder_matching_funding_objectives
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `founder_matching_funding_objectives` (
  `founder_matching_input_id` bigint unsigned NOT NULL,
  `objective_id` bigint unsigned NOT NULL,
  `objective_source` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'explicit_selection',
  `source_field` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objective_taxonomy_version` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'funding-objective-v1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`founder_matching_input_id`,`objective_id`),
  KEY `idx_founder_matching_objective_id` (`objective_id`),
  CONSTRAINT `fk_fmfo_founder_input` FOREIGN KEY (`founder_matching_input_id`) REFERENCES `founder_matching_inputs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fmfo_objective` FOREIGN KEY (`objective_id`) REFERENCES `funding_objectives` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // founder_matching_industries
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `founder_matching_industries` (
  `founder_matching_input_id` bigint unsigned NOT NULL,
  `industry_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`founder_matching_input_id`,`industry_id`),
  KEY `idx_founder_matching_industry_id` (`industry_id`),
  CONSTRAINT `fk_fmi_founder_input` FOREIGN KEY (`founder_matching_input_id`) REFERENCES `founder_matching_inputs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fmi_industry` FOREIGN KEY (`industry_id`) REFERENCES `industries` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // founder_matching_sectors
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `founder_matching_sectors` (
  `founder_matching_input_id` bigint unsigned NOT NULL,
  `sector_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`founder_matching_input_id`,`sector_id`),
  KEY `idx_founder_matching_sector_id` (`sector_id`),
  CONSTRAINT `fk_fms_founder_input` FOREIGN KEY (`founder_matching_input_id`) REFERENCES `founder_matching_inputs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fms_sector` FOREIGN KEY (`sector_id`) REFERENCES `sectors` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);

        // founder_matching_target_countries
        DB::statement(<<<'SQL'
CREATE TABLE IF NOT EXISTS `founder_matching_target_countries` (
  `founder_matching_input_id` bigint unsigned NOT NULL,
  `country_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`founder_matching_input_id`,`country_id`),
  KEY `idx_founder_matching_country_id` (`country_id`),
  CONSTRAINT `fk_fmtc_country` FOREIGN KEY (`country_id`) REFERENCES `countries_all` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_fmtc_founder_input` FOREIGN KEY (`founder_matching_input_id`) REFERENCES `founder_matching_inputs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL);
    }

    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `founder_matching_target_countries`');
        DB::statement('DROP TABLE IF EXISTS `founder_matching_sectors`');
        DB::statement('DROP TABLE IF EXISTS `founder_matching_industries`');
        DB::statement('DROP TABLE IF EXISTS `founder_matching_funding_objectives`');
        DB::statement('DROP TABLE IF EXISTS `founder_matching_funding_instruments`');
        DB::statement('DROP TABLE IF EXISTS `business_matching_target_countries`');
        DB::statement('DROP TABLE IF EXISTS `business_matching_funding_objectives`');
        DB::statement('DROP TABLE IF EXISTS `business_matching_funding_instruments`');
        DB::statement('DROP TABLE IF EXISTS `matching_marketplace_synthetic_activities`');
        DB::statement('DROP TABLE IF EXISTS `matching_marketplace`');
        DB::statement('DROP TABLE IF EXISTS `investor_matching_application_contexts`');
        DB::statement('DROP TABLE IF EXISTS `founder_matching_inputs`');
        DB::statement('DROP TABLE IF EXISTS `business_matching_inputs`');
        DB::statement('DROP TABLE IF EXISTS `predictive_model_registry_entries`');
        DB::statement('DROP TABLE IF EXISTS `matching_simulation_investors`');
        DB::statement('DROP TABLE IF EXISTS `matching_marketplace_synthetic_profiles`');
        DB::statement('DROP TABLE IF EXISTS `matching_applications`');
        DB::statement('DROP TABLE IF EXISTS `investor_target_stages`');
        DB::statement('DROP TABLE IF EXISTS `investor_target_industries`');
        DB::statement('DROP TABLE IF EXISTS `investor_target_countries`');
        DB::statement('DROP TABLE IF EXISTS `investor_supported_objectives`');
        DB::statement('DROP TABLE IF EXISTS `investor_sectors`');
        DB::statement('DROP TABLE IF EXISTS `investor_profile_metrics`');
        DB::statement('DROP TABLE IF EXISTS `investor_preferred_investment_stages`');
        DB::statement('DROP TABLE IF EXISTS `investor_funding_instruments`');
        DB::statement('DROP TABLE IF EXISTS `predictive_model_registries`');
        DB::statement('DROP TABLE IF EXISTS `matching_simulation_batches`');
        DB::statement('DROP TABLE IF EXISTS `matching_marketplace_synthetic_batches`');
        DB::statement('DROP TABLE IF EXISTS `investors`');
        DB::statement('DROP TABLE IF EXISTS `founders`');
    }
};
