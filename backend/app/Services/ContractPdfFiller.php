<?php

namespace App\Services;

use setasign\Fpdi\Fpdi;
use App\Models\Contract;
use Carbon\Carbon;

class ContractPdfFiller
{
    protected $fpdi;
    protected $templatePath;
    
    public function __construct()
    {
        $this->fpdi = new Fpdi();
        $this->templatePath = storage_path('app/public/templates/contract_template.pdf');
    }

    /**
     * Fill the PDF template with contract data
     */
    public function fill(Contract $contract): string
    {
        // Load the template PDF
        $pageCount = $this->fpdi->setSourceFile($this->templatePath);
        
        // Page 1: Fill contract details
        // Get the size of the imported page to maintain exact dimensions
        $page1 = $this->fpdi->importPage(1);
        $pageSize = $this->fpdi->getTemplateSize($page1);
        
        // Add page with exact template size (prevents content from going to page 2)
        $this->fpdi->AddPage('P', $pageSize);
        $this->fpdi->useImportedPage($page1);
        
        // Disable auto page break to prevent content from going to page 2
        $this->fpdi->SetAutoPageBreak(false, 0);
        
        // Set font
        $this->fpdi->SetFont('Helvetica', '', 10);
        $this->fpdi->SetTextColor(0, 0, 0);
        
        // Fill Page 1 with data
        $this->fillPage1($contract);
        
        // Page 2: Fill terms (if exists in template)
        if ($pageCount > 1) {
            $this->fpdi->AddPage();
            $tplId2 = $this->fpdi->importPage(2);
            $this->fpdi->useImportedPage($tplId2);
            $this->fillPage2($contract);
        }
        
        // Generate filename with driver name, car, and date
        $timestamp = time();
        $driverName = strtoupper(str_replace(' ', '_', $contract->driver_first_name . '_' . $contract->driver_last_name));
        $carName = strtoupper(str_replace(' ', '_', $contract->car->brand . '_' . $contract->car->model));
        $startDate = $contract->start_date->format('Y-m-d');
        $filename = "contracts/contract_{$driverName}_{$carName}_{$startDate}_v{$contract->version}_{$timestamp}.pdf";
        $fullPath = storage_path('app/public/' . $filename);
        
        // Save PDF
        $this->fpdi->Output($fullPath, 'F');
        
        return $filename;
    }

