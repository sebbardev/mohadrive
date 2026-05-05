<?php

namespace Tests\Feature;

use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CarPlateTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_car_with_plate()
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);

        $response = $this->actingAs($admin)->postJson('/api/cars', [
            'brand' => 'Dacia',
            'model' => 'Logan',
            'year' => 2022,
            'price_per_day' => 250,
            'fuel' => 'Diesel',
            'transmission' => 'Manuelle',
            'category' => 'Berline',
            'image' => 'test.jpg',
            'description' => 'Test description',
            'plate_number' => '12345',
            'plate_letter' => 'أ',
            'plate_city_code' => '48',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('cars', [
            'plate_number' => '12345',
            'plate_letter' => 'أ',
            'plate_city_code' => '48',
        ]);
    }

    public function test_plate_validation_rules()
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);

        // Invalid number (not numeric)
        $response = $this->actingAs($admin)->postJson('/api/cars', [
            'brand' => 'Dacia',
            'plate_number' => 'ABCDE',
            'plate_letter' => 'أ',
            'plate_city_code' => '48',
        ]);
        $response->assertStatus(422);

        // Invalid letter (not in list)
        $response = $this->actingAs($admin)->postJson('/api/cars', [
            'brand' => 'Dacia',
            'plate_number' => '12345',
            'plate_letter' => 'X',
            'plate_city_code' => '48',
        ]);
        $response->assertStatus(422);

        // Invalid city code (too long)
        $response = $this->actingAs($admin)->postJson('/api/cars', [
            'brand' => 'Dacia',
            'plate_number' => '12345',
            'plate_letter' => 'أ',
            'plate_city_code' => '123',
        ]);
        $response->assertStatus(422);
    }

    public function test_plate_visibility_is_restricted_to_admin()
    {
        $car = Car::factory()->create([
            'plate_number' => '12345',
            'plate_letter' => 'أ',
            'plate_city_code' => '48',
        ]);

        // Non-admin request
        $response = $this->getJson("/api/cars/{$car->id}");
        $response->assertStatus(200);
        $response->assertJsonMissing(['plate_number', 'plate_letter', 'plate_city_code', 'formatted_plate']);

        // Admin request
        $admin = User::factory()->create(['role' => 'ADMIN']);
        $response = $this->actingAs($admin)->getJson("/api/cars/{$car->id}");
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'plate_number' => '12345',
            'plate_letter' => 'أ',
            'plate_city_code' => '48',
            'formatted_plate' => '12345 / أ / 48',
        ]);
    }
}
