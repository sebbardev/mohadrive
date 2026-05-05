<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reviews = [
            [
                'name' => 'Karim Benjelloun',
                'email' => 'karim.benjelloun@example.com',
                'role' => 'Client Fidèle',
                'rating' => 5,
                'content' => 'Service impeccable ! J\'ai loué une Range Rover pour un voyage d\'affaires et tout était parfait. La voiture était neuve et propre. Je recommande vivement.',
                'is_approved' => true,
                'order' => 3,
            ],
            [
                'name' => 'Sophie Martin',
                'email' => 'sophie.martin@example.com',
                'role' => 'Touriste',
                'rating' => 5,
                'content' => 'Une expérience formidable pour nos vacances au Maroc. L\'équipe nous a livré la voiture à l\'aéroport sans attente. Le Dacia Duster était parfait pour les routes de l\'Atlas.',
                'is_approved' => true,
                'order' => 2,
            ],
            [
                'name' => 'Youssef El Amrani',
                'email' => 'youssef.amrani@example.com',
                'role' => 'Entrepreneur',
                'rating' => 4,
                'content' => 'La meilleure agence de location à Casablanca. Transparence totale sur les prix et un service client très réactif sur WhatsApp. Bravo !',
                'is_approved' => true,
                'order' => 1,
            ],
        ];

        // Unapproved reviews for badge testing
        $pendingReviews = [
            [
                'name' => 'Mehdi Bousfiha',
                'email' => 'mehdi.b@example.com',
                'role' => 'Client',
                'rating' => 4,
                'content' => 'Très bonne expérience, voiture propre et bien entretenue. Je reviendrai.',
                'is_approved' => false,
                'order' => 10,
            ],
            [
                'name' => 'Laila Kettani',
                'email' => 'laila.k@example.com',
                'role' => 'Touriste',
                'rating' => 5,
                'content' => 'Service parfait du début à la fin. Livraison à l\'heure et voiture impeccable.',
                'is_approved' => false,
                'order' => 11,
            ],
            [
                'name' => 'Rachid Moussaoui',
                'email' => 'rachid.m@example.com',
                'role' => 'Professionnel',
                'rating' => 3,
                'content' => 'Correct mais quelques petits problèmes avec la climatisation.',
                'is_approved' => false,
                'order' => 12,
            ],
        ];

        foreach ($reviews as $review) {
            Review::create($review);
        }

        foreach ($pendingReviews as $review) {
            Review::create($review);
        }

        $this->command->info('✅ Reviews seeded successfully!');
    }
}