    /**
     * Fill Page 1 with contract details
     * Coordonnées précises basées sur la structure du PDF
     */
    protected function fillPage1(Contract $contract)
    {
        // ============================================
        // 1. LOCATAIRE (colonne gauche)
        // ============================================
        
        // Nom
        $this->fpdi->SetXY(20, 78.1);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(50, 6, $contract->driver_last_name ?? '');

        // Prénom
        $this->fpdi->SetXY(25, 84.5);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(50, 6, $contract->driver_first_name ?? '');

        // Né le (date de naissance)
        $this->fpdi->SetXY(27, 90.9);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(50, 6, $contract->driver_birth_date ? \Carbon\Carbon::parse($contract->driver_birth_date)->format('d/m/Y') : '');

        // Nationalité
        $this->fpdi->SetXY(30, 97.2);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(50, 6, $contract->driver_nationality ?? 'Marocaine');

        // Adresse
        $this->fpdi->SetXY(27, 103.6);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(80, 6, $contract->driver_address ?? '');

        // Permis
        $this->fpdi->SetXY(48, 109.9);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(50, 6, $contract->driver_license_number ?? '');

        // Délivré le (permis)
        $this->fpdi->SetXY(28, 116.2);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(50, 6, $contract->driver_license_date ? \Carbon\Carbon::parse($contract->driver_license_date)->format('d/m/Y') : '');

        // CIN
        $this->fpdi->SetXY(25, 122.6);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(50, 6, $contract->driver_cin_number ?? '');

        // Délivré le (CIN)
        $this->fpdi->SetXY(30, 129);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(50, 6, $contract->cin_issue_date ? \Carbon\Carbon::parse($contract->cin_issue_date)->format('d/m/Y') : '');

        // Passeport
        $this->fpdi->SetXY(35, 135.4);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(50, 6, $contract->passport_number ?? '');

        // Délivré le (passeport)
        $this->fpdi->SetXY(28, 141.7);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(50, 6, $contract->passport_issue_date ? \Carbon\Carbon::parse($contract->passport_issue_date)->format('d/m/Y') : '');

        // Téléphone
        $this->fpdi->SetXY(30, 148.1);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(50, 6, $contract->driver_phone ?? '');

        // ============================================
        // 2. 2ème CONDUCTEUR (bas gauche) - X ≈ 30
        // ============================================
        
        if ($contract->second_driver_first_name || $contract->second_driver_last_name) {
            
            // Nom
            $this->fpdi->SetXY(20, 171.2);
            $this->fpdi->SetFont('Helvetica', 'I', 11);
            $this->fpdi->Cell(50, 6, $contract->second_driver_last_name ?? '');

            // Prénom
            $this->fpdi->SetXY(25, 177.5);
            $this->fpdi->SetFont('Helvetica', 'I', 11);
            $this->fpdi->Cell(50, 6, $contract->second_driver_first_name ?? '');

            // Né le (date de naissance)
            $this->fpdi->SetXY(27, 183.8);
            $this->fpdi->SetFont('Helvetica', 'I', 11);
            $this->fpdi->Cell(50, 6, $contract->second_driver_birth_date ? \Carbon\Carbon::parse($contract->second_driver_birth_date)->format('d/m/Y') : '');

            // Nationalité
            $this->fpdi->SetXY(30, 190.2);
            $this->fpdi->SetFont('Helvetica', 'I', 11);
            $this->fpdi->Cell(50, 6, $contract->second_driver_nationality ?? 'Marocaine');

            // Adresse
            $this->fpdi->SetXY(27, 196.4);
            $this->fpdi->SetFont('Helvetica', 'I', 11);
            $this->fpdi->Cell(80, 6, $contract->second_driver_address ?? '');

            // Permis
            $this->fpdi->SetXY(48, 202.9);
            $this->fpdi->SetFont('Helvetica', 'I', 11);
            $this->fpdi->Cell(50, 6, $contract->second_driver_license_number ?? '');

            // Délivré le (permis)
            $this->fpdi->SetXY(28, 209.2);
            $this->fpdi->SetFont('Helvetica', 'I', 11);
            $this->fpdi->Cell(50, 6, $contract->second_driver_license_date ? \Carbon\Carbon::parse($contract->second_driver_license_date)->format('d/m/Y') : '');

            // CIN
            $this->fpdi->SetXY(25, 215.5);
            $this->fpdi->SetFont('Helvetica', 'I', 11);
            $this->fpdi->Cell(50, 6, $contract->second_driver_cin_number ?? '');

            // Délivré le (CIN)
            $this->fpdi->SetXY(30, 221.9);
            $this->fpdi->SetFont('Helvetica', 'I', 11);
            $this->fpdi->Cell(50, 6, $contract->second_driver_cin_issue_date ? \Carbon\Carbon::parse($contract->second_driver_cin_issue_date)->format('d/m/Y') : '');

            // Passeport
            $this->fpdi->SetXY(35, 228.3);
            $this->fpdi->SetFont('Helvetica', 'I', 11);
            $this->fpdi->Cell(50, 6, $contract->second_driver_passport_number ?? '');

            // Délivré le (passeport)
            $this->fpdi->SetXY(28, 234.7);
            $this->fpdi->SetFont('Helvetica', 'I', 11);
            $this->fpdi->Cell(50, 6, $contract->second_driver_passport_issue_date ? \Carbon\Carbon::parse($contract->second_driver_passport_issue_date)->format('d/m/Y') : '');

            // Téléphone
            $this->fpdi->SetXY(30, 241.2);
            $this->fpdi->SetFont('Helvetica', 'I', 11);
            $this->fpdi->Cell(50, 6, $contract->second_driver_phone ?? '');
        }

        // ============================================
        // 3. VÉHICULE (colonne droite) - X ≈ 125
        // ============================================
        
        // Marque
        $this->fpdi->SetXY(135, 77);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(60, 6, $contract->car->brand . ' ' . $contract->car->model);

        // Immatriculation (BOLD ONLY - no italic)
        $this->fpdi->SetXY(154, 82.4);
        $this->fpdi->SetFont('Helvetica', 'B', 11);
        $this->fpdi->Cell(60, 6, $contract->car->plate_number ?? '');

        // Couleur (maintenant disponible dans le modèle Car)
        $this->fpdi->SetXY(135, 88.3);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(60, 6, $contract->car->color ?? '');

        // Carburant (Diesel par défaut)
        $this->fpdi->SetXY(140, 94.6);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(60, 6, 'Diesel');

        // ============================================
        // 4. DÉTAILS LOCATION (droite milieu) - X ≈ 125
        // ============================================
        
        // Date départ - Date
        $this->fpdi->SetXY(146, 110.8);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(35, 6, $contract->start_date->format('d/m/Y'));
        
        // Date départ - Heure
        $this->fpdi->SetXY(174, 110.8);
        $this->fpdi->SetFont('Helvetica', 'BI', 11);
        $this->fpdi->Cell(20, 6, 'Heure: ' . $contract->start_date->format('H:i'));

        // Date retour - Date
        $this->fpdi->SetXY(145, 116.1);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(35, 6, $contract->end_date->format('d/m/Y'));
        
        // Date retour - Heure
        $this->fpdi->SetXY(173, 116.1);
        $this->fpdi->SetFont('Helvetica', 'BI', 11);
        $this->fpdi->Cell(20, 6, 'Heure: ' . $contract->end_date->format('H:i'));

        // Durée
        $days = $contract->start_date->diffInDays($contract->end_date);
        $this->fpdi->SetXY(114, 147);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(60, 6, $days . ' jour(s)');

        // Lieu départ
        $this->fpdi->SetXY(147, 121.4);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(60, 6, $contract->pickup_location);

        // Lieu retour
        $this->fpdi->SetXY(146, 126.8);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(60, 6, $contract->return_location);

        // ============================================
        // 5. FINANCE (bas droite) - X ≈ 125
        // ============================================
        
        // Prix total
        $this->fpdi->SetXY(146, 147);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(60, 6, number_format($contract->total_price));

        // Prix / jour
        $this->fpdi->SetXY(133, 147);
        $this->fpdi->SetFont('Helvetica', 'I', 11);
        $this->fpdi->Cell(60, 6, number_format($contract->daily_price));

        // Mode de Règlement
        $paymentTerms = $contract->payment_terms ?? 'COMPTANT';
        $this->fpdi->SetXY(173, 147);
        $this->fpdi->SetFont('Helvetica', 'BI', 11);
        $this->fpdi->Cell(60, 6, $paymentTerms === 'COMPTANT' ? 'COMPTANT' : 'ECHEANCIER');

        // ============================================
        // 6. SIGNATURE / DATE (centre bas)
        // ============================================
        
        // Date signature - Jour
        $this->fpdi->SetXY(170.8, 262);
        $this->fpdi->SetFont('Helvetica', 'I', 8);
        $this->fpdi->Cell(15, 6, now()->format('d'));

        // Date signature - Mois
        $this->fpdi->SetXY(179.6, 262);
        $this->fpdi->SetFont('Helvetica', 'I', 8);
        $this->fpdi->Cell(15, 6, now()->format('m'));

        // Date signature - Année
        $this->fpdi->SetXY(189, 262);
        $this->fpdi->SetFont('Helvetica', 'I', 8);
        $this->fpdi->Cell(20, 6, now()->format('Y'));

        // ============================================
        // 7. OPTIONS (checkbox en bas gauche)
        // ============================================
        
        $accessories = $contract->included_accessories ?? [];
        
        // Colonne gauche (X ≈ 40)
        $this->fpdi->SetFont('Helvetica', 'B', 10);
        
        // Left column - 3 accessories
        $this->fpdi->SetXY(38.8, 261.8);
        $this->fpdi->Cell(5, 5, in_array('ROUE_SECOURS', $accessories) ? 'X' : '');

        $this->fpdi->SetXY(38.8, 267.2);
        $this->fpdi->Cell(5, 5, in_array('POSTE_RADIO', $accessories) ? 'X' : '');

        $this->fpdi->SetXY(38.8, 272.5);
        $this->fpdi->Cell(5, 5, in_array('SIEGE_ENFANT', $accessories) ? 'X' : '');

        // Right column - 3 accessories
        $this->fpdi->SetXY(90.2, 261.8);
        $this->fpdi->Cell(5, 5, in_array('PORTE_BAGAGE', $accessories) ? 'X' : '');

        $this->fpdi->SetXY(90.2, 267);
        $this->fpdi->Cell(5, 5, in_array('CRIQ', $accessories) ? 'X' : '');

        $this->fpdi->SetXY(90.2, 272.5);
        $this->fpdi->Cell(5, 5, in_array('VOITRE_PROPRE', $accessories) ? 'X' : '');
    }

    /**
     * Fill Page 2 (if needed)
     */
    protected function fillPage2(Contract $contract)
    {
        // Add any additional data for page 2 if needed
        // For now, the template already contains the terms
    }

    /**
     * Helper to write text at specific coordinates
     */
    protected function writeText(float $x, float $y, string $text, string $font = 'Helvetica', string $style = '', float $size = 10): void
    {
        $this->fpdi->SetXY($x, $y);
        $this->fpdi->SetFont($font, $style, $size);
        $this->fpdi->Cell(0, 6, $text);
    }
}
 