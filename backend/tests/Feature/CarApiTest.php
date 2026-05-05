<?php

namespace Tests\Feature;

use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CarApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test anyone can list cars.
     */
    public function test_anyone_can_list_cars(): void
    {
        Car::factory()->count(3)->create();

        $response = $this->getJson('/api/cars');

        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
    }

    /**
     * Test only admin can create a car.
     */
    public function test_only_admin_can_create_a_car(): void
    {
        $user = User::factory()->create(['role' => 'USER']);
        $admin = User::factory()->create(['role' => 'ADMIN']);

        $carData = [
            'brand' => 'Dacia',
            'model' => 'Logan',
            'year' => 2024,
            'price_per_day' => 300,
            'fuel' => 'Diesel',
            'transmission' => 'Manuelle',
            'category' => 'Berline',
            'image' => 'dacia-logan.jpg',
            'description' => 'Confortable et économique.',
            'available' => true,
            'plate_number' => '22222',
            'plate_letter' => 'أ',
            'plate_city_code' => '1',
        ];

        // Guest cannot create
        $this->postJson('/api/cars', $carData)->assertStatus(401);

        // User cannot create
        $this->actingAs($user)->postJson('/api/cars', $carData)->assertStatus(403);

        // Admin can create
        $this->actingAs($admin)->postJson('/api/cars', $carData)->assertStatus(201);
        $this->assertDatabaseHas('cars', ['brand' => 'Dacia']);
    }
}
