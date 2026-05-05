<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\Booking;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class StatsController extends Controller
{
    public function index(Request $request)
    {
        // Gestion de la période
        $period = $request->input('period', 'all'); // all, month, quarter, year, custom
        $from = $request->input('from');
        $to = $request->input('to');
        $carId = $request->input('car_id'); // Filtre par voiture

        $now = Carbon::now();
        $startDate = null;
        $endDate = $now;

        // Déterminer la période
        if ($from && $to) {
            $startDate = Carbon::parse($from);
            $endDate = Carbon::parse($to);
        } else {
            switch ($period) {
                case 'month':
                    $startDate = Carbon::now()->startOfMonth();
                    break;
                case 'quarter':
                    $startDate = Carbon::now()->startOfQuarter();
                    break;
                case 'year':
                    $startDate = Carbon::now()->startOfYear();
                    break;
                case 'all':
                default:
                    $startDate = null; // Pas de limite
                    break;
            }
        }

        // Queries de base
        $bookingQuery = Booking::where('status', '!=', 'CANCELLED');
        $expenseQuery = Expense::query();

        // Appliquer le filtre par voiture si spécifié
        if ($carId) {
            $bookingQuery->where('car_id', $carId);
            $expenseQuery->where('car_id', $carId);
        }

        // Appliquer les filtres de date
        if ($startDate) {
            $bookingQuery->where('start_date', '>=', $startDate);
            $expenseQuery->where('date', '>=', $startDate);
        }
        $bookingQuery->where('start_date', '<=', $endDate);
        $expenseQuery->where('date', '<=', $endDate);

        // Statistiques globales
        $totalCars = Car::count();
        $activeBookings = $carId 
            ? Booking::where('car_id', $carId)->whereIn('status', ['CONFIRMED', 'IN_PROGRESS'])->count()
            : Booking::whereIn('status', ['CONFIRMED', 'IN_PROGRESS'])->count();
        $pendingBookings = $carId 
            ? Booking::where('car_id', $carId)->where('status', 'PENDING')->count()
            : Booking::where('status', 'PENDING')->count();
        $completedBookings = $carId 
            ? Booking::where('car_id', $carId)->whereIn('status', ['COMPLETED', 'CONFIRMED', 'IN_PROGRESS'])->count()
            : Booking::whereIn('status', ['COMPLETED', 'CONFIRMED', 'IN_PROGRESS'])->count();
        
        $totalRevenue = $bookingQuery->sum('total_price');
        $totalExpenses = $expenseQuery->sum('amount');
        $netGain = $totalRevenue - $totalExpenses;

        // Revenue vs Expenses by month for the last 6 months (avec filtres)
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthName = $date->translatedFormat('M');
            $yearMonth = $date->format('Y-m');

            $monthBookingQuery = Booking::where('status', '!=', 'CANCELLED')
                ->where('start_date', 'like', "$yearMonth%");
            
            $monthExpenseQuery = Expense::where('date', 'like', "$yearMonth%");
            
            // Appliquer le filtre par voiture
            if ($carId) {
                $monthBookingQuery->where('car_id', $carId);
                $monthExpenseQuery->where('car_id', $carId);
            }
            
            // Appliquer le filtre de date si période personnalisée
            if ($startDate) {
                $monthBookingQuery->where('start_date', '>=', $startDate);
                $monthExpenseQuery->where('date', '>=', $startDate);
            }
            $monthBookingQuery->where('start_date', '<=', $endDate);
            $monthExpenseQuery->where('date', '<=', $endDate);

            $rev = $monthBookingQuery->sum('total_price');
            $exp = $monthExpenseQuery->sum('amount');

            $months[] = [
                'name' => $monthName,
                'revenue' => (float) $rev,
                'expenses' => (float) $exp,
                'profit' => (float) ($rev - $exp)
            ];
        }

        // Expense breakdown by type (avec filtres)
        $expenseTypeQuery = Expense::select('type', DB::raw('SUM(amount) as total_amount'));
        
        if ($carId) {
            $expenseTypeQuery->where('car_id', $carId);
        }
        if ($startDate) {
            $expenseTypeQuery->where('date', '>=', $startDate);
        }
        $expenseTypeQuery->where('date', '<=', $endDate)
            ->groupBy('type');
        
        $expenseTypeStats = $expenseTypeQuery->get()
            ->map(fn ($row) => [
                'type' => $row->type,
                'amount' => (float) $row->total_amount,
            ]);

        // Profit per car (Revenue - Expenses) sorted descending with details
        // OPTIMIZED: Use single query with GROUP BY instead of N+1 queries
        $carsProfitQuery = Car::with(['bookings' => function($q) use ($startDate, $endDate) {
                $q->where('status', '!=', 'CANCELLED');
                if ($startDate) {
                    $q->where('start_date', '>=', $startDate);
                }
                $q->where('start_date', '<=', $endDate);
            }, 'expenses' => function($q) use ($startDate, $endDate) {
                if ($startDate) {
                    $q->where('date', '>=', $startDate);
                }
                $q->where('date', '<=', $endDate);
            }])
            ->get()
            ->map(function ($car) {
                $revenue = $car->bookings->sum('total_price');
                $totalExpenses = $car->expenses->sum('amount');
                
                return [
                    'id' => $car->id,
                    'brand' => $car->brand,
                    'model' => $car->model,
                    'image' => $car->image,
                    'total_revenue' => (float) $revenue,
                    'total_expenses' => (float) $totalExpenses,
                    'profit' => (float) ($revenue - $totalExpenses),
                    'revenue_details' => $car->bookings->map(fn($b) => [
                        'id' => $b->id,
                        'customer' => "{$b->first_name} {$b->last_name}",
                        'amount' => (float) $b->total_price,
                        'date' => $b->start_date,
                    ]),
                    'expense_details' => $car->expenses->map(fn($e) => [
                        'id' => $e->id,
                        'type' => $e->type,
                        'amount' => (float) $e->amount,
                        'date' => $e->date,
                    ]),
                ];
            })->sortByDesc('profit')->values();

        // Récupérer les réservations récentes (avec filtres)
        $recentBookingsQuery = Booking::with('car')
            ->orderBy('created_at', 'desc')
            ->limit(5);
        
        if ($carId) {
            $recentBookingsQuery->where('car_id', $carId);
        }
        if ($startDate) {
            $recentBookingsQuery->where('start_date', '>=', $startDate);
        }
        $recentBookingsQuery->where('start_date', '<=', $endDate);
        
        $recentBookings = $recentBookingsQuery->get();

        $now = Carbon::now();

        // Retours en attente (avec filtres)
        $pendingReturnsQuery = Booking::with(['car', 'customer'])
            ->whereNull('return_checked_at')
            ->where(function ($q) use ($now) {
                $q->where('status', 'COMPLETED')
                    ->orWhere(function ($q2) use ($now) {
                        $q2->where('status', '!=', 'CANCELLED')
                            ->where('end_date', '<', $now);
                    });
            })
            ->orderBy('end_date', 'desc')
            ->limit(6);
        
        if ($carId) {
            $pendingReturnsQuery->where('car_id', $carId);
        }
        
        $pendingReturns = $pendingReturnsQuery->get()
            ->map(fn ($b) => [
                'id' => (string) $b->id,
                'car_id' => (string) $b->car_id,
                'car' => [
                    'brand' => $b->car?->brand,
                    'model' => $b->car?->model,
                    'image' => $b->car?->image,
                ],
                'first_name' => $b->first_name ?? $b->customer?->first_name ?? 'Inconnu',
                'last_name' => $b->last_name ?? $b->customer?->last_name ?? '',
                'start_date' => $b->start_date?->toDateString(),
                'end_date' => $b->end_date?->toDateString(),
                'status' => $b->status,
            ]);

        return response()->json([
            'totalCars' => $totalCars,
            'activeBookings' => $activeBookings,
            'pendingBookings' => $pendingBookings,
            'completedBookings' => $completedBookings,
            'totalRevenue' => (float) $totalRevenue,
            'totalExpenses' => (float) $totalExpenses,
            'netGain' => (float) $netGain,
            'monthlyData' => $months,
            'expenseTypeStats' => $expenseTypeStats,
            'carsProfit' => $carsProfitQuery,
            'recentBookings' => $recentBookings,
            'pendingReturns' => $pendingReturns,
            'carAvailability' => [
                'available' => Car::where('available', true)->count(),
                'unavailable' => Car::where('available', false)->count(),
            ]
        ]);
    }

    public function carStats(Car $car)
    {
        // OPTIMIZED: Use eager loading to reduce queries
        $car->load(['bookings' => function($q) {
            $q->where('status', '!=', 'CANCELLED')
              ->orderBy('start_date', 'desc');
        }, 'expenses' => function($q) {
            $q->orderBy('date', 'desc');
        }]);
        
        $bookings = $car->bookings;
        $expenses = $car->expenses;
        
        $totalRevenue = $bookings->sum('total_price');
        $totalExpenses = $expenses->sum('amount');
        $netGain = $totalRevenue - $totalExpenses;
        $bookingCount = $bookings->count();
        
        $totalDaysRented = 0;
        foreach ($bookings as $booking) {
            $start = Carbon::parse($booking->start_date);
            $end = Carbon::parse($booking->end_date);
            $totalDaysRented += $start->diffInDays($end) ?: 1; // Au moins 1 jour
        }

        // Occupancy rate for the last 6 months
        $sixMonthsAgo = Carbon::now()->subMonths(6);
        $daysInPeriod = Carbon::now()->diffInDays($sixMonthsAgo);
        $rentedDaysInPeriod = 0;
        
        $periodBookings = Booking::where('car_id', $car->id)
            ->where('status', '!=', 'CANCELLED')
            ->where('end_date', '>=', $sixMonthsAgo->format('Y-m-d'))
            ->get();
            
        foreach ($periodBookings as $booking) {
            $start = Carbon::parse($booking->start_date);
            $end = Carbon::parse($booking->end_date);
            
            $clampedStart = $start->max($sixMonthsAgo);
            $clampedEnd = $end->min(Carbon::now());
            
            if ($clampedStart < $clampedEnd) {
                $rentedDaysInPeriod += $clampedStart->diffInDays($clampedEnd) ?: 1;
            }
        }
        
        $occupancyRate = ($daysInPeriod > 0) ? ($rentedDaysInPeriod / $daysInPeriod) * 100 : 0;

        // Monthly data for the car
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthName = $date->translatedFormat('M');
            $yearMonth = $date->format('Y-m');

            $rev = Booking::where('car_id', $car->id)
                ->where('status', '!=', 'CANCELLED')
                ->where('start_date', 'like', "$yearMonth%")
                ->sum('total_price');
            
            $exp = Expense::where('car_id', $car->id)
                ->where('date', 'like', "$yearMonth%")
                ->sum('amount');

            $monthlyData[] = [
                'name' => $monthName,
                'revenue' => (float) $rev,
                'expenses' => (float) $exp,
                'profit' => (float) ($rev - $exp)
            ];
        }

        // Expense breakdown
        $expenseTypeStats = Expense::where('car_id', $car->id)
            ->select('type', DB::raw('SUM(amount) as total_amount'))
            ->groupBy('type')
            ->get()
            ->map(fn ($row) => [
                'type' => $row->type,
                'amount' => (float) $row->total_amount,
            ]);

        return response()->json([
            'car' => [
                'id' => $car->id,
                'brand' => $car->brand,
                'model' => $car->model,
                'image' => $car->image,
            ],
            'totalRevenue' => (float) $totalRevenue,
            'totalExpenses' => (float) $totalExpenses,
            'netGain' => (float) $netGain,
            'bookingCount' => $bookingCount,
            'totalDaysRented' => $totalDaysRented,
            'occupancyRate' => round($occupancyRate, 1),
            'monthlyData' => $monthlyData,
            'expenseTypeStats' => $expenseTypeStats,
            'bookings' => $bookings,
            'expenses' => $expenses,
        ]);
    }
}
