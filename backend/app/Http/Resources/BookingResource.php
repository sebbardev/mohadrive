<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => $this->whenLoaded('user'),
            'car' => new CarResource($this->whenLoaded('car')),
            'car_id' => $this->car_id,
            'start_date' => $this->start_date->toDateString(),
            'end_date' => $this->end_date->toDateString(),
            'total_price' => $this->total_price,
            'daily_price' => $this->daily_price,
            'status' => $this->status,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'location' => $this->location,
            'return_location' => $this->return_location,
            'return_checked_at' => $this->return_checked_at,
            'return_mileage' => $this->return_mileage,
            'return_condition' => $this->return_condition,
            'return_note' => $this->return_note,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
