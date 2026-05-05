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
        // The start_date and end_date columns are already dateTime type
        // This migration ensures they have proper precision for time tracking
        Schema::table('bookings', function (Blueprint $table) {
            // Ensure start_date and end_date are datetime with proper precision
            if (Schema::hasColumn('bookings', 'start_date')) {
                $table->dateTime('start_date')->change();
            }
            if (Schema::hasColumn('bookings', 'end_date')) {
                $table->dateTime('end_date')->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // No changes needed for rollback as dateTime was already the type
        });
    }
};
