<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Contract;
use setasign\Fpdi\Fpdi;

class AnalyzePdfCoordinates extends Command
{
    protected $signature = 'pdf:analyze {contract_id?}';
    protected $description = 'Generate a comprehensive PDF with detailed coordinate markers and field positions';

    public function handle()
    {
        $contractId = $this->argument('contract_id');
        
        $this->info("🔍 Analyzing PDF template and generating coordinate reference...");

        $templatePath = storage_path('app/public/templates/contract_template.pdf');
        
        if (!file_exists($templatePath)) {
            $this->error("❌ Template PDF not found at: {$templatePath}");
            return Command::FAILURE;
        }

        $contract = $contractId ? Contract::with('car')->find($contractId) : null;

        $fpdi = new Fpdi();
        $pageCount = $fpdi->setSourceFile($templatePath);
        
        $this->info("📄 Template loaded: {$pageCount} page(s)");

        // ==========================================
        // PAGE 1: COORDINATE GRID ON CONTRACT (Simple Style)
        // ==========================================
        $fpdi->AddPage();
        $tplId = $fpdi->importPage(1);
        $fpdi->useImportedPage($tplId);

        // 1. GRID LINES AND COORDINATES (Simple, Clean Style)
        $fpdi->SetLineWidth(0.2);
        $fpdi->SetTextColor(255, 0, 0);

        // Horizontal lines every 10mm with Y labels every 20mm
        for ($y = 10; $y <= 280; $y += 10) {
            $fpdi->SetDrawColor(200, 200, 200);
            $fpdi->Line(0, $y, 210, $y);
            
            // Add Y coordinate labels every 20mm
            if ($y % 20 === 0) {
                $fpdi->SetXY(2, $y);
                $fpdi->SetFont('Helvetica', '', 6);
                $fpdi->SetTextColor(255, 0, 0);
                $fpdi->Cell(10, 4, "Y:{$y}");
            }
        }

        // Vertical lines every 10mm with X labels every 20mm
        for ($x = 10; $x <= 200; $x += 10) {
            $fpdi->SetDrawColor(200, 200, 200);
            $fpdi->Line($x, 0, $x, 297);
            
            // Add X coordinate labels every 20mm
            if ($x % 20 === 0) {
                $fpdi->SetXY($x, 2);
                $fpdi->SetFont('Helvetica', '', 6);
                $fpdi->SetTextColor(0, 0, 255);
                $fpdi->Cell(10, 4, "X:{$x}");
            }
        }

        // 2. MARKERS AT KEY POSITIONS (Red squares)
        $markers = [
            [10, 10], [100, 10], [200, 10],
            [10, 148], [100, 148], [200, 148],
            [10, 287], [100, 287], [200, 287],
        ];

        foreach ($markers as $marker) {
            $fpdi->SetDrawColor(255, 0, 0);
            $fpdi->SetLineWidth(0.5);
            $size = 2;
            $fpdi->Rect($marker[0] - $size, $marker[1] - $size, $size * 2, $size * 2, 'D');
        }

        // Save PDF
        $outputPath = storage_path('app/public/templates/coordinate_analysis.pdf');
        $fpdi->Output($outputPath, 'F');

        $this->info("✅ Coordinate analysis PDF generated!");
        $this->info("📂 Location: {$outputPath}");
        $this->info("\n📖 How to use this analysis:");
        $this->info("1. Open the coordinate_analysis.pdf file");
        $this->info("2. Use the grid to find exact X/Y positions (in millimeters)");
        $this->info("3. X = horizontal position (0-210mm for A4)");
        $this->info("4. Y = vertical position (0-297mm for A4)");
        $this->info("5. Colored zones show recommended field areas");
        $this->info("6. Red points show major grid intersections");
        
        return Command::SUCCESS;
    }

