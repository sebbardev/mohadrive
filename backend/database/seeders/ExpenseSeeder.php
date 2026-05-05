<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Expense;
use App\Models\Car;
use App\Models\Booking;
use Carbon\Carbon;

class ExpenseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cars = Car::all();
        $bookings = Booking::all();
        
        if ($cars->isEmpty()) return;

        // Regular car expenses
        foreach ($cars as $car) {
            // Annual insurance
            Expense::create([
                'car_id' => $car->id,
                'type' => 'assurance',
                'amount' => 1200,
                'date' => Carbon::now()->startOfYear()->addMonths(2),
                'note' => 'Assurance annuelle 2026',
            ]);

            // Recent maintenance
            Expense::create([
                'car_id' => $car->id,
                'type' => 'entretien',
                'amount' => 450.50,
                'date' => Carbon::now()->subDays(15),
                'note' => 'Vidange et filtres',
            ]);

            // Car wash
            Expense::create([
                'car_id' => $car->id,
                'type' => 'lavage',
                'amount' => 50,
                'date' => Carbon::now()->subDays(2),
                'note' => 'Lavage complet',
            ]);

            // Vignette (annual tax)
            Expense::create([
                'car_id' => $car->id,
                'type' => 'vignette',
                'amount' => 700,
                'date' => Carbon::now()->startOfYear(),
                'note' => 'Vignette 2026',
            ]);
        }

        // Add booking-related expenses if bookings exist
        if ($bookings->isNotEmpty()) {
            // Fuel expense for completed booking
            $completedBooking = $bookings->firstWhere('status', 'COMPLETED');
            if ($completedBooking) {
                Expense::create([
                    'car_id' => $completedBooking->car_id,
                    'booking_id' => $completedBooking->id,
                    'type' => 'carburant',
                    'amount' => 350,
                    'date' => Carbon::parse($completedBooking->start_date)->addDays(2),
                    'note' => 'Remplissage carburant client',
                ]);

                Expense::create([
                    'car_id' => $completedBooking->car_id,
                    'booking_id' => $completedBooking->id,
                    'type' => 'parking',
                    'amount' => 80,
                    'date' => Carbon::parse($completedBooking->start_date)->addDays(1),
                    'note' => 'Frais de parking aéroport',
                ]);
            }

            // Cleaning after rental
            $recentBooking = $bookings->firstWhere('status', 'IN_PROGRESS');
            if ($recentBooking) {
                Expense::create([
                    'car_id' => $recentBooking->car_id,
                    'booking_id' => $recentBooking->id,
                    'type' => 'lavage',
                    'amount' => 100,
                    'date' => Carbon::now()->subDays(3),
                    'note' => 'Nettoyage après location précédente',
                ]);
            }
        }

        // Additional miscellaneous expenses
        if ($cars->count() >= 2) {
            // GPS subscription
            Expense::create([
                'car_id' => $cars[1]->id,
                'type' => 'autre',
                'amount' => 150,
                'date' => Carbon::now()->subMonth(),
                'note' => 'Abonnement GPS Tracker 3 mois',
            ]);

            // Tire replacement
            Expense::create([
                'car_id' => $cars[3]->id, // SUV
                'type' => 'réparation',
                'amount' => 2400,
                'date' => Carbon::now()->subDays(45),
                'note' => 'Remplacement 4 pneus tout-terrain',
            ]);
        }
    }
}
