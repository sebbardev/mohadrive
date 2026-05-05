<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer l'administrateur par défaut
        User::updateOrCreate(
            ['email' => 'sebbardev.digital@gmail.com'],
            [
                'name' => 'Administrateur',
                'password' => Hash::make('admin123'),
                'role' => 'ADMIN',
            ]
        );

        // Appeler les seeders
        $this->call([
            CarSeeder::class,
            CustomerSeeder::class,
            BookingSeeder::class,
            ContractSeeder::class,
            ExpenseSeeder::class,
            UnavailabilitySeeder::class,
            ReviewSeeder::class,
        ]);
    }
}
