<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the denormalized company search view.
     */
    public function up(): void
    {
        DB::unprepared(<<<'VIEW_DEFINITION'
CREATE OR REPLACE
ALGORITHM = UNDEFINED
SQL SECURITY INVOKER
VIEW `raymoch_all_in_all_search` AS
SELECT
    `c`.`id`,
    `c`.`CompanyName`,
    `s`.`title` AS `sector_title`,
    `s`.`description` AS `sector_description`,
    `i`.`name` AS `industry_name`,
    `st`.`name` AS `state_name`,
    `co`.`country_name`,
    `r`.`name` AS `region_name`,
    `ci`.`name` AS `city_name`,
    `at`.`name` AS `account_type_name`,
    `ls`.`name` AS `legal_structure_name`,
    `c`.`FoundedYear`,
    `c`.`Stage`,
    `c`.`VerificationStatus`,
    `c`.`VerificationStep`,
    `c`.`CTI_Score`,
    `c`.`CTI_Tier`,
    `c`.`ProfileCompletenessPct`,
    `c`.`AnnualRevenueUSD`,
    `c`.`website`,
    `c`.`Email`,
    `c`.`Employees_count`,
    `c`.`Logo`,
    `c`.`DataSourcesCount`,
    `c`.`icon`,
    `c`.`latitude`,
    `c`.`longitude`,
    `c`.`target_company_id`,
    `c`.`source_company_id`,
    `c`.`applicant_profile_id`,
    `c`.`trading_name`,
    `c`.`licence_number`,
    `c`.`tax_id`,
    `c`.`address`,
    `c`.`postal_code`,
    `c`.`lei_number`,
    `c`.`business_model`,
    `c`.`products_or_services`,
    `c`.`countries_of_operation`,
    `c`.`fiscal_year_end`,
    `c`.`public_listing_ticker`,
    `c`.`business_description`,
    `c`.`ultimate_parent_company`,
    `c`.`ownership_type`,
    `c`.`beneficial_owners`,
    `c`.`authorized_signatory`,
    `c`.`signatory_title`,
    `c`.`national_id_or_passport_number`,
    `c`.`id_expiry_date`,
    `c`.`date_established`,
    `c`.`number_of_employees`,
    `tc`.`name` AS `revenue_currency_name`,
    `tc`.`country_name` AS `revenue_currency_country_name`,
    `tc`.`code` AS `revenue_currency_code`,
    `c`.`is_ultimate_parent_company`,
    `c`.`standard_verification_cit`,
    `c`.`auxiliary_verification_ats`,
    `c`.`company_full_directory_path`,
    `c`.`applicant_full_name`,
    `u`.`name` AS `user_name`,
    `u`.`display_name` AS `user_display_name`,
    `c`.`job_title_relationship`,
    `c`.`applicant_work_email`,
    `c`.`preferred_contact_method`,
    `c`.`applicant_phone_number`,
    `c`.`referral_source`,
    `c`.`singatory_image_holder`,
    `c`.`is_parent_company`,
    `c`.`who_is_parent_company`,
    `c`.`ownership_percentage`,
    `c`.`relationship_type`,
    `c`.`location_name`,
    `c`.`updated_at`,
    `c`.`created_at`
FROM `companies` AS `c`
LEFT OUTER JOIN `sectors` AS `s`
    ON `s`.`id` = `c`.`Sector`
LEFT OUTER JOIN `industries` AS `i`
    ON `i`.`id` = `c`.`industry_id`
LEFT OUTER JOIN `states_all` AS `st`
    ON `st`.`id` = `c`.`state_id`
LEFT OUTER JOIN `countries_africans` AS `co`
    ON `co`.`countries_all_id` = `c`.`Country`
LEFT OUTER JOIN `regions` AS `r`
    ON `r`.`id` = `c`.`Region`
LEFT OUTER JOIN `cities_all` AS `ci`
    ON `ci`.`id` = `c`.`City`
LEFT OUTER JOIN `users` AS `u`
    ON `u`.`id` = `c`.`who`
LEFT OUTER JOIN `ticket_currency` AS `tc`
    ON `tc`.`id` = `c`.`revenue_currency`
LEFT OUTER JOIN `account_type` AS `at`
    ON `at`.`id` = `c`.`account_type_id`
LEFT OUTER JOIN `legal_structure` AS `ls`
    ON `ls`.`id` = `c`.`legal_structure_id`
VIEW_DEFINITION);
    }

    /**
     * Remove the search view.
     */
    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS `raymoch_all_in_all_search`');
    }
};
