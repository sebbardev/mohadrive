<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Car;
use App\Models\Expense;
use App\Models\Unavailability;
use App\Models\Notification as NotificationModel;
use App\Models\User;
use App\Notifications\BookingCreatedNotification;
use App\Services\UnifiedEmailService;
use App\Traits\Auditable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Carbon;

class BookingController extends Controller
{
    use Auditable;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // On retourne toutes les réservations pour l'admin sans auth pour le test
        $query = Booking::with('car');
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->filled('date')) {
            $query->whereDate('start_date', '<=', $request->date)
                ->whereDate('end_date', '>=', $request->date);
        }

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

        // Support sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        
        // Validate sort columns to prevent SQL injection
        $allowedSortColumns = ['created_at', 'start_date', 'end_date', 'total_price', 'status'];
        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'created_at';
        }
        
        // Validate sort order
        $sortOrder = in_array(strtolower($sortOrder), ['asc', 'desc']) ? $sortOrder : 'desc';
        
        // Support pagination with per_page parameter
        $perPage = $request->input('per_page', 15);
        
        // Return paginated results if page parameter exists, otherwise return all
        if ($request->has('page')) {
            return BookingResource::collection(
                $query->orderBy($sortBy, $sortOrder)->paginate($perPage)
            );
        }
        
        return BookingResource::collection($query->orderBy($sortBy, $sortOrder)->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'customer_id' => 'nullable|exists:customers,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'location' => 'required|string',
            'return_location' => 'nullable|string',
            'daily_price' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:PENDING,CONFIRMED,IN_PROGRESS,CANCELLED,COMPLETED',
        ]);

        $car = Car::findOrFail($validated['car_id']);

        // Gérer le client (trouver ou créer si non fourni)
        $customerId = $validated['customer_id'] ?? null;
        if (!$customerId) {
            $customer = \App\Models\Customer::firstOrCreate(
                ['email' => $validated['email']],
                [
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'phone' => $validated['phone'],
                ]
            );
            $customerId = $customer->id;
        }

        $start = Carbon::parse($validated['start_date'])->startOfDay();
        $end = Carbon::parse($validated['end_date'])->endOfDay();
        $isAdmin = (bool) Auth::guard('sanctum')->user()?->isAdmin();

        // Conflits de réservation (sauf si l'admin force?)
        $conflictingBookingExists = Booking::where('car_id', $validated['car_id'])
            ->where('status', '!=', 'CANCELLED')
            ->where('start_date', '<=', $end)
            ->where('end_date', '>=', $start)
            ->exists();

        if ($conflictingBookingExists) {
            return response()->json([
                'message' => 'Cette voiture est déjà réservée sur cette période.',
            ], 409);
        }

        $conflictingUnavailabilityExists = Unavailability::where('car_id', $validated['car_id'])
            ->where('start_date', '<=', $end)
            ->where('end_date', '>=', $start)
            ->exists();

        if ($conflictingUnavailabilityExists) {
            return response()->json([
                'message' => 'Cette voiture est indisponible sur cette période (maintenance / blocage).',
            ], 409);
        }

        // Calcul du nombre de jours inclusifs
        $days = (int) $start->diffInDays($end->copy()->addSecond());
        if ($days <= 0) $days = 1;

        $dailyPrice = ($isAdmin && array_key_exists('daily_price', $validated) && $validated['daily_price'] !== null)
            ? (float) $validated['daily_price']
            : (float) $car->price_per_day;
        
        $totalPrice = $days * $dailyPrice;

        // Si l'admin envoie un total_price spécifique, on l'utilise
        if ($isAdmin && $request->has('total_price')) {
            $totalPrice = (float) $request->input('total_price');
        }

        $booking = Booking::create(array_merge($validated, [
            'customer_id' => $customerId,
            'user_id' => Auth::guard('sanctum')->id(),
            'total_price' => $totalPrice,
            'daily_price' => $dailyPrice,
            'status' => ($isAdmin && ! empty($validated['status'])) ? $validated['status'] : 'PENDING',
        ]));

        $this->logAction('CREATE_BOOKING', 'Booking', $booking->id, $booking->toArray());

        // Create in-app notification for all admins
        // Créer une notification pour tous les administrateurs
        try {
            NotificationModel::createForAdmins(
                'BOOKING',
                'Nouvelle Réservation',
                "{$booking->first_name} {$booking->last_name} a réservé {$car->brand} {$car->model} pour le " . 
                Carbon::parse($booking->start_date)->format('d/m/Y à H:i'),
                [
                    'booking_id' => $booking->id,
                    'customer_name' => "{$booking->first_name} {$booking->last_name}",
                    'car_name' => "{$car->brand} {$car->model}",
                    'total_price' => $booking->total_price,
                ]
            );
        } catch (\Exception $e) {
            \Log::error('Failed to create booking notification: ' . $e->getMessage());
        }

        // Envoyer un email stylisé à tous les administrateurs
        UnifiedEmailService::sendNewBookingNotification($booking);

        // Envoyer un email de confirmation au client (style MOHADRIVE)
        UnifiedEmailService::sendBookingConfirmation($booking);

        return new BookingResource($booking);
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        return new BookingResource($booking->load('car'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|in:PENDING,CONFIRMED,IN_PROGRESS,CANCELLED,COMPLETED',
        ]);

        $newStatus = $validated['status'];

        // Si on essaie de confirmer ou remettre en attente une réservation, on vérifie les conflits
        if (in_array($newStatus, ['CONFIRMED', 'PENDING', 'IN_PROGRESS'])) {
            $start = Carbon::parse($booking->start_date);
            $end = Carbon::parse($booking->end_date);

            $conflictingBookingExists = Booking::where('car_id', $booking->car_id)
                ->where('id', '!=', $booking->id) // Exclure la réservation actuelle
                ->where('status', '!=', 'CANCELLED')
                ->where('start_date', '<=', $end)
                ->where('end_date', '>=', $start)
                ->exists();

            if ($conflictingBookingExists) {
                return response()->json([
                    'message' => 'Impossible de confirmer : un conflit de réservation existe déjà sur cette période.',
                ], 409);
            }

            $conflictingUnavailabilityExists = Unavailability::where('car_id', $booking->car_id)
                ->where('start_date', '<=', $end)
                ->where('end_date', '>=', $start)
                ->exists();

            if ($conflictingUnavailabilityExists) {
                return response()->json([
                    'message' => 'Impossible de confirmer : la voiture est indisponible (maintenance/blocage) sur cette période.',
                ], 409);
            }
        }

        $oldStatus = $booking->status;
        $booking->update($validated);

        $this->logAction('UPDATE_BOOKING_STATUS', 'Booking', $booking->id, ['old' => $oldStatus, 'new' => $booking->status]);

        // Envoyer un email stylisé au client si la réservation est confirmée
        if ($oldStatus !== 'CONFIRMED' && $booking->status === 'CONFIRMED') {
            UnifiedEmailService::sendBookingConfirmation($booking);
        }

        return new BookingResource($booking);
    }

    public function returnIntake(Request $request, Booking $booking)
    {
        $this->authorizeAdmin();

        if ($booking->return_checked_at) {
            return response()->json([
                'message' => 'Le retour de cette réservation a déjà été traité.',
            ], 409);
        }

        $validated = $request->validate([
            'return_mileage' => 'nullable|integer|min:0',
            'return_condition' => 'nullable|string|in:bon,moyen,mauvais',
            'return_note' => 'nullable|string',
            'expenses' => 'nullable|array',
            'expenses.*.type' => 'required_with:expenses|string|in:crédit,assurance,entretien,vidange,réparation,lavage,vignette,visite technique,amendes,autres frais',
            'expenses.*.amount' => 'required_with:expenses|numeric|min:0',
            'expenses.*.date' => 'nullable|date',
            'expenses.*.note' => 'nullable|string',
        ]);

        $expenseItems = $validated['expenses'] ?? [];

        $createdExpenses = [];
        foreach ($expenseItems as $item) {
            $createdExpenses[] = Expense::create([
                'car_id' => $booking->car_id,
                'booking_id' => $booking->id,
                'type' => $item['type'],
                'amount' => $item['amount'],
                'date' => $item['date'] ?? Carbon::now()->toDateString(),
                'note' => $item['note'] ?? null,
            ]);
        }

        $booking->update([
            'status' => 'COMPLETED',
            'return_mileage' => array_key_exists('return_mileage', $validated) ? $validated['return_mileage'] : null,
            'return_condition' => array_key_exists('return_condition', $validated) ? $validated['return_condition'] : null,
            'return_note' => array_key_exists('return_note', $validated) ? $validated['return_note'] : null,
            'return_checked_at' => Carbon::now(),
        ]);

        $booking->car()->update(['available' => true]);

        $this->logAction('RETURN_INTAKE', 'Booking', $booking->id, [
            'booking_id' => $booking->id,
            'car_id' => $booking->car_id,
            'expenses_count' => count($createdExpenses),
        ]);

        return response()->json([
            'booking' => new BookingResource($booking->load('car')),
            'expenses' => $createdExpenses,
        ], 201);
    }

    private function authorizeAdmin(): void
    {
        $user = Auth::guard('sanctum')->user();
        if (! $user || ! $user->isAdmin()) {
            abort(403, 'Action non autorisée.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        $booking->delete();
        return response()->json(['message' => 'Réservation supprimée']);
    }

    private function authorizeAccess(Booking $booking)
    {
        $user = Auth::user();
        if (! $user->isAdmin() && $booking->user_id !== $user->id) {
            abort(403, 'Accès non autorisé.');
        }
    }
}
