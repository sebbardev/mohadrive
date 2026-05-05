<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Car;
use App\Mail\ContractConfirmationMail;
use App\Services\ContractPdfFiller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Services\UnifiedEmailService;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ContractController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Contract::with('car');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('driver_first_name', 'like', "%{$search}%")
                  ->orWhere('driver_last_name', 'like', "%{$search}%")
                  ->orWhere('driver_license_number', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%");
            });
        }

        // Support sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        
        // Validate sort columns to prevent SQL injection
        $allowedSortColumns = ['created_at', 'start_date', 'end_date', 'total_price', 'status'];
        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'created_at';
        }
        
        // Validate sort order
        $sortOrder = in_array(strtolower($sortOrder), ['asc', 'desc']) ? $sortOrder : 'desc';
        
        // Support pagination with per_page parameter
        $perPage = $request->input('per_page', 15);

        return response()->json($query->orderBy($sortBy, $sortOrder)->paginate($perPage));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'booking_id' => 'nullable|exists:bookings,id',
            'customer_id' => 'nullable|exists:customers,id',
            'driver_first_name' => 'required|string',
            'driver_last_name' => 'required|string',
            'driver_birth_date' => 'nullable|date',
            'driver_nationality' => 'nullable|string',
            'driver_license_number' => 'required|string',
            'driver_license_date' => 'required|date',
            'driver_phone' => 'required|string',
            'driver_email' => 'required|email',
            'driver_cin_number' => 'required|string',
            'cin_issue_date' => 'nullable|date',
            'passport_number' => 'nullable|string',
            'passport_issue_date' => 'nullable|date',
            'driver_address' => 'required|string',
            'second_driver_first_name' => 'nullable|string',
            'second_driver_last_name' => 'nullable|string',
            'second_driver_birth_date' => 'nullable|date',
            'second_driver_nationality' => 'nullable|string',
            'second_driver_license_number' => 'nullable|string',
            'second_driver_license_date' => 'nullable|date',
            'second_driver_cin_number' => 'nullable|string',
            'second_driver_cin_issue_date' => 'nullable|date',
            'second_driver_passport_number' => 'nullable|string',
            'second_driver_passport_issue_date' => 'nullable|date',
            'second_driver_address' => 'nullable|string',
            'second_driver_phone' => 'nullable|string',
            'second_driver_email' => 'nullable|email',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'pickup_location' => 'required|string',
            'return_location' => 'required|string',
            'initial_mileage' => 'required|numeric',
            'fuel_level' => 'required|string',
            'included_accessories' => 'nullable|array',
            'deposit_amount' => 'required|numeric',
            'insurance_deductible' => 'required|numeric',
            'daily_price_override' => 'nullable|numeric',
            'payment_method' => 'required|string',
            'is_paid' => 'boolean',
        ]);

        $car = Car::findOrFail($validated['car_id']);

        // Gérer le client (trouver ou créer si non fourni)
        $customerId = $validated['customer_id'] ?? null;
        if (!$customerId) {
            $customer = \App\Models\Customer::firstOrCreate(
                ['email' => $validated['driver_email']],
                [
                    'first_name' => $validated['driver_first_name'],
                    'last_name' => $validated['driver_last_name'],
                    'phone' => $validated['driver_phone'],
                    'license_number' => $validated['driver_license_number'],
                    'cin_number' => $validated['driver_cin_number'],
                ]
            );
            $customerId = $customer->id;
        }
        
        // Calcul automatique du prix
        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);
        $days = max(1, $startDate->diffInDays($endDate));
        
        // On utilise le prix journalier passé en paramètre ou celui de la voiture
        $dailyPrice = $validated['daily_price_override'] ?? $car->price_per_day;
        $totalPrice = $days * $dailyPrice;

        // AUTOMATISATION : Création de réservation si booking_id est manquant
        $autoBookingCreated = false;
        $bookingId = $validated['booking_id'] ?? null;

        if (!$bookingId) {
            $booking = \App\Models\Booking::create([
                'user_id' => auth()->id() ?? 1, // Admin ID si non connecté
                'car_id' => $validated['car_id'],
                'customer_id' => $customerId,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'total_price' => $totalPrice,
                'daily_price' => $dailyPrice,
                'status' => 'CONFIRMED',
                'first_name' => $validated['driver_first_name'],
                'last_name' => $validated['driver_last_name'],
                'email' => $validated['driver_email'],
                'phone' => $validated['driver_phone'],
                'location' => $validated['pickup_location'],
                'return_location' => $validated['return_location'],
            ]);
            $bookingId = $booking->id;
            $autoBookingCreated = true;
            \Log::info("Réservation automatique créée depuis le contrat", [
                'booking_id' => $bookingId,
                'contract_driver' => $validated['driver_first_name'] . ' ' . $validated['driver_last_name'],
                'car' => $car->brand . ' ' . $car->model,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
            ]);
        }

        $contractData = array_merge($validated, [
            'booking_id' => $bookingId,
            'customer_id' => $customerId,
            'total_price' => $totalPrice,
            'daily_price' => $dailyPrice,
            'status' => 'PENDING',
            'version' => 1,
        ]);

        $contract = Contract::create($contractData);

        // Générer le PDF
        $this->generatePdf($contract);

        // Marquer le véhicule comme indisponible
        $car->update(['available' => false]);

        // Envoyer l'email stylisé au conducteur principal
        try {
            UnifiedEmailService::sendContractConfirmation($contract);
            
            // Envoyer aussi au deuxième conducteur si présent
            if ($contract->second_driver_email) {
                // Note: Pour le deuxième conducteur, nous pourrions créer une méthode dédiée
                // ou modifier le contrat temporairement pour l'envoi
                \Log::info("Contract confirmation should also be sent to second driver: {$contract->second_driver_email}");
            }
        } catch (\Exception $e) {
            \Log::error("Erreur envoi email contrat stylisé: " . $e->getMessage());
        }

        $contract->logAction('CREATE', 'Contract', $contract->id, json_encode($contract));

        return response()->json([
            'contract' => $contract,
            'booking_auto_created' => $autoBookingCreated,
            'message' => $autoBookingCreated ? "Contrat créé et réservation générée automatiquement." : "Contrat créé avec succès."
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Contract $contract)
    {
        return response()->json($contract->load('car'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'car_id' => 'sometimes|exists:cars,id',
            'driver_first_name' => 'sometimes|string',
            'driver_last_name' => 'sometimes|string',
            'driver_birth_date' => 'nullable|date',
            'driver_nationality' => 'nullable|string',
            'driver_license_number' => 'sometimes|string',
            'driver_phone' => 'sometimes|string',
            'driver_email' => 'sometimes|email',
            'driver_cin_number' => 'sometimes|string',
            'cin_issue_date' => 'nullable|date',
            'passport_number' => 'nullable|string',
            'passport_issue_date' => 'nullable|date',
            'second_driver_first_name' => 'nullable|string',
            'second_driver_last_name' => 'nullable|string',
            'second_driver_birth_date' => 'nullable|date',
            'second_driver_nationality' => 'nullable|string',
            'second_driver_license_number' => 'nullable|string',
            'second_driver_license_date' => 'nullable|date',
            'second_driver_cin_number' => 'nullable|string',
            'second_driver_cin_issue_date' => 'nullable|date',
            'second_driver_passport_number' => 'nullable|string',
            'second_driver_passport_issue_date' => 'nullable|date',
            'second_driver_address' => 'nullable|string',
            'second_driver_phone' => 'nullable|string',
            'second_driver_email' => 'nullable|email',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'pickup_location' => 'sometimes|string',
            'return_location' => 'sometimes|string',
            'deposit_amount' => 'sometimes|numeric',
            'status' => 'sometimes|string',
        ]);

        $oldCarId = $contract->car_id;
        $contract->fill($validated);
        
        if ($contract->isDirty(['start_date', 'end_date', 'car_id'])) {
            $car = Car::find($contract->car_id);
            $days = max(1, Carbon::parse($contract->start_date)->diffInDays(Carbon::parse($contract->end_date)));
            $contract->daily_price = $car->price_per_day;
            $contract->total_price = $days * $contract->daily_price;
        }

        if ($contract->isDirty()) {
            if ($contract->isDirty('car_id')) {
                // Rendre l'ancienne voiture disponible
                Car::where('id', $oldCarId)->update(['available' => true]);
                // Rendre la nouvelle voiture indisponible
                Car::where('id', $contract->car_id)->update(['available' => false]);
            }

            $contract->version += 1;
            $contract->save();
            
            // Régénérer le PDF après modification
            $this->generatePdf($contract);
            
            $contract->logAction('UPDATE', 'Contract', $contract->id, json_encode($contract->getChanges()));
        }

        return response()->json($contract);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contract $contract)
    {
        if ($contract->pdf_path) {
            Storage::disk('public')->delete($contract->pdf_path);
        }
        
        $contract->logAction('DELETE', 'Contract', $contract->id, json_encode($contract));
        $contract->delete();

        return response()->json(null, 204);
    }

    /**
     * Generate PDF for the contract using existing template.
     */
    private function generatePdf(Contract $contract)
    {
        // Supprimer TOUS les anciens fichiers PDF de ce contrat pour éviter les conflits et le cache
        $files = Storage::disk('public')->files('contracts');
        foreach ($files as $file) {
            if (strpos($file, "contracts/contract_{$contract->id}_v") === 0) {
                Storage::disk('public')->delete($file);
            }
        }

        // Use the PDF template filler service
        $pdfFiller = new ContractPdfFiller();
        $filename = $pdfFiller->fill($contract);
        
        $contract->pdf_path = $filename;
        $contract->save();
        
        return $filename;
    }

    /**
     * Download PDF.
     */
    public function downloadPdf(Contract $contract)
    {
        // Load the car relationship to access car details
        $contract->load('car');
        
        // On régénère TOUJOURS le PDF avant le téléchargement pour s'assurer qu'il a le dernier style
        $this->generatePdf($contract);

        // Generate descriptive filename with tenant name, vehicle, and contract date
        $tenantName = strtoupper(str_replace(' ', '_', $contract->driver_first_name . '_' . $contract->driver_last_name));
        $vehicleName = strtoupper(str_replace(' ', '_', $contract->car->brand . '_' . $contract->car->model));
        $contractDate = $contract->start_date->format('Y-m-d');
        $downloadFilename = "Contrat_{$tenantName}_{$vehicleName}_{$contractDate}.pdf";

        // Get the file content
        $fileContent = Storage::disk('public')->get($contract->pdf_path);
        
        // Return with proper headers
        return response($fileContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $downloadFilename . '"',
        ]);
    }

    /**
     * Close the contract (Check-out).
     */
    public function close(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'actual_return_date' => 'required|date',
            'return_mileage' => 'required|integer',
            'return_fuel_level' => 'required|string',
            'return_damages' => 'nullable|string',
            'deposit_status' => 'required|string|in:HELD,RELEASED,CLAIMED',
            'additional_charges' => 'required|numeric|min:0',
            'return_notes' => 'nullable|string',
        ]);

        $contract->update(array_merge($validated, [
            'status' => 'COMPLETED'
        ]));

        // Marquer le véhicule comme disponible
        $contract->car->update(['available' => true]);

        $contract->logAction('CLOSE', 'Contract', $contract->id, json_encode($contract));

        return response()->json($contract);
    }
}