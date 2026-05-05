<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Models\Contract;
use App\Models\Customer;

class MigrateDataToCustomers extends Command
{
    protected $signature = 'app:migrate-customers';
    protected $description = 'Migrate existing bookings and contracts data to centralized customers table';

    public function handle()
    {
        $this->info('Starting migration...');

        // Migrate from Bookings
        $bookings = Booking::whereNull('customer_id')->get();
        foreach ($bookings as $booking) {
            $customer = Customer::firstOrCreate(
                ['email' => $booking->email],
                [
                    'first_name' => $booking->first_name,
                    'last_name' => $booking->last_name,
                    'phone' => $booking->phone,
                ]
            );
            $booking->update(['customer_id' => $customer->id]);
        }
        $this->info(count($bookings) . ' bookings linked to customers.');

        // Migrate from Contracts
        $contracts = Contract::whereNull('customer_id')->get();
        foreach ($contracts as $contract) {
            $customer = Customer::firstOrCreate(
                ['email' => $contract->driver_email],
                [
                    'first_name' => $contract->driver_first_name,
                    'last_name' => $contract->driver_last_name,
                    'phone' => $contract->driver_phone,
                    'license_number' => $contract->driver_license_number,
                ]
            );
            $contract->update(['customer_id' => $customer->id]);
        }
        $this->info(count($contracts) . ' contracts linked to customers.');

        $this->info('Migration completed successfully.');
    }
}
