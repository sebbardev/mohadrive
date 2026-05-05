<?php

namespace App\Console\Commands;

use App\Models\Car;
use App\Models\Expense;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class GenerateMonthlyFixedExpenses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'expenses:generate-monthly {--month= : Month to generate (YYYY-MM format, default: current month)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate automatic monthly fixed expenses (credit, insurance, vignette) for all cars';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚗 Generation of monthly fixed expenses...');

        // Determine the month to process
        $monthOption = $this->option('month');
        if ($monthOption) {
            $targetDate = Carbon::createFromFormat('Y-m', $monthOption);
        } else {
            $targetDate = Carbon::now();
        }

        $year = $targetDate->year;
        $month = $targetDate->month;
        $monthName = $targetDate->translatedFormat('F Y');

        $this->info("📅 Processing month: {$monthName}");

        $cars = Car::all();
        $generated = 0;
        $skipped = 0;

        foreach ($cars as $car) {
            $this->line("  🚙 Processing: {$car->brand} {$car->model}");

            // 1. Generate Credit expense if applicable
            if ($car->has_credit && $car->monthly_credit && $car->credit_start_date && $car->credit_end_date) {
                $creditStart = Carbon::parse($car->credit_start_date);
                $creditEnd = Carbon::parse($car->credit_end_date);

                if ($targetDate->between($creditStart, $creditEnd)) {
                    // Check if already exists for this month
                    $existing = Expense::where('car_id', $car->id)
                        ->where('type', 'crédit')
                        ->where('is_automatic', true)
                        ->whereYear('date', $year)
                        ->whereMonth('date', $month)
                        ->first();

                    if (!$existing) {
                        Expense::create([
                            'car_id' => $car->id,
                            'type' => 'crédit',
                            'amount' => $car->monthly_credit,
                            'date' => Carbon::create($year, $month, $car->credit_payment_day ?: 1),
                            'note' => "Mensualité crédit générée automatiquement pour {$monthName}",
                            'is_automatic' => true,
                            'recurrence_type' => 'monthly',
                        ]);
                        $generated++;
                        $this->info("    ✅ Credit: {$car->monthly_credit} DH");
                    } else {
                        $skipped++;
                        $this->warn("    ⚠️  Credit already exists");
                    }
                }
            }

            // 2. Generate Insurance expense (annual / 12)
            if ($car->annual_insurance > 0) {
                $monthlyInsurance = round($car->annual_insurance / 12, 2);
                
                $existing = Expense::where('car_id', $car->id)
                    ->where('type', 'assurance')
                    ->where('is_automatic', true)
                    ->whereYear('date', $year)
                    ->whereMonth('date', $month)
                    ->first();

                if (!$existing) {
                    Expense::create([
                        'car_id' => $car->id,
                        'type' => 'assurance',
                        'amount' => $monthlyInsurance,
                        'date' => Carbon::create($year, $month, 1),
                        'note' => "Quote-part assurance mensuelle pour {$monthName}",
                        'is_automatic' => true,
                        'recurrence_type' => 'monthly',
                    ]);
                    $generated++;
                    $this->info("    ✅ Insurance: {$monthlyInsurance} DH");
                } else {
                    $skipped++;
                    $this->warn("    ⚠️  Insurance already exists");
                }
            }

            // 3. Generate Vignette expense (annual / 12)
            if ($car->annual_vignette > 0) {
                $monthlyVignette = round($car->annual_vignette / 12, 2);
                
                $existing = Expense::where('car_id', $car->id)
                    ->where('type', 'vignette')
                    ->where('is_automatic', true)
                    ->whereYear('date', $year)
                    ->whereMonth('date', $month)
                    ->first();

                if (!$existing) {
                    Expense::create([
                        'car_id' => $car->id,
                        'type' => 'vignette',
                        'amount' => $monthlyVignette,
                        'date' => Carbon::create($year, $month, 1),
                        'note' => "Quote-part vignette mensuelle pour {$monthName}",
                        'is_automatic' => true,
                        'recurrence_type' => 'monthly',
                    ]);
                    $generated++;
                    $this->info("    ✅ Vignette: {$monthlyVignette} DH");
                } else {
                    $skipped++;
                    $this->warn("    ⚠️  Vignette already exists");
                }
            }
        }

        $this->newLine();
        $this->info("✅ Generation complete!");
        $this->info("   📊 Generated: {$generated} expenses");
        $this->warn("   ⏭️  Skipped: {$skipped} (already exist)");
    }
}
