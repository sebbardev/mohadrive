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
        Schema::table('customers', function (Blueprint $table) {
            // Add nationality field
            $table->string('nationality')->nullable()->after('birth_date');
            
            // Add license issue date
            $table->date('license_issue_date')->nullable()->after('license_number');
            
            // Add CIN issue date
            $table->date('cin_issue_date')->nullable()->after('cin_number');
            
            // Add passport number and issue date
            $table->string('passport_number')->nullable()->unique()->after('cin_issue_date');
            $table->date('passport_issue_date')->nullable()->after('passport_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn([
                'nationality',
                'license_issue_date',
                'cin_issue_date',
                'passport_number',
                'passport_issue_date',
            ]);
        });
    }
};
