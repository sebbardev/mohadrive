<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Car;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
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

        $now = Carbon::parse('2026-04-03 12:00:00');

        $bookings = [
            // Dacia Logan - Current active booking (started yesterday morning, ends tomorrow evening)
            [
                'car_id' => $cars[0]->id, // Dacia Logan
                'start_date' => $now->copy()->subDays(1)->hour(9)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'end_date' => $now->copy()->addDays(1)->hour(18)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'total_price' => 750,
                'daily_price' => 250,
                'status' => 'IN_PROGRESS',
                'first_name' => 'Ahmed',
                'last_name' => 'Amrani',
                'email' => 'ahmed@test.ma',
                'phone' => '0612345678',
                'location' => 'Aéroport Marrakech',
                'return_location' => 'Aéroport Marrakech',
            ],
            // Dacia Logan - Future booking (next week, morning to evening)
            [
                'car_id' => $cars[0]->id, // Dacia Logan
                'start_date' => $now->copy()->addDays(5)->hour(10)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'end_date' => $now->copy()->addDays(8)->hour(17)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'total_price' => 1000,
                'daily_price' => 250,
                'status' => 'CONFIRMED',
                'first_name' => 'Fatima',
                'last_name' => 'Zahra',
                'email' => 'fatima@test.ma',
                'phone' => '0645678901',
                'location' => 'Centre-ville Casablanca',
                'return_location' => 'Centre-ville Casablanca',
            ],
            // Dacia Logan - Same day rental (morning pickup, evening return)
            [
                'car_id' => $cars[0]->id, // Dacia Logan
                'start_date' => $now->copy()->addDays(12)->hour(8)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'end_date' => $now->copy()->addDays(12)->hour(20)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'total_price' => 250,
                'daily_price' => 250,
                'status' => 'PENDING',
                'first_name' => 'Youssef',
                'last_name' => 'Benali',
                'email' => 'youssef@test.ma',
                'phone' => '0656789012',
                'location' => 'Gare Rabat',
                'return_location' => 'Gare Rabat',
            ],
            // VW Golf 8 - Active booking
            [
                'car_id' => $cars[1]->id, // VW Golf 8
                'start_date' => $now->copy()->hour(14)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'end_date' => $now->copy()->addDays(3)->hour(14)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'total_price' => 1500,
                'daily_price' => 500,
                'status' => 'IN_PROGRESS',
                'first_name' => 'Yasmine',
                'last_name' => 'Berrada',
                'email' => 'yasmine@test.ma',
                'phone' => '0623456789',
                'location' => 'Aéroport Casablanca',
                'return_location' => 'Aéroport Casablanca',
            ],
            // Range Rover - Future booking
            [
                'car_id' => $cars[2]->id, // Range Rover
                'start_date' => $now->copy()->addDays(2)->hour(11)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'end_date' => $now->copy()->addDays(6)->hour(16)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'total_price' => 10000,
                'daily_price' => 2500,
                'status' => 'CONFIRMED',
                'first_name' => 'Robert',
                'last_name' => 'Smith',
                'email' => 'robert@test.com',
                'phone' => '+44789123456',
                'location' => 'Hôtel Mamounia Marrakech',
                'return_location' => 'Aéroport Marrakech',
            ],
            // Toyota Prado - Completed booking
            [
                'car_id' => $cars[3]->id, // Toyota Prado
                'start_date' => $now->copy()->subDays(5)->hour(9)->minute(30)->second(0)->format('Y-m-d H:i:s'),
                'end_date' => $now->copy()->subDays(1)->hour(17)->minute(30)->second(0)->format('Y-m-d H:i:s'),
                'total_price' => 4800,
                'daily_price' => 1200,
                'status' => 'COMPLETED',
                'first_name' => 'Karim',
                'last_name' => 'Idrissi',
                'email' => 'karim@test.ma',
                'phone' => '0634567890',
                'location' => 'Agadir Marina',
                'return_location' => 'Agadir Marina',
            ],
            // Dacia Logan - Past completed booking
            [
                'car_id' => $cars[0]->id, // Dacia Logan
                'start_date' => $now->copy()->subDays(10)->hour(8)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'end_date' => $now->copy()->subDays(7)->hour(18)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'total_price' => 750,
                'daily_price' => 250,
                'status' => 'COMPLETED',
                'first_name' => 'Hassan',
                'last_name' => 'Tazi',
                'email' => 'hassan@test.ma',
                'phone' => '0667890123',
                'location' => 'Fès Médina',
                'return_location' => 'Fès Médina',
            ],
            // Dacia Logan - Cancelled booking
            [
                'car_id' => $cars[0]->id,
                'start_date' => $now->copy()->addDays(20)->hour(10)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'end_date' => $now->copy()->addDays(22)->hour(10)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'total_price' => 500,
                'daily_price' => 250,
                'status' => 'CANCELLED',
                'first_name' => 'Sara',
                'last_name' => 'Alaoui',
                'email' => 'sara@test.ma',
                'phone' => '0678901234',
                'location' => 'Meknès Centre',
                'return_location' => 'Meknès Centre',
            ],
            // PENDING bookings for badge testing
            [
                'car_id' => $cars[1]->id,
                'start_date' => $now->copy()->addDays(3)->hour(9)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'end_date' => $now->copy()->addDays(5)->hour(18)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'total_price' => 1000,
                'daily_price' => 500,
                'status' => 'PENDING',
                'first_name' => 'Nadia',
                'last_name' => 'Chraibi',
                'email' => 'nadia@test.ma',
                'phone' => '0611223344',
                'location' => 'Rabat Agdal',
                'return_location' => 'Rabat Agdal',
            ],
            [
                'car_id' => $cars[2]->id,
                'start_date' => $now->copy()->addDays(7)->hour(10)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'end_date' => $now->copy()->addDays(10)->hour(17)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'total_price' => 7500,
                'daily_price' => 2500,
                'status' => 'PENDING',
                'first_name' => 'Omar',
                'last_name' => 'Fassi',
                'email' => 'omar@test.ma',
                'phone' => '0655667788',
                'location' => 'Marrakech Guéliz',
                'return_location' => 'Marrakech Guéliz',
            ],
            [
                'car_id' => $cars[0]->id,
                'start_date' => $now->copy()->addDays(15)->hour(8)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'end_date' => $now->copy()->addDays(16)->hour(20)->minute(0)->second(0)->format('Y-m-d H:i:s'),
                'total_price' => 250,
                'daily_price' => 250,
                'status' => 'PENDING',
                'first_name' => 'Imane',
                'last_name' => 'Bensouda',
                'email' => 'imane@test.ma',
                'phone' => '0699887766',
                'location' => 'Fès Ville Nouvelle',
                'return_location' => 'Fès Ville Nouvelle',
            ],
        ];

        foreach ($bookings as $booking) {
            Booking::create($booking);
        }
    }
}
