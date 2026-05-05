<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\Auditable;

class Contract extends Model
{
    use Auditable;

    protected $fillable = [
        'car_id',
        'booking_id',
        'customer_id',
        'driver_first_name',
        'driver_last_name',
        'driver_birth_date',
        'driver_nationality',
        'driver_license_number',
        'driver_phone',
        'driver_email',
        'driver_cin_number',
        'cin_issue_date',
        'passport_number',
        'passport_issue_date',
        'second_driver_first_name',
        'second_driver_last_name',
        'second_driver_license_number',
        'second_driver_license_date',
        'second_driver_phone',
        'second_driver_email',
        'second_driver_cin_number',
        'second_driver_cin_issue_date',
        'second_driver_passport_number',
        'second_driver_passport_issue_date',
        'second_driver_address',
        'second_driver_birth_date',
        'second_driver_nationality',
        'start_date',
        'end_date',
        'driver_license_date',
        'driver_address',
        'initial_mileage',
        'fuel_level',
        'included_accessories',
        'insurance_deductible',
        'payment_method',
        'payment_terms',
        'is_paid',
        'pickup_location',
        'return_location',
        'total_price',
        'daily_price',
        'deposit_amount',
        'status',
        'pdf_path',
        'version',
        'actual_return_date',
        'return_mileage',
        'return_fuel_level',
        'return_damages',
        'deposit_status',
        'additional_charges',
        'return_notes',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'actual_return_date' => 'datetime',
        'driver_license_date' => 'date',
        'included_accessories' => 'array',
        'is_paid' => 'boolean',
        'total_price' => 'decimal:2',
        'daily_price' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'insurance_deductible' => 'decimal:2',
        'additional_charges' => 'decimal:2',
    ];

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
