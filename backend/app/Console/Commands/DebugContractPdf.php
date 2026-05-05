<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Contract;
use setasign\Fpdi\Fpdi;

class DebugContractPdf extends Command
{
    protected $signature = 'pdf:debug {contract_id}';
    protected $description = 'Generate a debug PDF with coordinate markers';

    public function handle()
    {
        $contractId = $this->argument('contract_id');
        $contract = Contract::with('car')->find($contractId);

        if (!$contract) {
            $this->error("Contract #{$contractId} not found!");
            return Command::FAILURE;
        }

        $this->info("🔍 Generating detailed debug PDF for Contract #{$contractId}...");

        $templatePath = storage_path('app/public/templates/contract_template.pdf');
        
        if (!file_exists($templatePath)) {
            $this->error("Template PDF not found at: {$templatePath}");
            return Command::FAILURE;
        }

        $fpdi = new Fpdi();
        $pageCount = $fpdi->setSourceFile($templatePath);
        
        // Import page 1
        $fpdi->AddPage();
        $tplId = $fpdi->importPage(1);
        $fpdi->useImportedPage($tplId);

        // ==========================================
        // 1. GRILLE PRINCIPALE (tous les 10mm)
        // ==========================================
        $fpdi->SetDrawColor(220, 220, 220);
        $fpdi->SetLineWidth(0.2);
        
        // Lignes horizontales
        for ($y = 10; $y <= 290; $y += 10) {
            $fpdi->Line(0, $y, 210, $y);
        }
        
        // Lignes verticales
        for ($x = 10; $x <= 200; $x += 10) {
            $fpdi->Line($x, 0, $x, 297);
        }

        // ==========================================
        // 2. SOUS-GRILLE (tous les 5mm)
        // ==========================================
        $fpdi->SetDrawColor(240, 240, 240);
        $fpdi->SetLineWidth(0.1);
        
        // Sous-lignes horizontales
        for ($y = 5; $y <= 295; $y += 10) {
            $fpdi->Line(0, $y, 210, $y);
        }
        
        // Sous-lignes verticales
        for ($x = 5; $x <= 205; $x += 10) {
            $fpdi->Line($x, 0, $x, 297);
        }

        // ==========================================
        // 3. LABELS AXES (tous les 20mm)
        // ==========================================
        
        // Axe Y (gauche)
        for ($y = 20; $y <= 280; $y += 20) {
            $fpdi->SetXY(1, $y - 2);
            $fpdi->SetFont('Helvetica', 'B', 7);
            $fpdi->SetTextColor(100, 100, 100);
            $fpdi->Cell(8, 4, "Y{$y}");
        }
        
        // Axe X (haut)
        for ($x = 20; $x <= 200; $x += 20) {
            $fpdi->SetXY($x - 5, 1);
            $fpdi->SetFont('Helvetica', 'B', 7);
            $fpdi->SetTextColor(100, 100, 100);
            $fpdi->Cell(10, 4, "X{$x}");
        }

        // ==========================================
        // 4. ZONES DE COULEUR (blocs principaux)
        // ==========================================
        
        // Zone Locataire (gauche haut) - Bleu clair
        $fpdi->SetFillColor(200, 230, 255);
        $fpdi->SetDrawColor(0, 100, 200);
        $fpdi->SetLineWidth(0.5);
        $fpdi->Rect(20, 70, 90, 135, 'DF');
        
        $fpdi->SetXY(22, 72);
        $fpdi->SetFont('Helvetica', 'B', 10);
        $fpdi->SetTextColor(0, 100, 200);
        $fpdi->Cell(80, 6, "📋 LOCATAIRE (X=20-110, Y=70-205)");

        // Zone 2ème Conducteur (gauche bas) - Bleu moyen
        $fpdi->SetFillColor(180, 220, 255);
        $fpdi->SetDrawColor(0, 80, 180);
        $fpdi->Rect(20, 205, 90, 80, 'DF');
        
        $fpdi->SetXY(22, 207);
        $fpdi->SetFont('Helvetica', 'B', 10);
        $fpdi->SetTextColor(0, 80, 180);
        $fpdi->Cell(80, 6, "👥 2ÈME CONDUCTEUR (Y=205-285)");

        // Zone Véhicule (droite haut) - Vert clair
        $fpdi->SetFillColor(200, 255, 200);
        $fpdi->SetDrawColor(0, 150, 0);
        $fpdi->Rect(115, 75, 85, 55, 'DF');
        
        $fpdi->SetXY(117, 77);
        $fpdi->SetFont('Helvetica', 'B', 10);
        $fpdi->SetTextColor(0, 150, 0);
        $fpdi->Cell(80, 6, "🚗 VÉHICULE (X=115-200, Y=75-130)");

        // Zone Détails Location (droite milieu) - Vert moyen
        $fpdi->SetFillColor(180, 245, 180);
        $fpdi->SetDrawColor(0, 130, 0);
        $fpdi->Rect(115, 130, 85, 60, 'DF');
        
        $fpdi->SetXY(117, 132);
        $fpdi->SetFont('Helvetica', 'B', 10);
        $fpdi->SetTextColor(0, 130, 0);
        $fpdi->Cell(80, 6, "📅 LOCATION (Y=130-190)");

        // Zone Finance (droite bas) - Orange clair
        $fpdi->SetFillColor(255, 230, 200);
        $fpdi->SetDrawColor(200, 120, 0);
        $fpdi->Rect(115, 210, 85, 40, 'DF');
        
        $fpdi->SetXY(117, 212);
        $fpdi->SetFont('Helvetica', 'B', 10);
        $fpdi->SetTextColor(200, 120, 0);
        $fpdi->Cell(80, 6, "💰 FINANCE (Y=210-250)");

        // Zone Options (bas) - Violet clair
        $fpdi->SetFillColor(230, 200, 255);
        $fpdi->SetDrawColor(150, 0, 200);
        $fpdi->Rect(20, 275, 180, 20, 'DF');
        
        $fpdi->SetXY(22, 277);
        $fpdi->SetFont('Helvetica', 'B', 10);
        $fpdi->SetTextColor(150, 0, 200);
        $fpdi->Cell(170, 6, "☑ OPTIONS (Y=275-295)");

        // ==========================================
        // 5. POINTS DE TEST PRÉCIS (grille 5mm)
        // ==========================================
        
        $testPoints = [];
        
        // Grille de points tous les 5mm dans les zones importantes
        for ($y = 70; $y <= 295; $y += 5) {
            for ($x = 20; $x <= 200; $x += 5) {
                // Points aux intersections
                $fpdi->SetDrawColor(150, 150, 150);
                $fpdi->SetLineWidth(0.1);
                
                // Petit cercle (utilisant Rect)
                $size = 0.5;
                $fpdi->Rect($x - $size, $y - $size, $size * 2, $size * 2, 'D');
            }
        }

        // ==========================================
        // 6. MARQUEURS SPÉCIAUX (croix rouges)
        // ==========================================
        
        $specialMarkers = [
            ['x' => 30, 'y' => 85, 'label' => 'Nom Locataire'],
            ['x' => 30, 'y' => 95, 'label' => 'Prénom'],
            ['x' => 30, 'y' => 105, 'label' => 'CIN'],
            ['x' => 30, 'y' => 125, 'label' => 'Adresse'],
            ['x' => 30, 'y' => 135, 'label' => 'Permis N°'],
            ['x' => 30, 'y' => 195, 'label' => 'Téléphone'],
            
            ['x' => 125, 'y' => 90, 'label' => 'Marque Véhicule'],
            ['x' => 125, 'y' => 100, 'label' => 'Immatriculation'],
            ['x' => 125, 'y' => 140, 'label' => 'Date Départ'],
            ['x' => 125, 'y' => 150, 'label' => 'Date Retour'],
            ['x' => 125, 'y' => 220, 'label' => 'Prix Total'],
            
            ['x' => 35, 'y' => 285, 'label' => 'Option 1'],
            ['x' => 35, 'y' => 292, 'label' => 'Option 2'],
        ];

        foreach ($specialMarkers as $marker) {
            // Croix rouge
            $fpdi->SetDrawColor(255, 0, 0);
            $fpdi->SetLineWidth(0.8);
            
            // Croix (8mm)
            $fpdi->Line($marker['x'] - 4, $marker['y'], $marker['x'] + 4, $marker['y']);
            $fpdi->Line($marker['x'], $marker['y'] - 4, $marker['x'], $marker['y'] + 4);
            
            // Carré (6mm)
            $fpdi->SetDrawColor(255, 0, 0);
            $fpdi->SetLineWidth(0.5);
            $fpdi->Rect($marker['x'] - 3, $marker['y'] - 3, 6, 6, 'D');
            
            // Label
            $fpdi->SetXY($marker['x'] + 5, $marker['y'] - 2);
            $fpdi->SetFont('Helvetica', 'B', 7);
            $fpdi->SetTextColor(255, 0, 0);
            $fpdi->Cell(40, 4, "{$marker['label']} ({$marker['x']}, {$marker['y']})");
            
            // Coordinates in smaller font below
            $fpdi->SetXY($marker['x'] + 5, $marker['y'] + 2);
            $fpdi->SetFont('Helvetica', '', 6);
            $fpdi->SetTextColor(150, 0, 0);
            $fpdi->Cell(40, 3, "X={$marker['x']}mm Y={$marker['y']}mm");
        }

        // ==========================================
        // 7. DONNÉES RÉELLES DU CONTRAT
        // ==========================================
        
        $fpdi->SetTextColor(0, 0, 255);
        $fpdi->SetFont('Helvetica', '', 9);

        // Locataire
        $fpdi->SetXY(30, 85);
        $fpdi->Cell(50, 6, "[NOM] " . ($contract->driver_last_name ?? ''));

        $fpdi->SetXY(30, 95);
        $fpdi->Cell(50, 6, "[PRÉNOM] " . ($contract->driver_first_name ?? ''));

        $fpdi->SetXY(30, 105);
        $fpdi->Cell(50, 6, "[CIN] " . ($contract->driver_cin_number ?? ''));

        $fpdi->SetXY(30, 135);
        $fpdi->Cell(50, 6, "[PERMIS] " . ($contract->driver_license_number ?? ''));

        $fpdi->SetXY(30, 195);
        $fpdi->Cell(50, 6, "[TEL] " . ($contract->driver_phone ?? ''));

        // Véhicule
        $fpdi->SetXY(125, 90);
        $fpdi->Cell(60, 6, "[MARQUE] " . $contract->car->brand . ' ' . $contract->car->model);

        $fpdi->SetXY(125, 100);
        $fpdi->Cell(60, 6, "[PLAQUE] " . ($contract->car->plate_number ?? ''));

        // Dates
        $fpdi->SetXY(125, 140);
        $fpdi->Cell(60, 6, "[DÉBUT] " . $contract->start_date->format('d/m/Y H:i'));

        $fpdi->SetXY(125, 150);
        $fpdi->Cell(60, 6, "[FIN] " . $contract->end_date->format('d/m/Y H:i'));

        // Finance
        $fpdi->SetXY(125, 220);
        $fpdi->SetFont('Helvetica', 'B', 11);
        $fpdi->Cell(60, 8, "[PRIX TOTAL] " . number_format($contract->total_price, 2) . ' MAD');

        // Légende
        $fpdi->SetXY(10, 290);
        $fpdi->SetFont('Helvetica', 'I', 7);
        $fpdi->SetTextColor(100, 100, 100);
        $fpdi->Cell(190, 4, "Grille: 10mm (noir) | 5mm (gris) | Zones colorées = sections du PDF | Croix rouges = positions actuelles | Texte bleu = données");

        // Save debug PDF
        $outputPath = storage_path('app/public/templates/debug_contract_' . $contractId . '_detailed.pdf');
        $fpdi->Output($outputPath, 'F');

        $this->info('');
        $this->info("✅ Detailed debug PDF generated!");
        $this->info("📂 Location: {$outputPath}");
        $this->info('');
        $this->info("📖 Legend:");
        $this->info("   📋 Bleu clair = Zone LOCATAIRE");
        $this->info("   👥 Bleu moyen = Zone 2ÈME CONDUCTEUR");
        $this->info("   🚗 Vert clair = Zone VÉHICULE");
        $this->info("   📅 Vert moyen = Zone LOCATION");
        $this->info("   💰 Orange = Zone FINANCE");
        $this->info("   ☑ Violet = Zone OPTIONS");
        $this->info('');
        $this->info("🔴 Red crosses = Current field positions");
        $this->info("🔵 Blue text = Actual data at those positions");
        $this->info("⊕ Small dots = 5mm grid points");
        $this->info('');
        $this->info("🎯 How to use:");
        $this->info("   1. Open the PDF and zoom in");
        $this->info("   2. Find where each field SHOULD appear in your template");
        $this->info("   3. Note the X,Y coordinates from the grid");
        $this->info("   4. Tell me the correct coordinates for each field");

        return Command::SUCCESS;
    }
}
