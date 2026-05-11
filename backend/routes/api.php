<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\UnavailabilityController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\HeroImageController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\ContractController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// OPTIONS routes for CORS preflight
Route::options('/login', function () { return response()->json([], 200); });
Route::options('/register', function () { return response()->json([], 200); });
Route::options('/forgot-password', function () { return response()->json([], 200); });
Route::options('/reset-password', function () { return response()->json([], 200); });
Route::options('/cars', function () { return response()->json([], 200); });
Route::options('/cars/featured', function () { return response()->json([], 200); });
Route::options('/cars/{car}', function () { return response()->json([], 200); });
Route::options('/stats', function () { return response()->json([], 200); });
Route::options('/stats/cars/{car}', function () { return response()->json([], 200); });
Route::options('/unavailabilities', function () { return response()->json([], 200); });
Route::options('/hero-images', function () { return response()->json([], 200); });
Route::options('/reviews', function () { return response()->json([], 200); });
Route::options('/bookings', function () { return response()->json([], 200); });
Route::options('/bookings/{booking}', function () { return response()->json([], 200); });
Route::options('/expenses', function () { return response()->json([], 200); });
Route::options('/expenses/dashboard', function () { return response()->json([], 200); });
Route::options('/contracts', function () { return response()->json([], 200); });
Route::options('/contracts/{contract}', function () { return response()->json([], 200); });
Route::options('/customers', function () { return response()->json([], 200); });
Route::options('/contact', function () { return response()->json([], 200); });

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/cars', [CarController::class, 'index']);
Route::get('/cars/featured', [CarController::class, 'featured']);
Route::get('/cars/{car}', [CarController::class, 'show']);
Route::get('/stats', [StatsController::class, 'index']);
Route::get('/stats/cars/{car}', [StatsController::class, 'carStats']);
Route::get('/unavailabilities', [UnavailabilityController::class, 'index']);
Route::get('/hero-images', [HeroImageController::class, 'index']);

// Reviews (Public)
Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'store']);

// Bookings
Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings', [BookingController::class, 'index']);
Route::get('/bookings/{booking}', [BookingController::class, 'show']);
Route::put('/bookings/{booking}', [BookingController::class, 'update']);
Route::patch('/bookings/{booking}', [BookingController::class, 'update']);
Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);

// Expenses dashboard (admin)
Route::get('/expenses/dashboard', [ExpenseController::class, 'dashboard']);
Route::apiResource('expenses', ExpenseController::class);

// Contracts
Route::apiResource('contracts', ContractController::class);
Route::get('contracts/{contract}/download', [ContractController::class, 'downloadPdf']);
Route::post('contracts/{contract}/close', [ContractController::class, 'close']);

// Customers
Route::apiResource('customers', CustomerController::class);

// Contact Messages (Public)
Route::post('/contact', [ContactMessageController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    // User profile
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/bookings/{booking}/return-intake', [BookingController::class, 'returnIntake']);

    Route::post('/cars', [CarController::class, 'store']);
    Route::put('/cars/{car}', [CarController::class, 'update']);
    Route::delete('/cars/{car}', [CarController::class, 'destroy']);
    Route::post('/cars/{car}/toggle-featured', [CarController::class, 'toggleFeatured']);

    Route::post('/unavailabilities', [UnavailabilityController::class, 'store']);
    Route::delete('/unavailabilities/{unavailability}', [UnavailabilityController::class, 'destroy']);

    // Contact Messages (Admin only)
    Route::get('/contact-messages', [ContactMessageController::class, 'index']);
    Route::get('/contact-messages/stats/unread-count', [ContactMessageController::class, 'unreadCount']);
    Route::get('/contact-messages/{contactMessage}', [ContactMessageController::class, 'show']);
    Route::put('/contact-messages/{contactMessage}', [ContactMessageController::class, 'update']);
    Route::delete('/contact-messages/{contactMessage}', [ContactMessageController::class, 'destroy']);
    Route::post('/contact-messages/bulk-update', [ContactMessageController::class, 'bulkUpdate']);

    // Notifications (Admin only)
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::get('/notifications/{notification}', [NotificationController::class, 'show']);
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);
    Route::delete('/notifications/delete-all-read', [NotificationController::class, 'deleteAllRead']);

    // Hero Images (Admin only)
    Route::get('/admin/hero-images', [HeroImageController::class, 'adminIndex']);
    Route::post('/admin/hero-images', [HeroImageController::class, 'store']);
    Route::put('/admin/hero-images/{heroImage}', [HeroImageController::class, 'update']);
    Route::delete('/admin/hero-images/{heroImage}', [HeroImageController::class, 'destroy']);
    Route::post('/admin/hero-images/reorder', [HeroImageController::class, 'reorder']);

    // Reviews (Admin only)
    Route::get('/admin/reviews', [ReviewController::class, 'adminIndex']);
    Route::put('/admin/reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('/admin/reviews/{review}', [ReviewController::class, 'destroy']);
});
