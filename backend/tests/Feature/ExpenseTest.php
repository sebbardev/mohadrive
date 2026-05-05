<?php

namespace Tests\Feature;

use App\Models\Car;
use App\Models\Expense;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpenseTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_expense()
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);
        $car = Car::factory()->create();

        $response = $this->actingAs($admin)->postJson('/api/expenses', [
            'car_id' => $car->id,
            'type' => 'entretien',
            'amount' => 500,
            'date' => '2026-03-26',
            'note' => 'Test expense',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('expenses', ['amount' => 500]);
    }

    public function test_negative_amount_is_invalid()
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);
        $car = Car::factory()->create();

        $response = $this->actingAs($admin)->postJson('/api/expenses', [
            'car_id' => $car->id,
            'type' => 'entretien',
            'amount' => -100,
            'date' => '2026-03-26',
        ]);

        $response->assertStatus(422);
    }

    public function test_net_gain_calculation()
    {
        $car = Car::factory()->create(['price_per_day' => 100]);
        
        // Revenue: 5 days * 100 = 500
        Booking::create([
            'car_id' => $car->id,
            'start_date' => '2026-01-01',
            'end_date' => '2026-01-06',
            'total_price' => 500,
            'status' => 'CONFIRMED',
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@user.com',
            'phone' => '12345678',
            'location' => 'Marrakech',
        ]);

        // Expenses: 200
        Expense::create([
            'car_id' => $car->id,
            'type' => 'entretien',
            'amount' => 200,
            'date' => '2026-01-05',
        ]);

        $response = $this->getJson('/api/expenses/dashboard?car_id=' . $car->id);

        $response->assertStatus(200);
        $this->assertEquals(500, $response->json('summary.total_revenue'));
        $this->assertEquals(200, $response->json('summary.total_expenses'));
        $this->assertEquals(300, $response->json('summary.total_net_gain'));
    }
}
