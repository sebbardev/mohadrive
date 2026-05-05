<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Car>
 */
class CarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'brand' => $this->faker->company(),
            'model' => $this->faker->word(),
            'year' => $this->faker->year(),
            'price_per_day' => $this->faker->randomFloat(2, 200, 1000),
            'currency' => 'MAD',
            'fuel' => $this->faker->randomElement(['Diesel', 'Essence', 'Hybride', 'Electrique']),
            'transmission' => $this->faker->randomElement(['Automatique', 'Manuelle']),
            'category' => $this->faker->randomElement(['Luxe', 'Berline', 'SUV', 'Economique']),
            'image' => $this->faker->imageUrl(),
            'description' => $this->faker->paragraph(),
            'available' => true,
        ];
    }
}
