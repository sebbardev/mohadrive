<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('bookings', 'daily_price')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->decimal('daily_price', 10, 2)->nullable()->after('total_price');
            });
        }

        if (! Schema::hasColumn('bookings', 'return_location')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->string('return_location')->nullable()->after('location');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('bookings', 'daily_price')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->dropColumn('daily_price');
            });
        }

        if (Schema::hasColumn('bookings', 'return_location')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->dropColumn('return_location');
            });
        }
    }
};
