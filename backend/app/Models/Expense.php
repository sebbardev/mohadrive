<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'car_id',
        'booking_id',
        'type',
        'amount',
        'date',
        'note',
        'is_automatic',
        'recurrence_type',
    ];

    protected $casts = [
        'amount' => 'float',
        'date' => 'date',
        'is_automatic' => 'boolean',
    ];

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
