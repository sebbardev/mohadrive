<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Car;
use App\Models\Booking;
use App\Traits\Auditable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class ExpenseController extends Controller
{
    use Auditable;

    public function index(Request $request)
    {
        $query = Expense::with(['car', 'booking']);

        if ($request->filled('car_id')) {
            $query->where('car_id', $request->car_id);
        }

        if ($request->filled('booking_id')) {
            $query->where('booking_id', $request->booking_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('from')) {
            $query->where('date', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->where('date', '<=', $request->to);
        }

        return response()->json($query->orderBy('date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'booking_id' => 'nullable|exists:bookings,id',
            'type' => 'required|string|in:crédit,assurance,entretien,vidange,réparation,lavage,vignette,visite technique,amendes,autres frais',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'note' => 'nullable|string',
        ]);

        if (! empty($validated['booking_id'])) {
            $booking = Booking::find($validated['booking_id']);
            if ($booking && (string) $booking->car_id !== (string) $validated['car_id']) {
                return response()->json([
                    'message' => 'La réservation sélectionnée ne correspond pas au véhicule.',
                ], 422);
            }
        }

        $expense = Expense::create($validated);

        $this->logAction('CREATE_EXPENSE', 'Expense', $expense->id, $expense->toArray());

        return response()->json($expense, 201);
    }

    public function show(Expense $expense)
    {
        return response()->json($expense->load('car'));
    }

    public function update(Request $request, Expense $expense)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'car_id' => 'exists:cars,id',
            'booking_id' => 'nullable|exists:bookings,id',
            'type' => 'string|in:crédit,assurance,entretien,vidange,réparation,lavage,vignette,visite technique,amendes,autres frais',
            'amount' => 'numeric|min:0',
            'date' => 'date',
            'note' => 'nullable|string',
        ]);

        $carId = array_key_exists('car_id', $validated) ? $validated['car_id'] : $expense->car_id;
        $bookingId = array_key_exists('booking_id', $validated) ? $validated['booking_id'] : $expense->booking_id;
        if (! empty($bookingId)) {
            $booking = Booking::find($bookingId);
            if ($booking && (string) $booking->car_id !== (string) $carId) {
                return response()->json([
                    'message' => 'La réservation sélectionnée ne correspond pas au véhicule.',
                ], 422);
            }
        }

        $oldData = $expense->toArray();
        $expense->update($validated);

        $this->logAction('UPDATE_EXPENSE', 'Expense', $expense->id, ['old' => $oldData, 'new' => $expense->toArray()]);

        return response()->json($expense);
    }

    public function destroy(Expense $expense)
    {
        $this->authorizeAdmin();

        $oldData = $expense->toArray();
        $expense->delete();

        $this->logAction('DELETE_EXPENSE', 'Expense', $oldData['id'], $oldData);

        return response()->json(['message' => 'Charge supprimée avec succès']);
    }

    public function dashboard(Request $request)
    {
        $period = $request->input('period', 'monthly'); // monthly, quarterly, yearly
        $carId = $request->input('car_id');

        // OPTIMIZED: Use aggregate queries instead of loading all data into memory
        $revenueQuery = Booking::where('status', '!=', 'CANCELLED');
        $expenseQuery = Expense::query();

        if ($carId) {
            $revenueQuery->where('car_id', $carId);
            $expenseQuery->where('car_id', $carId);
        }
        
        $totalRevenue = $revenueQuery->sum('total_price');
        $totalExpenses = $expenseQuery->sum('amount');
        
        // OPTIMIZED: Calculate credit total with single query
        $creditQuery = Expense::where('is_automatic', true)->where('type', 'crédit');
        if ($carId) {
            $creditQuery->where('car_id', $carId);
        }
        $creditTotal = $creditQuery->sum('amount');
        
        // OPTIMIZED: Use single query with GROUP BY for per-car stats
        $carsQuery = Car::with([
            'bookings' => fn($q) => $q->where('status', '!=', 'CANCELLED'),
            'expenses'
        ]);
        
        if ($carId) {
            $carsQuery->where('id', $carId);
        }
        
        $cars = $carsQuery->get()->map(function ($car) {
            $revenue = $car->bookings->sum('total_price');
            $totalExpenses = $car->expenses->sum('amount');
            
            // Séparer les charges pour l'affichage
            $manualExpenses = $car->expenses->filter(fn($e) => !$e->is_automatic);
            $automaticExpenses = $car->expenses->filter(fn($e) => $e->is_automatic);
            
            $creditAmount = $automaticExpenses
                ->filter(fn($e) => $e->type === 'crédit')
                ->sum('amount');
            
            $maintenanceAmount = $manualExpenses->sum('amount') +
                $automaticExpenses
                    ->filter(fn($e) => in_array($e->type, ['assurance', 'vignette']))
                    ->sum('amount');
            
            return [
                'car_id' => $car->id,
                'brand' => $car->brand,
                'model' => $car->model,
                'total_revenue' => (float) $revenue,
                'total_expenses' => (float) $totalExpenses,
                'credit_amount' => (float) $creditAmount,
                'maintenance_amount' => (float) $maintenanceAmount,
                'net_gain' => (float) ($revenue - $totalExpenses),
            ];
        });

        return response()->json([
            'summary' => [
                'total_revenue' => (float) $totalRevenue,
                'total_expenses' => (float) $totalExpenses,
                'total_net_gain' => (float) ($totalRevenue - $totalExpenses),
                'credit_total' => (float) $creditTotal,
                'break_even_ratio' => $totalExpenses > 0 ? ($totalRevenue / $totalExpenses) * 100 : ($totalRevenue > 0 ? 100 : 0),
            ],
            'per_car' => $cars
        ]);
    }

    private function authorizeAdmin()
    {
        $user = Auth::guard('sanctum')->user() ?? Auth::user();
        if (! $user || ! $user->isAdmin()) {
            abort(403, 'Action non autorisée.');
        }
    }
}
