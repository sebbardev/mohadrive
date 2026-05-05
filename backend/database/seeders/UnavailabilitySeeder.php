<?php

namespace Database\Seeders;

use App\Models\Unavailability;
use App\Models\Car;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class UnavailabilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cars = Car::all();
        if ($cars->isEmpty()) {
            return;
        }

        $unavailabilities = [
            // Dacia Logan - Maintenance
            [
                'car_id' => $cars[0]->id,
                'start_date' => Carbon::now()->addDays(15)->hour(8)->minute(0)->second(0),
                'end_date' => Carbon::now()->addDays(17)->hour(18)->minute(0)->second(0),
                'type' => 'maintenance',
                'note' => 'Vidange et révision des 10,000 km',
            ],
            // Dacia Logan - Repair
            [
                'car_id' => $cars[0]->id,
                'start_date' => Carbon::now()->addDays(25)->hour(9)->minute(0)->second(0),
                'end_date' => Carbon::now()->addDays(27)->hour(17)->minute(0)->second(0),
                'type' => 'repair',
                'note' => 'Remplacement des plaquettes de frein',
            ],
            // VW Golf 8 - Maintenance
            [
                'car_id' => $cars[1]->id,
                'start_date' => Carbon::now()->addDays(10)->hour(8)->minute(0)->second(0),
                'end_date' => Carbon::now()->addDays(11)->hour(17)->minute(0)->second(0),
                'type' => 'maintenance',
                'note' => 'Contrôle technique annuel',
            ],
            // VW Golf 8 - Cleaning
            [
                'car_id' => $cars[1]->id,
                'start_date' => Carbon::now()->addDays(5)->hour(14)->minute(0)->second(0),
                'end_date' => Carbon::now()->addDays(5)->hour(18)->minute(0)->second(0),
                'type' => 'cleaning',
                'note' => 'Nettoyage complet intérieur/extérieur',
            ],
            // Range Rover - Maintenance
            [
                'car_id' => $cars[2]->id,
                'start_date' => Carbon::now()->addDays(20)->hour(9)->minute(0)->second(0),
                'end_date' => Carbon::now()->addDays(22)->hour(16)->minute(0)->second(0),
                'type' => 'maintenance',
                'note' => 'Révision constructeur 20,000 km',
            ],
            // Range Rover - Insurance
            [
                'car_id' => $cars[2]->id,
                'start_date' => Carbon::now()->addDays(8)->hour(8)->minute(0)->second(0),
                'end_date' => Carbon::now()->addDays(8)->hour(17)->minute(0)->second(0),
                'type' => 'administrative',
                'note' => 'Renouvellement assurance et vignette',
            ],
            // Toyota Prado - Repair
            [
                'car_id' => $cars[3]->id,
                'start_date' => Carbon::now()->addDays(12)->hour(8)->minute(0)->second(0),
                'end_date' => Carbon::now()->addDays(14)->hour(17)->minute(0)->second(0),
                'type' => 'repair',
                'note' => 'Remplacement pneus 4x4',
            ],
            // Toyota Prado - Maintenance
            [
                'car_id' => $cars[3]->id,
                'start_date' => Carbon::now()->addDays(30)->hour(9)->minute(0)->second(0),
                'end_date' => Carbon::now()->addDays(31)->hour(16)->minute(0)->second(0),
                'type' => 'maintenance',
                'note' => 'Vidange boîte de vitesses',
            ],
        ];

        foreach ($unavailabilities as $unavailability) {
            Unavailability::create($unavailability);
        }
    }
}
