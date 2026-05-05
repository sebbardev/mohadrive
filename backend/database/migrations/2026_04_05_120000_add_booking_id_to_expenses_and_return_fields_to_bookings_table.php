<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->foreignId('booking_id')
                ->nullable()
                ->after('car_id')
                ->constrained('bookings')
                ->nullOnDelete();
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dateTime('return_checked_at')->nullable()->after('return_location');
            $table->unsignedInteger('return_mileage')->nullable()->after('return_checked_at');
            $table->string('return_condition')->nullable()->after('return_mileage');
            $table->text('return_note')->nullable()->after('return_condition');
        });
    }

    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropConstrainedForeignId('booking_id');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'return_checked_at',
                'return_mileage',
                'return_condition',
                'return_note',
            ]);
        });
    }
};
