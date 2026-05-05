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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->constrained()->onDelete('cascade');
            $table->foreignId('booking_id')->nullable()->constrained()->onDelete('set null');
            
            // Conducteur principal
            $table->string('driver_first_name');
            $table->string('driver_last_name');
            $table->string('driver_license_number');
            $table->string('driver_phone');
            $table->string('driver_email');

            // Deuxième conducteur (optionnel)
            $table->string('second_driver_first_name')->nullable();
            $table->string('second_driver_last_name')->nullable();
            $table->string('second_driver_license_number')->nullable();
            $table->string('second_driver_phone')->nullable();
            $table->string('second_driver_email')->nullable();

            // Période de location
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('pickup_location');
            $table->string('return_location');

            // Détails financiers
            $table->decimal('total_price', 10, 2);
            $table->decimal('daily_price', 10, 2);
            $table->decimal('deposit_amount', 10, 2)->default(0);

            // Statut et PDF
            $table->string('status')->default('PENDING'); // PENDING, SIGNED, COMPLETED, CANCELLED
            $table->string('pdf_path')->nullable();
            $table->integer('version')->default(1);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
