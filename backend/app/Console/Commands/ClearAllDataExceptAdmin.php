<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class ClearAllDataExceptAdmin extends Command
{
    protected $signature = 'data:clear-except-admin';
    protected $description = 'Clear all data from the database except admin users';

    public function handle()
    {
        $this->warn('⚠️  ATTENTION: Cette opération va supprimer TOUTES les données sauf les admins!');
        $this->info('');
        
        // Show admin users that will be preserved
        $admins = User::where('role', 'admin')->get();
        $this->info("✅ Admins qui seront conservés ({$admins->count()}):");
        foreach ($admins as $admin) {
            $this->line("   - {$admin->name} ({$admin->email})");
        }
        $this->info('');

        if (!$this->confirm('Êtes-vous sûr de vouloir continuer?')) {
            $this->info('Opération annulée.');
            return Command::FAILURE;
        }

        $this->info('');
        $this->info('🗑️  Suppression des données...');
        $this->info('');

        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        try {
            // Truncate tables in correct order (respecting foreign keys)
            $tables = [
                'contracts',
                'bookings',
                'customers',
                'cars',
                'expenses',
                'unavailabilities',
                'audit_logs',
                'notifications',
                'contact_messages',
                'hero_images',
                'reviews',
                'personal_access_tokens',
                'sessions',
                'cache',
                'cache_locks',
                'jobs',
                'job_batches',
                'failed_jobs',
            ];

            $deletedCount = 0;

            foreach ($tables as $table) {
                // Check if table exists
                if (DB::getSchemaBuilder()->hasTable($table)) {
                    $count = DB::table($table)->count();
                    if ($count > 0) {
                        DB::table($table)->truncate();
                        $this->line("   ✅ {$table}: {$count} lignes supprimées");
                        $deletedCount += $count;
                    }
                }
            }

            // Delete non-admin users
            $nonAdminCount = User::where('role', '!=', 'admin')->count();
            if ($nonAdminCount > 0) {
                User::where('role', '!=', 'admin')->delete();
                $this->line("   ✅ users: {$nonAdminCount} utilisateurs non-admin supprimés");
                $deletedCount += $nonAdminCount;
            }

            // Re-enable foreign key checks
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');

            $this->info('');
            $this->info('🎉 Nettoyage terminé!');
            $this->info('');
            $this->info("📊 Résumé:");
            $this->line("   - Total lignes supprimées: {$deletedCount}");
            $this->line("   - Admins conservés: {$admins->count()}");
            $this->line("   - Tables vidées: " . count($tables));
            $this->info('');
            $this->info('✅ La base de données est maintenant propre (admins uniquement)!');

            return Command::SUCCESS;

        } catch (\Exception $e) {
            // Re-enable foreign key checks even on error
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            
            $this->error('❌ Erreur lors du nettoyage: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
