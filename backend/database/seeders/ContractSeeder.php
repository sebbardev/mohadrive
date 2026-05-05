<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Contract;
use App\Models\Car;
use App\Models\Customer;
use App\Models\Booking;
use Carbon\Carbon;

class ContractSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cars = Car::all();
        $customers = Customer::all();
        $bookings = Booking::all();

        if ($cars->isEmpty() || $customers->isEmpty()) {
            return;
        }

        // Exemple 1: Contrat Actif pour Haytham Sebbar
        Contract::create([
            'car_id' => $cars->first()->id,
            'customer_id' => $customers->first()->id,
            'booking_id' => $bookings->first()?->id,
            'driver_first_name' => 'Haytham',
            'driver_last_name' => 'Sebbar',
            'driver_license_number' => 'AB123456',
            'driver_license_date' => '2018-05-20',
            'driver_phone' => '0665663909',
            'driver_email' => 'sebbardev.digital@gmail.com',
            'driver_cin_number' => 'EE123456',
            'driver_address' => 'Avenue de France, Casablanca',
            'start_date' => Carbon::now()->subDays(2),
            'end_date' => Carbon::now()->addDays(5),
            'pickup_location' => 'Agence Casablanca',
            'return_location' => 'Agence Casablanca',
            'initial_mileage' => 45000,
            'fuel_level' => 'FULL',
            'included_accessories' => ['ROUE_SECOURS', 'CRIC', 'EXTINCTEUR', 'GILETS'],
            'deposit_amount' => 5000,
            'insurance_deductible' => 5000,
            'payment_method' => 'CASH',
            'is_paid' => true,
            'daily_price' => 250,
            'total_price' => 1750,
            'status' => 'IN_PROGRESS',
            'version' => 1
        ]);

        // Exemple 2: Contrat Terminé
        Contract::create([
            'car_id' => $cars->last()->id,
            'customer_id' => $customers->last()->id,
            'driver_first_name' => 'Ahmed',
            'driver_last_name' => 'Alami',
            'driver_license_number' => 'CD987654',
            'driver_license_date' => '2015-10-12',
            'driver_phone' => '0612345678',
            'driver_email' => 'ahmed.alami@email.com',
            'driver_cin_number' => 'BK987654',
            'driver_address' => 'Quartier Palmier, Casablanca',
            'start_date' => Carbon::now()->subDays(15),
            'end_date' => Carbon::now()->subDays(10),
            'pickup_location' => 'Aéroport Mohammed V',
            'return_location' => 'Agence Casablanca',
            'initial_mileage' => 12500,
            'fuel_level' => '3/4',
            'included_accessories' => ['ROUE_SECOURS', 'CRIC'],
            'deposit_amount' => 7000,
            'insurance_deductible' => 5000,
            'payment_method' => 'CARD',
            'is_paid' => true,
            'daily_price' => 350,
            'total_price' => 1750,
            'status' => 'COMPLETED',
            'version' => 1,
            'actual_return_date' => Carbon::now()->subDays(10),
            'return_mileage' => 12850,
            'return_fuel_level' => '3/4'
        ]);

        // Exemple 3: Contrat en attente (Réservé mais pas encore commencé)
        Contract::create([
            'car_id' => $cars->first()->id,
            'customer_id' => $customers->first()->id,
            'driver_first_name' => 'Yassine',
            'driver_last_name' => 'Mansouri',
            'driver_license_number' => 'EF456123',
            'driver_license_date' => '2020-01-05',
            'driver_phone' => '0699887766',
            'driver_email' => 'y.mansouri@email.com',
            'driver_cin_number' => 'LF456123',
            'driver_address' => 'Rabat Agdal',
            'start_date' => Carbon::now()->addDays(10),
            'end_date' => Carbon::now()->addDays(15),
            'pickup_location' => 'Agence Casablanca',
            'return_location' => 'Agence Casablanca',
            'initial_mileage' => 0, // Sera rempli au départ
            'fuel_level' => 'FULL',
            'included_accessories' => ['ROUE_SECOURS', 'CRIC', 'EXTINCTEUR', 'GILETS'],
            'deposit_amount' => 5000,
            'insurance_deductible' => 5000,
            'payment_method' => 'TRANSFER',
            'is_paid' => false,
            'daily_price' => 300,
            'total_price' => 1500,
            'status' => 'PENDING',
            'version' => 1
        ]);
    }
}
