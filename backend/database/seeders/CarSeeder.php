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
                'year' => 2025,
                'price_per_day' => 250,
                'currency' => 'MAD',
                'fuel' => 'Essence',
                'transmission' => 'Manuelle',
                'category' => 'Économique',
                'image' => '/uploads/1777075093215-Dacia-Logan-2025_-8-1024x577.webp',
                'images' => json_encode([
                    '/uploads/1777075093215-Dacia-Logan-2025_-8-1024x577.webp',
                    '/uploads/1777075096942-dacia-logan-2026-exterior-rear-view-autonews-1-1024x683.jpg',
                    '/uploads/1777075097065-27ae8c6dae.jpg',
                    '/uploads/1777075142873-e93e49d081.jpg',
                    '/uploads/1777075142944-2243847.jpeg',
                ]),
                'description' => 'La Dacia Logan 2025 est une berline compacte et économique, idéale pour les trajets urbains et les longs voyages au Maroc. Fiable et spacieuse, elle offre un excellent rapport qualité-prix.',
                'features' => json_encode(['Climatisation', 'Bluetooth', 'Airbags', 'ABS', 'Direction assistée']),
                'deposit' => 3000,
                'available' => true,
                'is_featured' => true,
                'plate_number' => '123456',
                'plate_letter' => 'أ',
                'plate_city_code' => '5',
                'color' => 'Blanc',
            ],
            [
                'brand' => 'Renault',
                'model' => 'Clio 5',
                'year' => 2024,
                'price_per_day' => 300,
                'currency' => 'MAD',
                'fuel' => 'Essence',
                'transmission' => 'Manuelle',
                'category' => 'Économique',
                'image' => '/uploads/1775315350591-Renault-Clio-5-restylee.jpg',
                'images' => json_encode([
                    '/uploads/1775315350591-Renault-Clio-5-restylee.jpg',
                    '/uploads/1775315354858-photos-essai-renault-clio-5-2019-075.webp',
                    '/uploads/1775315354943-renault-clio-5-esprit-alpine-avant-scaled.jpg',
                    '/uploads/1777077870444-Renault-Clio-5-restylee_0-copie.webp',
                    '/uploads/1777077878297-Renault-Clio-5-facelift-bd-10.jpg',
                    '/uploads/1777077878383-Clio-5-Front-Three-Quarter.jpg',
                    '/uploads/1777077878451-m32-bjaph2-hev-ml-e4alpine-78ardplgbleuironalpine-cycloblanc.jpg',
                ]),
                'description' => 'La Renault Clio 5 restylée 2024 combine style moderne, technologie embarquée et consommation réduite. Une citadine polyvalente parfaite pour la ville et la route.',
                'features' => json_encode(['Climatisation', 'Écran tactile', 'Bluetooth', 'ABS', 'Airbags', 'Régulateur de vitesse']),
                'deposit' => 3500,
                'available' => true,
                'is_featured' => true,
                'plate_number' => '234567',
                'plate_letter' => 'ب',
                'plate_city_code' => '5',
                'color' => 'Gris',
            ],
            [
                'brand' => 'Opel',
                'model' => 'Corsa',
                'year' => 2023,
                'price_per_day' => 320,
                'currency' => 'MAD',
                'fuel' => 'Essence',
                'transmission' => 'Manuelle',
                'category' => 'Économique',
                'image' => '/uploads/1777077708835-opel-corsa-2023-01.jpg',
                'images' => json_encode([
                    '/uploads/1777077708835-opel-corsa-2023-01.jpg',
                    '/uploads/1777077729038-opel-corsa-2024-autonews-4-1024x683.jpg',
                    '/uploads/1777077729128-opel-corsa-2023-02.jpg',
                    '/uploads/1777077729175-opel-corsa-ice-interior-16x9-cosol23-i01-001.webp',
                ]),
                'description' => 'L\'Opel Corsa 2023 est une compacte dynamique au design soigné. Agile en ville et confortable sur autoroute, elle séduit par son habitacle moderne et ses équipements généreux.',
                'features' => json_encode(['Climatisation', 'Bluetooth', 'Caméra de recul', 'ABS', 'Airbags', 'Apple CarPlay']),
                'deposit' => 4000,
                'available' => true,
                'is_featured' => false,
                'plate_number' => '345678',
                'plate_letter' => 'ج',
                'plate_city_code' => '5',
                'color' => 'Noir',
            ],
            [
                'brand' => 'Peugeot',
                'model' => '208',
                'year' => 2024,
                'price_per_day' => 350,
                'currency' => 'MAD',
                'fuel' => 'Essence',
                'transmission' => 'Automatique',
                'category' => 'Berline',
                'image' => '/uploads/1777077783189-Nouvelle-PEUGEOT-208-facelift-2024-Maroc-video.jpg',
                'images' => json_encode([
                    '/uploads/1777077783189-Nouvelle-PEUGEOT-208-facelift-2024-Maroc-video.jpg',
                    '/uploads/1777077792526-peugeot-e-208-resylee-2024-front.jpg',
                    '/uploads/1777077792628-2024-facelift-peugeot-e-208-2.jpg',
                    '/uploads/1777077792698-11_essai_peugeot_e208_restylee_2024.jpg',
                    '/uploads/1777077792764-208-Auto-interior.jpg',
                ]),
                'description' => 'La Peugeot 208 facelift 2024 incarne le style à la française avec son i-Cockpit signature, ses technologies connectées et sa finition soignée. Un choix premium dans le segment des compactes.',
                'features' => json_encode(['Climatisation automatique', 'i-Cockpit', 'Écran tactile 10"', 'Caméra de recul', 'ABS', 'Régulateur adaptatif']),
                'deposit' => 4500,
                'available' => true,
                'is_featured' => true,
                'plate_number' => '456789',
                'plate_letter' => 'د',
                'plate_city_code' => '5',
                'color' => 'Rouge',
            ],
        ];

        foreach ($cars as $car) {
            Car::create($car);
        }
    }
}



