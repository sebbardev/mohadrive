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
            $table->date('cin_issue_date')->nullable()->after('driver_cin_number');
            $table->string('passport_number')->nullable()->after('cin_issue_date');
            $table->date('passport_issue_date')->nullable()->after('passport_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn(['cin_issue_date', 'passport_number', 'passport_issue_date']);
        });
    }
};
