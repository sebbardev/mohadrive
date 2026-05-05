<?php

namespace App\Http\Controllers\Api;

use App\Models\HeroImage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class HeroImageController
{
    /**
     * Get all hero images (public)
     */
    public function index(): JsonResponse
    {
        $images = HeroImage::getActiveImages();
        
        return response()->json([
            'data' => $images->map(function ($image) {
                return [
                    'id' => $image->id,
                    'image_path' => asset('storage/' . $image->image_path),
                    'title' => $image->title,
                    'subtitle' => $image->subtitle,
                    'order' => $image->order,
                ];
            }),
        ]);
    }

    /**
     * Get all hero images for admin
     */
    public function adminIndex(): JsonResponse
    {
        $images = HeroImage::orderBy('order')->get();
        
        return response()->json([
            'data' => $images,
        ]);
    }

    /**
     * Upload new hero image
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'order' => 'nullable|integer|min:0',
        ]);

        // Upload image
        $path = $request->file('image')->store('hero-images', 'public');

        $heroImage = HeroImage::create([
            'image_path' => $path,
            'title' => $request->title,
            'subtitle' => $request->subtitle,
            'order' => $request->order ?? HeroImage::count(),
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Image hero ajoutée avec succès',
            'data' => $heroImage,
        ], 201);
    }

    /**
     * Update hero image
     */
    public function update(Request $request, HeroImage $heroImage): JsonResponse
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $heroImage->update($request->only(['title', 'subtitle', 'order', 'is_active']));

        return response()->json([
            'message' => 'Image mise à jour avec succès',
            'data' => $heroImage,
        ]);
    }

    /**
     * Delete hero image
     */
    public function destroy(HeroImage $heroImage): JsonResponse
    {
        // Delete image file
        if ($heroImage->image_path) {
            Storage::disk('public')->delete($heroImage->image_path);
        }

        $heroImage->delete();

        return response()->json([
            'message' => 'Image supprimée avec succès',
        ]);
    }

    /**
     * Reorder hero images
     */
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'images' => 'required|array',
            'images.*.id' => 'required|exists:hero_images,id',
            'images.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->images as $imageData) {
            HeroImage::where('id', $imageData['id'])
                ->update(['order' => $imageData['order']]);
        }

        return response()->json([
            'message' => 'Ordre mis à jour avec succès',
        ]);
    }
}
