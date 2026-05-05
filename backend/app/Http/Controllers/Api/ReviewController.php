<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Review;
use App\Traits\Auditable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    use Auditable;

    /**
     * Authorize admin access.
     */
    private function authorizeAdmin(): void
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user || !$user->isAdmin()) {
            abort(403, 'Action non autorisée.');
        }
    }

    /**
     * Get all approved reviews (public)
     */
    public function index()
    {
        $reviews = Review::getApprovedReviews();
        
        return response()->json([
            'data' => $reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'name' => $review->name,
                    'role' => $review->role,
                    'rating' => $review->rating,
                    'content' => $review->content,
                    'created_at' => $review->created_at->format('Y-m-d'),
                ];
            }),
            'average_rating' => round($reviews->avg('rating'), 1),
            'total_reviews' => $reviews->count(),
        ]);
    }

    /**
     * Submit a new review (public)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'role' => 'nullable|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string|max:1000',
        ]);

        $review = Review::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'] ?? 'Client',
            'rating' => $validated['rating'],
            'content' => $validated['content'],
            'is_approved' => false, // Requires admin approval
            'order' => Review::count(),
        ]);

        // Send notification to admins about new review
        Notification::createForAdmins(
            'REVIEW',
            'Nouveau Avis Client',
            "{$review->name} a soumis un nouvel avis avec une note de {$review->rating}/5",
            [
                'review_id' => $review->id,
                'customer_name' => $review->name,
                'rating' => $review->rating,
            ]
        );

        return response()->json([
            'message' => 'Merci pour votre avis ! Il sera publié après validation.',
            'data' => $review,
        ], 201);
    }

    /**
     * Get all reviews for admin with pagination, sorting, search and filtering
     */
    public function adminIndex(Request $request)
    {
        $this->authorizeAdmin();
        
        $query = Review::query();

        // Apply search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Apply approval status filter
        if ($request->has('is_approved')) {
            $isApproved = filter_var($request->is_approved, FILTER_VALIDATE_BOOLEAN);
            $query->where('is_approved', $isApproved);
        }

        // Apply sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        
        // Validate sort fields
        $allowedSortFields = ['id', 'name', 'email', 'rating', 'content', 'is_approved', 'created_at', 'updated_at'];
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'created_at';
        }
        
        $query->orderBy($sortBy, $sortOrder);

        // Apply pagination
        $perPage = $request->input('per_page', 15);
        $reviews = $query->paginate($perPage);

        return response()->json([
            'data' => $reviews->items(),
            'current_page' => $reviews->currentPage(),
            'last_page' => $reviews->lastPage(),
            'total' => $reviews->total(),
            'from' => $reviews->firstItem(),
            'to' => $reviews->lastItem(),
        ]);
    }

    /**
     * Approve or reject a review
     */
    public function update(Request $request, Review $review)
    {
        $this->authorizeAdmin();
        
        $validated = $request->validate([
            'is_approved' => 'required|boolean',
            'order' => 'nullable|integer',
        ]);

        $review->update($validated);

        return response()->json([
            'message' => $review->is_approved ? 'Avis approuvé' : 'Avis masqué',
            'data' => $review,
        ]);
    }

    /**
     * Delete a review
     */
    public function destroy(Review $review)
    {
        $this->authorizeAdmin();
        
        $review->delete();

        return response()->json([
            'message' => 'Avis supprimé avec succès',
        ]);
    }
}
