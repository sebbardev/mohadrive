<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewContactMessageMail;
use App\Models\ContactMessage;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Services\UnifiedEmailService;
use Illuminate\Validation\Rule;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of the resource (Admin only).
     */
    public function index(Request $request)
    {
        $this->authorizeAdmin();

        $query = ContactMessage::with('customer');

        // Search filter
        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        // Read status filter
        if ($request->filled('is_read')) {
            $isRead = filter_var($request->input('is_read'), FILTER_VALIDATE_BOOLEAN);
            $query->where('is_read', $isRead);
        }

        // Support sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        
        // Validate sort columns to prevent SQL injection
        $allowedSortColumns = ['created_at', 'name', 'email', 'subject', 'is_read'];
        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'created_at';
        }
        
        // Validate sort order
        $sortOrder = in_array(strtolower($sortOrder), ['asc', 'desc']) ? $sortOrder : 'desc';
        
        // Support pagination with per_page parameter
        $perPage = $request->input('per_page', 15);

        return response()->json(
            $query->orderBy($sortBy, $sortOrder)->paginate($perPage)
        );
    }

    /**
     * Store a newly created resource in storage (Public).
     */
    public function store(Request $request)
    {
        // Rate limiting: 60 requests per hour per IP
        $rateLimitKey = 'contact_message:' . $request->ip();
        if (cache()->get($rateLimitKey, 0) >= 60) {
            return response()->json([
                'message' => 'Trop de tentatives. Veuillez réessayer plus tard.',
            ], 429);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10',
            'customer_id' => 'nullable|exists:customers,id',
        ]);

        // If customer_id is provided, verify it matches the email
        if (!empty($validated['customer_id'])) {
            $customer = \App\Models\Customer::find($validated['customer_id']);
            if ($customer && $customer->email !== $validated['email']) {
                return response()->json([
                    'message' => 'L\'email ne correspond pas au client spécifié.',
                ], 422);
            }
        }

        $contactMessage = ContactMessage::create([
            'customer_id' => $validated['customer_id'] ?? null,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Increment rate limit counter
        cache()->increment($rateLimitKey);
        cache()->put($rateLimitKey, cache()->get($rateLimitKey), 3600); // 1 hour

        // Send styled email notification to admin
        try {
            UnifiedEmailService::sendNewContactMessage($contactMessage);
        } catch (\Exception $e) {
            // Log error but don't fail the request
            \Log::error('Failed to send styled contact email: ' . $e->getMessage());
        }

        // Create in-app notification for all admins
        try {
            Notification::createForAdmins(
                'CONTACT_MESSAGE',
                'Nouveau Message de Contact',
                "{$contactMessage->name} a envoyé un message: {$contactMessage->subject}",
                [
                    'message_id' => $contactMessage->id,
                    'sender_name' => $contactMessage->name,
                    'sender_email' => $contactMessage->email,
                    'subject' => $contactMessage->subject,
                ]
            );
        } catch (\Exception $e) {
            \Log::error('Failed to create contact message notification: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
            'data' => $contactMessage,
        ], 201);
    }

    /**
     * Display the specified resource (Admin only).
     */
    public function show(ContactMessage $contactMessage)
    {
        $this->authorizeAdmin();

        // Mark as read when viewed
        if (!$contactMessage->is_read) {
            $contactMessage->markAsRead();
        }

        return response()->json($contactMessage->load('customer'));
    }

    /**
     * Update the specified resource in storage (Admin only).
     */
    public function update(Request $request, ContactMessage $contactMessage)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'is_read' => 'nullable|boolean',
            'admin_notes' => 'nullable|string',
        ]);

        $updateData = [];

        if (array_key_exists('is_read', $validated)) {
            $updateData['is_read'] = $validated['is_read'];
        }

        if (array_key_exists('admin_notes', $validated)) {
            $updateData['admin_notes'] = $validated['admin_notes'];
            $updateData['replied_at'] = now();
        }

        $contactMessage->update($updateData);

        return response()->json($contactMessage);
    }

    /**
     * Remove the specified resource from storage (Admin only).
     */
    public function destroy(ContactMessage $contactMessage)
    {
        $this->authorizeAdmin();

        $contactMessage->delete();

        return response()->json(['message' => 'Message supprimé avec succès.']);
    }

    /**
     * Bulk update messages (Admin only).
     */
    public function bulkUpdate(Request $request)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contact_messages,id',
            'action' => 'required|in:mark_read,mark_unread,delete',
        ]);

        $ids = $validated['ids'];
        $action = $validated['action'];

        switch ($action) {
            case 'mark_read':
                ContactMessage::whereIn('id', $ids)->update(['is_read' => true]);
                return response()->json(['message' => 'Messages marqués comme lus.']);

            case 'mark_unread':
                ContactMessage::whereIn('id', $ids)->update(['is_read' => false]);
                return response()->json(['message' => 'Messages marqués comme non lus.']);

            case 'delete':
                ContactMessage::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Messages supprimés avec succès.']);

            default:
                return response()->json(['message' => 'Action invalide.'], 422);
        }
    }

    /**
     * Get unread messages count (Admin only).
     */
    public function unreadCount()
    {
        $this->authorizeAdmin();

        $count = ContactMessage::unread()->count();

        return response()->json(['unread_count' => $count]);
    }

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
}
