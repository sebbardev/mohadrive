<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UnavailabilityResource;
use App\Models\Booking;
use App\Models\Unavailability;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class UnavailabilityController extends Controller
{
    public function index(Request $request)
    {
        $query = Unavailability::with('car')->orderBy('start_date', 'asc');

        if ($request->filled('from')) {
            $from = Carbon::parse($request->input('from'))->startOfDay();
            $query->where('end_date', '>=', $from);
        }

        if ($request->filled('to')) {
            $to = Carbon::parse($request->input('to'))->endOfDay();
            $query->where('start_date', '<=', $to);
        }

        if ($request->filled('car_id')) {
            $query->where('car_id', $request->input('car_id'));
        }

        return UnavailabilityResource::collection($query->get());
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (! $user || ! $user->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'type' => 'required|string|max:255',
            'note' => 'nullable|string',
        ]);

        $start = Carbon::parse($validated['start_date'])->startOfDay();
        $end = Carbon::parse($validated['end_date'])->endOfDay();

        $conflictingBookingExists = Booking::where('car_id', $validated['car_id'])
            ->where('status', '!=', 'CANCELLED')
            ->where('start_date', '<=', $end)
            ->where('end_date', '>=', $start)
            ->exists();

        if ($conflictingBookingExists) {
            return response()->json([
                'message' => 'Impossible de bloquer: des réservations existent déjà sur cette période.',
            ], 409);
        }

        $conflictingUnavailabilityExists = Unavailability::where('car_id', $validated['car_id'])
            ->where('start_date', '<=', $end)
            ->where('end_date', '>=', $start)
            ->exists();

        if ($conflictingUnavailabilityExists) {
            return response()->json([
                'message' => 'Cette voiture est déjà bloquée sur une partie de cette période.',
            ], 409);
        }

        $unavailability = Unavailability::create([
            'car_id' => $validated['car_id'],
            'start_date' => $start,
            'end_date' => $end,
            'type' => $validated['type'],
            'note' => $validated['note'] ?? null,
        ]);

        return new UnavailabilityResource($unavailability->load('car'));
    }

    public function destroy(Request $request, Unavailability $unavailability)
    {
        $user = $request->user();
        if (! $user || ! $user->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $unavailability->delete();

        return response()->json(['message' => 'Blocage supprimé']);
    }
}

