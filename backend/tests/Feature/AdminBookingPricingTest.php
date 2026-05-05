<?php

namespace Tests\Feature;

use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
use Illuminate\Support\Carbon;

class AdminBookingPricingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test calculation of total price for admin booking with manual override.
     */
    public function test_admin_can_set_manual_daily_price_and_calculate_total_correct()
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);
        Sanctum::actingAs($admin);

        $car = Car::factory()->create(['price_per_day' => 500]);

        // Période du 4 février 2026 au 4 décembre 2026 (304 jours inclusifs)
        $startDate = '2026-02-04';
        $endDate = '2026-12-04';
        $dailyPrice = 250;

        $response = $this->postJson('/api/bookings', [
            'car_id' => $car->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'first_name' => 'Admin',
            'last_name' => 'Test',
            'email' => 'admin-test@example.com',
            'phone' => '0600000000',
            'location' => 'Agence',
            'daily_price' => $dailyPrice,
            'status' => 'CONFIRMED'
        ]);

        $response->assertStatus(201);
        
        $booking = $response->json('data');
        
        // 304 jours * 250 DH = 76 000 DH
        $this->assertEquals(76000, $booking['total_price']);
        $this->assertEquals(250, $booking['daily_price']);
    }

    /**
     * Test that admin can override total_price directly.
     */
    public function test_admin_can_override_total_price_directly()
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);
        Sanctum::actingAs($admin);

        $car = Car::factory()->create(['price_per_day' => 500]);

        $response = $this->postJson('/api/bookings', [
            'car_id' => $car->id,
            'start_date' => '2026-02-04',
            'end_date' => '2026-02-10', // 7 jours inclusifs
            'first_name' => 'Admin',
            'last_name' => 'Test',
            'email' => 'admin-test-total@example.com',
            'phone' => '0600000000',
            'location' => 'Agence',
            'total_price' => 1000, // Override total direct
            'status' => 'CONFIRMED'
        ]);

        $response->assertStatus(201);
        
        $booking = $response->json('data');
        
        // Le total_price devrait être 1000, ignorant le calcul jours * daily_price
        $this->assertEquals(1000, $booking['total_price']);
    }

    /**
     * Test that regular user cannot override daily_price.
     */
    public function test_regular_user_cannot_override_daily_price()
    {
        $user = User::factory()->create(['role' => 'USER']);
        Sanctum::actingAs($user);

        $car = Car::factory()->create(['price_per_day' => 500]);

        $response = $this->postJson('/api/bookings', [
            'car_id' => $car->id,
            'start_date' => '2026-02-04',
            'end_date' => '2026-02-05', // 2 jours inclusifs
            'first_name' => 'User',
            'last_name' => 'Test',
            'email' => 'user-test@example.com',
            'phone' => '0600000000',
            'location' => 'Agence',
            'daily_price' => 100, // Tentative d'override
        ]);

        $response->assertStatus(201);
        
        $booking = $response->json('data');
        
        // Le prix devrait être 500 * 2 = 1000, ignorant l'override de l'utilisateur
        $this->assertEquals(1000, $booking['total_price']);
    }
}
