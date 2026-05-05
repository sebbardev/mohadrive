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
            $table->dateTime('actual_return_date')->nullable();
            $table->integer('return_mileage')->nullable();
            $table->string('return_fuel_level')->nullable(); // e.g., "Full", "3/4", "1/2", "1/4", "Empty"
            $table->text('return_damages')->nullable();
            $table->string('deposit_status')->default('HELD'); // HELD, RELEASED, CLAIMED
            $table->decimal('additional_charges', 10, 2)->default(0);
            $table->text('return_notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn([
                'actual_return_date',
                'return_mileage',
                'return_fuel_level',
                'return_damages',
                'deposit_status',
                'additional_charges',
                'return_notes'
            ]);
        });
    }
};
