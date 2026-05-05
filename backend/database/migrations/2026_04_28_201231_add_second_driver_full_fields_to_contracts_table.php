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
            // Champs pour le 2ème conducteur (mêmes que le locataire)
            $table->string('second_driver_cin_number')->nullable()->after('second_driver_email');
            $table->date('second_driver_cin_issue_date')->nullable()->after('second_driver_cin_number');
            $table->string('second_driver_passport_number')->nullable()->after('second_driver_cin_issue_date');
            $table->date('second_driver_passport_issue_date')->nullable()->after('second_driver_passport_number');
            $table->date('second_driver_license_date')->nullable()->after('second_driver_license_number');
            $table->text('second_driver_address')->nullable()->after('second_driver_license_date');
            $table->date('second_driver_birth_date')->nullable()->after('second_driver_address');
            $table->string('second_driver_nationality')->default('Marocaine')->after('second_driver_birth_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn([
                'second_driver_cin_number',
                'second_driver_cin_issue_date',
                'second_driver_passport_number',
                'second_driver_passport_issue_date',
                'second_driver_license_date',
                'second_driver_address',
                'second_driver_birth_date',
                'second_driver_nationality'
            ]);
        });
    }
};
