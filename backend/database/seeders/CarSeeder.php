<?php

namespace Database\Seeders;

use App\Models\Car;
use Illuminate\Database\Seeder;

class CarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cars = [
            [
                'brand' => 'Dacia',
                'model' => 'Logan',
                'year' => 2024,
                'price_per_day' => 250,
                'fuel' => 'Diesel',
                'transmission' => 'Manuelle',
                'category' => 'Économique',
                'image' => '/uploads/dacia-logan.jpg',
                'description' => 'La Dacia Logan est une berline compacte et économique, idéale pour les trajets urbains et les longs voyages au Maroc.',
                'features' => json_encode(['Climatisation', 'Bluetooth', 'Airbags', 'ABS']),
                'deposit' => 3000,
                'available' => true,
            ],
            [
                'brand' => 'Volkswagen',
                'model' => 'Golf 8',
                'year' => 2023,
                'price_per_day' => 500,
                'fuel' => 'Diesel',
                'transmission' => 'Automatique',
                'category' => 'Berline',
                'image' => '/uploads/vw-golf-8.jpg',
                'description' => 'La Golf 8 offre un confort exceptionnel et une technologie de pointe pour une expérience de conduite supérieure.',
                'features' => json_encode(['Climatisation Bi-zone', 'GPS', 'Caméra de recul', 'Sièges chauffants']),
                'deposit' => 5000,
                'available' => true,
            ],
            [
                'brand' => 'Range Rover',
                'model' => 'Sport',
                'year' => 2024,
                'price_per_day' => 2500,
                'fuel' => 'Hybride',
                'transmission' => 'Automatique',
                'category' => 'Luxe',
                'image' => '/uploads/range-rover-sport.jpg',
                'description' => 'Le Range Rover Sport allie luxe, puissance et capacités tout-terrain inégalées.',
                'features' => json_encode(['Toit panoramique', 'Suspension pneumatique', 'Système audio Meridian', 'Cuir premium']),
                'deposit' => 15000,
                'available' => true,
            ],
            [
                'brand' => 'Toyota',
                'model' => 'Prado',
                'year' => 2023,
                'price_per_day' => 1200,
                'fuel' => 'Diesel',
                'transmission' => 'Automatique',
                'category' => 'SUV',
                'image' => '/uploads/toyota-prado.jpg',
                'description' => 'Le Toyota Prado est le choix idéal pour explorer les paysages variés du Maroc en toute sécurité.',
                'features' => json_encode(['4x4', '7 Places', 'Climatisation arrière', 'Régulateur de vitesse']),
                'deposit' => 8000,
                'available' => true,
            ],
        ];

        foreach ($cars as $car) {
            Car::create($car);
        }
    }
}