    protected function fillTestFields(Fpdi $fpdi, Contract $contract)
    {
        $fpdi->SetTextColor(0, 0, 255);
        $fpdi->SetFont('Helvetica', '', 9);

        // LOCATAIRE (Left column)
        $fpdi->SetXY(25, 75);
        $fpdi->Cell(80, 6, "Nom: " . ($contract->driver_last_name ?? '[NOM]'));

        $fpdi->SetXY(25, 85);
        $fpdi->Cell(80, 6, "Prénom: " . ($contract->driver_first_name ?? '[PRÉNOM]'));

        $fpdi->SetXY(25, 95);
        $fpdi->Cell(80, 6, "CIN: " . ($contract->driver_cin_number ?? '[CIN]'));

        $fpdi->SetXY(25, 105);
        $fpdi->Cell(80, 6, "Adresse: " . ($contract->driver_address ?? '[ADRESSE]'));

        $fpdi->SetXY(25, 115);
        $fpdi->Cell(80, 6, "Permis: " . ($contract->driver_license_number ?? '[PERMIS]'));

        $fpdi->SetXY(25, 125);
        $fpdi->Cell(80, 6, "Tél: " . ($contract->driver_phone ?? '[TÉL]'));

        // VÉHICULE (Right column top)
        $fpdi->SetXY(125, 75);
        $fpdi->Cell(70, 6, "Véhicule: " . $contract->car->brand . ' ' . $contract->car->model);

        $fpdi->SetXY(125, 85);
        $fpdi->Cell(70, 6, "Immat: " . ($contract->car->plate_number ?? '[PLAQUE]'));

        // LOCATION (Right column middle)
        $fpdi->SetXY(125, 145);
        $fpdi->Cell(70, 6, "Début: " . $contract->start_date->format('d/m/Y H:i'));

        $fpdi->SetXY(125, 155);
        $fpdi->Cell(70, 6, "Fin: " . $contract->end_date->format('d/m/Y H:i'));

        $fpdi->SetXY(125, 165);
        $fpdi->Cell(70, 6, "Lieu: " . ($contract->pickup_location ?? '[LIEU]'));

        // FINANCE (Right column bottom)
        $fpdi->SetXY(125, 215);
        $fpdi->SetFont('Helvetica', 'B', 10);
        $fpdi->Cell(70, 6, "Total: " . number_format($contract->total_price, 2) . ' MAD');

        $fpdi->SetXY(125, 225);
        $fpdi->SetFont('Helvetica', '', 9);
        $fpdi->Cell(70, 6, "Journalier: " . number_format($contract->daily_price, 2) . ' MAD');

        $fpdi->SetXY(125, 235);
        $fpdi->Cell(70, 6, "Caution: " . number_format($contract->deposit_amount, 2) . ' MAD');

        // 2ÈME CONDUCTEUR (Left column bottom)
        if ($contract->second_driver_first_name || $contract->second_driver_last_name) {
            $fpdi->SetXY(25, 225);
            $fpdi->Cell(80, 6, "2ème: " . $contract->second_driver_first_name . ' ' . $contract->second_driver_last_name);
        }
    }

    protected function fillPlaceholderFields(Fpdi $fpdi)
    {
        $fpdi->SetTextColor(0, 0, 255);
        $fpdi->SetFont('Helvetica', '', 9);

        // Show example positions
        $examples = [
            ['x' => 25, 'y' => 75, 'text' => '[NOM] - X:25, Y:75'],
            ['x' => 25, 'y' => 85, 'text' => '[PRÉNOM] - X:25, Y:85'],
            ['x' => 25, 'y' => 95, 'text' => '[CIN] - X:25, Y:95'],
            ['x' => 125, 'y' => 75, 'text' => '[VÉHICULE] - X:125, Y:75'],
            ['x' => 125, 'y' => 145, 'text' => '[DATE DÉBUT] - X:125, Y:145'],
            ['x' => 125, 'y' => 215, 'text' => '[PRIX TOTAL] - X:125, Y:215'],
        ];

        foreach ($examples as $example) {
            $fpdi->SetXY($example['x'], $example['y']);
            $fpdi->Cell(80, 6, $example['text']);
        }
    }
}
