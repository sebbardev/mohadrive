<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

use Illuminate\Support\Facades\Auth;

class CarResource extends JsonResource
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
            'brand' => $this->brand,
            'model' => $this->model,
            'year' => $this->year,
            'price_per_day' => $this->price_per_day,
            'currency' => $this->currency,
            'fuel' => $this->fuel,
            'transmission' => $this->transmission,
            'category' => $this->category,
            'color' => $this->color,
            'image' => $this->image,
            'images' => $this->images,
            'description' => $this->description,
            'features' => $this->features,
            'deposit' => $this->deposit,
            'available' => $this->available,
            'plate_number' => $this->plate_number,
            'plate_letter' => $this->plate_letter,
            'plate_city_code' => $this->plate_city_code,
            'formatted_plate' => $this->formatted_plate,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
