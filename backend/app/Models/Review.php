<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'role',
        'rating',
        'content',
        'is_approved',
        'order',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_approved' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get approved reviews ordered by position
     */
    public static function getApprovedReviews()
    {
        return static::where('is_approved', true)
            ->orderBy('order', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Scope for approved reviews
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    /**
     * Scope for high ratings
     */
    public function scopeHighRating($query, $minRating = 4)
    {
        return $query->where('rating', '>=', $minRating);
    }
}
