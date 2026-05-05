<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Car extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'brand',
        'model',
        'year',
        'price_per_day',
        'currency',
        'fuel',
        'transmission',
        'category',
        'image',
        'images',
        'description',
        'features',
        'deposit',
        'available',
        'is_featured',
        'plate_number',
        'plate_letter',
        'plate_city_code',
        'color',
    ];

    /**
     * Get the full formatted license plate.
     */
    public function getFormattedPlateAttribute(): ?string
    {
        if (!$this->plate_number || !$this->plate_letter || !$this->plate_city_code) {
            return null;
        }
        return "{$this->plate_number} / {$this->plate_letter} / {$this->plate_city_code}";
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'images' => 'array',
            'features' => 'array',
            'available' => 'boolean',
            'is_featured' => 'boolean',
            'price_per_day' => 'float',
            'deposit' => 'float',
        ];
    }

    /**
     * Get the bookings for the car.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }
}
