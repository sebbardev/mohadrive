<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Car;

class AddDefaultCars extends Command
{
    protected $signature = 'cars:add-default';
    protected $description = 'Add default cars to the database';

    public function handle()
    {
        $this->info('🚗 Adding default cars...');
        $this->info('');

        $cars = [
            [
                'brand' => 'Opel',
                'model' => 'Corsa',
                'year' => 2026,
                'price_per_day' => 250,
                'fuel' => 'Essence',
                'transmission' => 'Manuel',
                'category' => 'Economique',
                'image' => '/uploads/default-car.jpg',
                'description' => 'Opel Corsa 2026 - Voiture économique et fiable',
                'available' => true,
            ],
            [
                'brand' => 'Peugeot',
                'model' => '206',
                'year' => 2026,
                'price_per_day' => 250,
                'fuel' => 'Essence',
                'transmission' => 'Manuel',
                'category' => 'Economique',
                'image' => '/uploads/default-car.jpg',
                'description' => 'Peugeot 206 2026 - Compacte et confortable',
                'available' => true,
            ],
            [
                'brand' => 'Dacia',
                'model' => 'Logan',
                'year' => 2026,
                'price_per_day' => 250,
                'fuel' => 'Essence',
                'transmission' => 'Manuel',
                'category' => 'Economique',
                'image' => '/uploads/default-car.jpg',
                'description' => 'Dacia Logan 2026 - Spacieuse et économique',
                'available' => true,
            ],
            [
                'brand' => 'Renault',
                'model' => 'Clio 5',
                'year' => 2026,
                'price_per_day' => 250,
                'fuel' => 'Essence',
                'transmission' => 'Manuel',
                'category' => 'Economique',
                'image' => '/uploads/default-car.jpg',
                'description' => 'Renault Clio 5 2026 - Moderne et performante',
                'available' => true,
            ],
        ];

        $addedCount = 0;

        foreach ($cars as $carData) {
            $car = Car::create($carData);
            $this->line("   ✅ {$carData['brand']} {$carData['model']} {$carData['year']} - {$carData['price_per_day']} DH/jour");
            $addedCount++;
        }

        $this->info('');
        $this->info("🎉 Successfully added {$addedCount} cars!");
        $this->info('');

        // Display summary
        $this->info('📊 Summary:');
        $allCars = Car::all();
        $this->line("   Total cars in database: {$allCars->count()}");
        foreach ($allCars as $car) {
            $this->line("   - {$car->brand} {$car->model} {$car->year} ({$car->price_per_day} DH/jour)");
        }

        return Command::SUCCESS;
    }
}
