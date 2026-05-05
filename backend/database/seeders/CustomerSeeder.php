<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = [
            [
                'first_name' => 'Haytham',
                'last_name' => 'Sebbar',
                'email' => 'haytham.sebbar@email.com',
                'phone' => '0665663909',
                'license_number' => 'AB123456',
                'cin_number' => 'EE123456',
                'address' => 'Avenue de France, Casablanca',
                'birth_date' => '1990-05-15',
            ],
            [
                'first_name' => 'Ahmed',
                'last_name' => 'Amrani',
                'email' => 'ahmed.amrani@email.com',
                'phone' => '0612345678',
                'license_number' => 'CD789012',
                'cin_number' => 'BK789012',
                'address' => 'Rue 45, Quartier Habous, Casablanca',
                'birth_date' => '1985-08-22',
            ],
            [
                'first_name' => 'Fatima',
                'last_name' => 'Zahra',
                'email' => 'fatima.zahra@email.com',
                'phone' => '0645678901',
                'license_number' => 'EF345678',
                'cin_number' => 'LF345678',
                'address' => 'Avenue Mohammed V, Rabat',
                'birth_date' => '1992-03-10',
            ],
            [
                'first_name' => 'Youssef',
                'last_name' => 'Benali',
                'email' => 'youssef.benali@email.com',
                'phone' => '0656789012',
                'license_number' => 'GH901234',
                'cin_number' => 'MG901234',
                'address' => 'Boulevard Zerktouni, Casablanca',
                'birth_date' => '1988-11-30',
            ],
            [
                'first_name' => 'Yasmine',
                'last_name' => 'Berrada',
                'email' => 'yasmine.berrada@email.com',
                'phone' => '0623456789',
                'license_number' => 'IJ567890',
                'cin_number' => 'HJ567890',
                'address' => 'Quartier Palmier, Casablanca',
                'birth_date' => '1995-07-18',
            ],
            [
                'first_name' => 'Robert',
                'last_name' => 'Smith',
                'email' => 'robert.smith@email.com',
                'phone' => '+44789123456',
                'license_number' => 'UK9876543',
                'cin_number' => 'PASSPORT123',
                'address' => '123 London Street, UK',
                'birth_date' => '1980-02-25',
            ],
            [
                'first_name' => 'Karim',
                'last_name' => 'Idrissi',
                'email' => 'karim.idrissi@email.com',
                'phone' => '0634567890',
                'license_number' => 'KL234567',
                'cin_number' => 'DK234567',
                'address' => 'Avenue Hassan II, Agadir',
                'birth_date' => '1987-09-12',
            ],
            [
                'first_name' => 'Sara',
                'last_name' => 'Alaoui',
                'email' => 'sara.alaoui@email.com',
                'phone' => '0678901234',
                'license_number' => 'MN678901',
                'cin_number' => 'TN678901',
                'address' => 'Rue de Fès, Meknès',
                'birth_date' => '1993-12-05',
            ],
            [
                'first_name' => 'Mohammed',
                'last_name' => 'Tazi',
                'email' => 'mohammed.tazi@email.com',
                'phone' => '0689012345',
                'license_number' => 'OP123789',
                'cin_number' => 'BP123789',
                'address' => 'Médina, Fès',
                'birth_date' => '1982-06-20',
            ],
            [
                'first_name' => 'Leila',
                'last_name' => 'Chraibi',
                'email' => 'leila.chraibi@email.com',
                'phone' => '0690123456',
                'license_number' => 'QR456012',
                'cin_number' => 'AR456012',
                'address' => 'Quartier Souissi, Rabat',
                'birth_date' => '1991-04-15',
            ],
            [
                'first_name' => 'Omar',
                'last_name' => 'El Fassi',
                'email' => 'omar.elfassi@email.com',
                'phone' => '0601234567',
                'license_number' => 'ST789345',
                'cin_number' => 'ES789345',
                'address' => 'Boulevard Moulay Youssef, Tanger',
                'birth_date' => '1986-01-08',
            ],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}
