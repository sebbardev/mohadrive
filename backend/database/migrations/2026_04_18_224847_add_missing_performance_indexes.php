<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add missing indexes safely (check if they exist first)
        
        // Bookings table indexes
        $this->addIndexIfNotExists('bookings', 'car_id');
        $this->addIndexIfNotExists('bookings', 'status');
        $this->addIndexIfNotExists('bookings', 'customer_id');
        $this->addIndexIfNotExists('bookings', 'created_at');
        
        // Expenses table indexes
        $this->addIndexIfNotExists('expenses', 'type');
        $this->addIndexIfNotExists('expenses', 'date');
        $this->addIndexIfNotExists('expenses', 'is_automatic');
        
        // Cars table indexes
        $this->addIndexIfNotExists('cars', 'available');
        $this->addIndexIfNotExists('cars', 'category');
        
        // Customers table indexes
        $this->addIndexIfNotExists('customers', 'email');
        $this->addIndexIfNotExists('customers', 'phone');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rollback indexes
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex(['car_id']);
            $table->dropIndex(['status']);
            $table->dropIndex(['customer_id']);
            $table->dropIndex(['created_at']);
        });
        
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropIndex(['type']);
            $table->dropIndex(['date']);
            $table->dropIndex(['is_automatic']);
        });
        
        Schema::table('cars', function (Blueprint $table) {
            $table->dropIndex(['available']);
            $table->dropIndex(['category']);
        });
        
        Schema::table('customers', function (Blueprint $table) {
            $table->dropIndex(['email']);
            $table->dropIndex(['phone']);
        });
    }
    
    /**
     * Add index if it doesn't exist
     */
    private function addIndexIfNotExists(string $table, string $column): void
    {
        $indexName = "{$table}_{$column}_index";
        
        $exists = DB::select(
            "SELECT COUNT(*) as count FROM information_schema.statistics 
             WHERE table_schema = DATABASE() 
             AND table_name = ? 
             AND index_name = ?",
            [$table, $indexName]
        );
        
        if ($exists[0]->count == 0) {
            Schema::table($table, function (Blueprint $table) use ($column) {
                $table->index($column);
            });
        }
    }
};
