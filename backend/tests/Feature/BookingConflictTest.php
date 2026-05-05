<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Car;
use App\Models\Unavailability;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingConflictTest extends TestCase
{
    use RefreshDatabase;

    public function test_booking_conflict_is_rejected(): void
    {
        $car = Car::factory()->create(['price_per_day' => 300]);

        $payload = [
            'car_id' => $car->id,
            'start_date' => '2026-03-01',
            'end_date' => '2026-03-05',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '0600000000',
            'location' => 'Aéroport Oujda',
        ];

        $this->postJson('/api/bookings', $payload)->assertStatus(201);

        $this->postJson('/api/bookings', [
            ...$payload,
            'start_date' => '2026-03-04',
            'end_date' => '2026-03-06',
        ])->assertStatus(409);
    }

    public function test_booking_is_allowed_if_previous_is_cancelled(): void
    {
        $car = Car::factory()->create(['price_per_day' => 300]);

        $payload = [
            'car_id' => $car->id,
            'start_date' => '2026-03-01',
            'end_date' => '2026-03-05',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '0600000000',
            'location' => 'Aéroport Oujda',
        ];

        $response = $this->postJson('/api/bookings', $payload)->assertStatus(201);
        $bookingId = $response->json('data.id');

        $this->patchJson("/api/bookings/{$bookingId}", ['status' => 'CANCELLED'])->assertStatus(200);

        $this->postJson('/api/bookings', [
            ...$payload,
            'start_date' => '2026-03-04',
            'end_date' => '2026-03-06',
        ])->assertStatus(201);
    }

    public function test_booking_conflict_with_unavailability_is_rejected(): void
    {
        $car = Car::factory()->create(['price_per_day' => 300]);

        Unavailability::create([
            'car_id' => $car->id,
            'start_date' => '2026-03-10 00:00:00',
            'end_date' => '2026-03-12 23:59:59',
            'type' => 'MAINTENANCE',
            'note' => 'Vidange',
        ]);

        $payload = [
            'car_id' => $car->id,
            'start_date' => '2026-03-11',
            'end_date' => '2026-03-13',
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
            'phone' => '0600000001',
            'location' => 'Centre ville',
        ];

        $this->postJson('/api/bookings', $payload)->assertStatus(409);
    }
}

