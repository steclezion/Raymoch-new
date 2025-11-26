<?php
// database/migrations/2025_11_24_000001_create_company_financials_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('company_financials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();

            $table->year('fiscal_year')->nullable();
            $table->string('currency', 8)->default('USD');

            $table->decimal('revenue', 18, 2)->nullable();
            $table->decimal('ebitda', 18, 2)->nullable();
            $table->decimal('net_income', 18, 2)->nullable();
            $table->decimal('total_assets', 18, 2)->nullable();
            $table->decimal('total_liabilities', 18, 2)->nullable();
            $table->decimal('valuation', 18, 2)->nullable();

            $table->string('source', 255)->nullable();
            $table->date('as_of_date')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_financials');
    }
};
