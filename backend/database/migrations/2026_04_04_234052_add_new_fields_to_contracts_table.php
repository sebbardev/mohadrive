<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->date('driver_license_date')->nullable();
            $table->string('driver_address')->nullable();
            $table->integer('initial_mileage')->default(0);
            $table->string('fuel_level')->nullable();
            $table->json('included_accessories')->nullable();
            $table->decimal('insurance_deductible', 10, 2)->default(0);
            $table->string('payment_method')->nullable();
            $table->boolean('is_paid')->default(false);
            $table->string('driver_cin_number')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn([
                'driver_license_date',
                'driver_address',
                'initial_mileage',
                'fuel_level',
                'included_accessories',
                'insurance_deductible',
                'payment_method',
                'is_paid',
                'driver_cin_number'
            ]);
        });
    }
};
