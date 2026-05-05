<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use setasign\Fpdi\Fpdi;

class FindPdfCoordinates extends Command
{
    protected $signature = 'pdf:coordinates {pdf?}';
    protected $description = 'Extract coordinate grid from PDF template to help position text fields';

    public function handle()
    {
        $pdfPath = $this->argument('pdf') ?? storage_path('app/public/templates/contract_template.pdf');
        
        if (!file_exists($pdfPath)) {
            $this->error("PDF file not found: {$pdfPath}");
            return 1;
        }

        $this->info("📄 PDF Template: " . basename($pdfPath));
        $this->info("📏 Generating coordinate grid...\n");

        $fpdi = new Fpdi();
        $pageCount = $fpdi->setSourceFile($pdfPath);

        $this->info("PDF has {$pageCount} page(s)\n");

        // Generate coordinate reference PDF
        $outputPath = storage_path('app/public/templates/coordinate_reference.pdf');
        
        $fpdi->AddPage();
        $tplId = $fpdi->importPage(1);
        $fpdi->useImportedPage($tplId);

        // Draw grid lines and coordinates
        $fpdi->SetLineWidth(0.2);
        $fpdi->SetTextColor(255, 0, 0);

        // Horizontal lines every 10mm
        for ($y = 10; $y <= 280; $y += 10) {
            $fpdi->SetDrawColor(200, 200, 200);
            $fpdi->Line(0, $y, 210, $y);
            
            // Add coordinate labels every 20mm
            if ($y % 20 === 0) {
                $fpdi->SetXY(2, $y);
                $fpdi->SetFont('Helvetica', '', 6);
                $fpdi->Cell(10, 4, "Y:{$y}");
            }
        }

        // Vertical lines every 10mm
        for ($x = 10; $x <= 200; $x += 10) {
            $fpdi->SetDrawColor(200, 200, 200);
            $fpdi->Line($x, 0, $x, 297);
            
            // Add coordinate labels every 20mm
            if ($x % 20 === 0) {
                $fpdi->SetXY($x, 2);
                $fpdi->SetFont('Helvetica', '', 6);
                $fpdi->Cell(10, 4, "X:{$x}");
            }
        }

        // Add markers at key positions
        $markers = [
            [10, 10], [100, 10], [200, 10],
            [10, 148], [100, 148], [200, 148],
            [10, 287], [100, 287], [200, 287],
        ];

        foreach ($markers as $marker) {
            $fpdi->SetDrawColor(255, 0, 0);
            $fpdi->SetLineWidth(0.5);
            // Draw a small square instead of circle
            $size = 2;
            $fpdi->Rect($marker[0] - $size, $marker[1] - $size, $size * 2, $size * 2, 'D');
        }

        $fpdi->Output($outputPath, 'F');

        $this->info("✅ Coordinate reference PDF generated!");
        $this->info("📂 Location: {$outputPath}");
        $this->info("\n📖 How to use:");
        $this->info("1. Open the generated coordinate_reference.pdf");
        $this->info("2. Look at the grid to find exact X/Y positions");
        $this->info("3. X = horizontal (left to right, 0-210mm for A4)");
        $this->info("4. Y = vertical (top to bottom, 0-297mm for A4)");
        $this->info("5. Update coordinates in ContractPdfFiller.php");
        
        return 0;
    }
}
