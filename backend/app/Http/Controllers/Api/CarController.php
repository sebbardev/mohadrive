<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CarResource;
use App\Models\Car;
use App\Traits\Auditable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class CarController extends Controller
{
    use Auditable;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // OPTIMIZED: Add pagination and selective fields
        $query = Car::query();
        
        // Allow filtering by availability
        if ($request->has('available')) {
            $query->where('available', filter_var($request->available, FILTER_VALIDATE_BOOLEAN));
        }
        
        // Allow filtering by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }
        
        // Support pagination
        $perPage = $request->input('per_page', 15);
        $cars = $query->orderBy('created_at', 'desc')->paginate($perPage);
        
        return CarResource::collection($cars);
    }

    /**
     * Get featured cars for homepage hero.
     * Returns 3 random available cars
     */
    public function featured()
    {
        // OPTIMIZED: Cache the result for 5 minutes
        $featuredCars = \Cache::remember('featured_cars', 300, function () {
            return Car::where('available', true)
                ->inRandomOrder()
                ->limit(3)
                ->get();
        });

        return CarResource::collection($featuredCars);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'brand' => 'required|string',
            'model' => 'required|string',
            'year' => 'required|integer',
            'price_per_day' => 'required|numeric',
            'currency' => 'nullable|string',
            'fuel' => 'required|string',
            'transmission' => 'required|string',
            'category' => 'required|string',
            'image' => 'required|string',
            'images' => 'nullable|array',
            'features' => 'nullable|array',
            'description' => 'required|string',
            'deposit' => 'nullable|numeric',
            'available' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'plate_number' => 'required|regex:/^[0-9]{1,6}$/',
            'plate_letter' => 'required|in:أ,ب,ج,د,هـ,و,ز,ح,ط,ي,ك,ل,م,ن,س,ع,ف,ص,ق,ر,ش,ت,ث,خ,ذ,ض,ظ,غ',
            'plate_city_code' => 'required|regex:/^[0-9]{1,2}$/',
        ], [
            'plate_number.regex' => 'Le numéro de plaque doit contenir uniquement des chiffres (max 6).',
            'plate_letter.in' => 'La lettre de plaque doit être une lettre arabe valide.',
            'plate_city_code.regex' => 'Le code ville doit contenir uniquement des chiffres (1-2).',
        ]);

        $car = Car::create($validated);

        $this->logAction('CREATE_CAR', 'Car', $car->id, $car->toArray());

        return new CarResource($car);
    }

    /**
     * Display the specified resource.
     */
    public function show(Car $car)
    {
        return new CarResource($car);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Car $car)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'brand' => 'string',
            'model' => 'string',
            'year' => 'integer',
            'price_per_day' => 'numeric',
            'currency' => 'nullable|string',
            'fuel' => 'string',
            'transmission' => 'string',
            'category' => 'string',
            'image' => 'string',
            'images' => 'nullable|array',
            'features' => 'nullable|array',
            'description' => 'string',
            'deposit' => 'numeric',
            'available' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'plate_number' => 'nullable|regex:/^[0-9]{1,6}$/',
            'plate_letter' => 'nullable|in:أ,ب,ج,د,هـ,و,ز,ح,ط,ي,ك,ل,م,ن,س,ع,ف,ص,ق,ر,ش,ت,ث,خ,ذ,ض,ظ,غ',
            'plate_city_code' => 'nullable|regex:/^[0-9]{1,2}$/',
        ], [
            'plate_number.regex' => 'Le numéro de plaque doit contenir uniquement des chiffres (max 6).',
            'plate_letter.in' => 'La lettre de plaque doit être une lettre arabe valide.',
            'plate_city_code.regex' => 'Le code ville doit contenir uniquement des chiffres (1-2).',
        ]);

        $oldData = $car->toArray();
        $car->update($validated);

        $this->logAction('UPDATE_CAR', 'Car', $car->id, ['old' => $oldData, 'new' => $car->toArray()]);

        return new CarResource($car);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Car $car)
    {
        $this->authorizeAdmin();

        if ($car->expenses()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer ce véhicule car des charges y sont associées.'
            ], 422);
        }

        if ($car->bookings()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer ce véhicule car des réservations y sont associées.'
            ], 422);
        }
        
        $oldData = $car->toArray();
        $car->delete();

        $this->logAction('DELETE_CAR', 'Car', $oldData['id'], $oldData);

        return response()->json(['message' => 'Véhicule supprimé avec succès']);
    }

    /**
     * Toggle featured status of a car.
     */
    public function toggleFeatured(Car $car)
    {
        $this->authorizeAdmin();

        $car->update(['is_featured' => !$car->is_featured]);

        $this->logAction('TOGGLE_FEATURED_CAR', 'Car', $car->id, ['is_featured' => $car->is_featured]);

        return new CarResource($car);
    }

    private function authorizeAdmin()
    {
        if (! Auth::user()->isAdmin()) {
            abort(403, 'Action non autorisée pour les utilisateurs non-administrateurs.');
        }
    }
}
