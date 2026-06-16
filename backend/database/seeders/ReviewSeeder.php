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
                'content' => 'Service impeccable ! J\'ai loué une Dacia Logan pour un voyage d\'affaires et tout était parfait. La voiture était propre et en excellent état. Je recommande vivement MohaDrive à tous mes collègues.',
                'is_approved' => true,
                'order' => 10,
            ],
            [
                'name' => 'Sophie Martin',
                'email' => 'sophie.martin@example.com',
                'role' => 'Touriste Française',
                'rating' => 5,
                'content' => 'Une expérience formidable pour nos vacances dans l\'Oriental. L\'équipe nous a livré la voiture directement à l\'aéroport d\'Oujda sans aucune attente. Le véhicule était parfait pour découvrir la région. Merci !',
                'is_approved' => true,
                'order' => 9,
            ],
            [
                'name' => 'Youssef El Amrani',
                'email' => 'youssef.amrani@example.com',
                'role' => 'Entrepreneur',
                'rating' => 5,
                'content' => 'La meilleure agence de location dans la région. Transparence totale sur les prix, aucun frais caché et un service client très réactif sur WhatsApp. Je reviendrai sans hésiter !',
                'is_approved' => true,
                'order' => 8,
            ],
            [
                'name' => 'Nadia Chraibi',
                'email' => 'nadia.c@example.com',
                'role' => 'Voyageuse',
                'rating' => 5,
                'content' => 'J\'ai réservé une Dacia Sandero pour un week-end en famille et c\'était parfait. La voiture était propre, bien entretenue et la prise en charge à El Aïoun s\'est déroulée sans problème. Bravo pour le professionnalisme !',
                'is_approved' => true,
                'order' => 7,
            ],
            [
                'name' => 'Mohamed Ouali',
                'email' => 'mohamed.ouali@example.com',
                'role' => 'Client Régulier',
                'rating' => 5,
                'content' => 'Je loue régulièrement chez MohaDrive pour mes déplacements professionnels. La qualité du service est constante, les véhicules sont récents et les tarifs sont honnêtes. Une équipe sérieuse et disponible.',
                'is_approved' => true,
                'order' => 6,
            ],
            [
                'name' => 'Isabelle Dupont',
                'email' => 'isabelle.d@example.com',
                'role' => 'Touriste Belge',
                'rating' => 4,
                'content' => 'Très bonne expérience globale. La voiture était propre et confortable pour explorer la région de l\'Oriental. Le service de livraison à l\'aéroport est vraiment pratique. Je recommande.',
                'is_approved' => true,
                'order' => 5,
            ],
            [
                'name' => 'Hamza Tazi',
                'email' => 'hamza.tazi@example.com',
                'role' => 'Étudiant',
                'rating' => 5,
                'content' => 'Super service et prix très compétitifs ! J\'avais besoin d\'un véhicule pour rentrer chez mes parents et MohaDrive m\'a proposé exactement ce qu\'il me fallait. Communication rapide et efficace.',
                'is_approved' => true,
                'order' => 4,
            ],
            [
                'name' => 'Fatima Zahra Benali',
                'email' => 'fatima.benali@example.com',
                'role' => 'Médecin',
                'rating' => 5,
                'content' => 'J\'ai loué une voiture pour un déplacement urgent et MohaDrive a su s\'adapter à mes contraintes horaires. Professionnalisme exemplaire, voiture en parfait état. Je recommande chaudement.',
                'is_approved' => true,
                'order' => 3,
            ],
            [
                'name' => 'Omar Idrissi',
                'email' => 'omar.idrissi@example.com',
                'role' => 'Commercial',
                'rating' => 4,
                'content' => 'Très satisfait de ma location. Le processus de réservation est simple, les délais sont respectés et la voiture était en bon état. Un seul bémol : les horaires d\'ouverture pourraient être élargis.',
                'is_approved' => true,
                'order' => 2,
            ],
            [
                'name' => 'Amina Touhami',
                'email' => 'amina.t@example.com',
                'role' => 'Enseignante',
                'rating' => 5,
                'content' => 'Première fois que je loue une voiture et l\'équipe de MohaDrive m\'a mis à l\'aise dès le premier contact. Explication claire du contrat, véhicule impeccable et retour sans problème. Je reviendrai.',
                'is_approved' => true,
                'order' => 1,
            ],
        ];

        // Unapproved reviews pending moderation
        $pendingReviews = [
            [
                'name' => 'Mehdi Bousfiha',
                'email' => 'mehdi.b@example.com',
                'role' => 'Client',
                'rating' => 4,
                'content' => 'Très bonne expérience, voiture propre et bien entretenue. Le personnel est sympathique et professionnel. Je reviendrai certainement.',
                'is_approved' => false,
                'order' => 20,
            ],
            [
                'name' => 'Laila Kettani',
                'email' => 'laila.k@example.com',
                'role' => 'Touriste',
                'rating' => 5,
                'content' => 'Service parfait du début à la fin. Livraison à l\'heure, voiture impeccable et retour sans aucune complication. MohaDrive c\'est la référence dans la région !',
                'is_approved' => false,
                'order' => 21,
            ],
            [
                'name' => 'Rachid Moussaoui',
                'email' => 'rachid.m@example.com',
                'role' => 'Professionnel',
                'rating' => 4,
                'content' => 'Bonne expérience dans l\'ensemble. La voiture était propre et le service rapide. Je recommande MohaDrive pour vos déplacements dans la région.',
                'is_approved' => false,
                'order' => 22,
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
