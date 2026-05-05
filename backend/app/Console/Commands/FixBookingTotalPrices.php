<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use Carbon\Carbon;

class FixBookingTotalPrices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:fix-total-prices {--dry-run : Show what would be changed without actually changing}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recalculate total_price for all bookings based on daily_price and duration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting booking total price recalculation...');
        
        $bookings = Booking::all();
        $updated = 0;
        $skipped = 0;
        $errors = 0;
        
        $dryRun = $this->option('dry-run');
        
        if ($dryRun) {
            $this->warn('DRY RUN MODE - No changes will be made to the database');
        }
        
        $bar = $this->output->createProgressBar($bookings->count());
        $bar->start();
        
        foreach ($bookings as $booking) {
            try {
                // Calculate the number of days
                $startDate = Carbon::parse($booking->start_date);
                $endDate = Carbon::parse($booking->end_date);
                $days = $startDate->diffInDays($endDate);
                
                // Ensure at least 1 day
                if ($days <= 0) {
                    $days = 1;
                }
                
                // Get the daily price
                $dailyPrice = $booking->daily_price ?? $booking->car->price_per_day ?? 0;
                
                // Calculate the correct total price
                $correctTotalPrice = $days * $dailyPrice;
                
                // Check if the current total_price is different
                if (abs($booking->total_price - $correctTotalPrice) > 0.01) {
                    $this->line("\n");
                    $this->info("Booking #{$booking->id}:");
                    $this->line("  Customer: {$booking->first_name} {$booking->last_name}");
                    $this->line("  Dates: {$booking->start_date} to {$booking->end_date}");
                    $this->line("  Days: {$days}");
                    $this->line("  Daily Price: {$dailyPrice} DH");
                    $this->line("  Current Total: {$booking->total_price} DH");
                    $this->line("  Correct Total: {$correctTotalPrice} DH");
                    $this->line("  Difference: " . ($correctTotalPrice - $booking->total_price) . " DH");
                    
                    if (!$dryRun) {
                        $booking->total_price = $correctTotalPrice;
                        $booking->save();
                        $this->info("  ✓ Updated!");
                    } else {
                        $this->warn("  ⚠ Would update (dry run)");
                    }
                    
                    $updated++;
                } else {
                    $skipped++;
                }
            } catch (\Exception $e) {
                $this->error("\nError processing booking #{$booking->id}: " . $e->getMessage());
                $errors++;
            }
            
            $bar->advance();
        }
        
        $bar->finish();
        $this->newLine(2);
        
        $this->info('Summary:');
        $this->line("  Total bookings processed: {$bookings->count()}");
        $this->line("  Updated: {$updated}");
        $this->line("  Skipped (already correct): {$skipped}");
        $this->line("  Errors: {$errors}");
        
        if ($dryRun && $updated > 0) {
            $this->warn("\nTo apply these changes, run: php artisan bookings:fix-total-prices");
        }
        
        return Command::SUCCESS;
    }
}
