import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://mohadrive.com/api";

export const contractSchema = z.object({
  car_id: z.string().min(1, "Véhicule requis"),
  booking_id: z.string().optional().nullable(),
  customer_id: z.string().optional().nullable(),
  contract_type: z.enum(["STANDARD", "CORPORATE", "LONG_TERM"]).default("STANDARD"),
  
  // Principal Driver
  driver_first_name: z.string().min(2, "Prénom requis"),
  driver_last_name: z.string().min(2, "Nom requis"),
  driver_birth_date: z.string().optional().nullable(),
  driver_nationality: z.string().optional().nullable(),
  driver_license_number: z.string().min(5, "N° permis requis"),
  driver_license_date: z.string().min(1, "Date de délivrance du permis requise"),
  driver_phone: z.string().min(10, "Télephone requis"),
  driver_email: z.string().email("Email invalide"),
  driver_cin_number: z.string().min(5, "CIN requis"),
  cin_issue_date: z.string().optional().nullable(),
  passport_number: z.string().optional().nullable(),
  passport_issue_date: z.string().optional().nullable(),
  driver_address: z.string().min(5, "Adresse de résidence requise"),
  
  // Corporate Fields (Conditional)
  company_name: z.string().optional().nullable(),
  company_ice: z.string().optional().nullable(),
  
  // Second Driver (Optional)
  has_second_driver: z.boolean().default(false),
  second_driver_first_name: z.string().optional().nullable(),
  second_driver_last_name: z.string().optional().nullable(),
  second_driver_birth_date: z.string().optional().nullable(),
  second_driver_nationality: z.string().optional().nullable(),
  second_driver_license_number: z.string().optional().nullable(),
  second_driver_license_date: z.string().optional().nullable(),
  second_driver_cin_number: z.string().optional().nullable(),
  second_driver_cin_issue_date: z.string().optional().nullable(),
  second_driver_passport_number: z.string().optional().nullable(),
  second_driver_passport_issue_date: z.string().optional().nullable(),
  second_driver_address: z.string().optional().nullable(),
  second_driver_phone: z.string().optional().nullable(),
  second_driver_email: z.string().email("Email invalide").optional().or(z.literal("")).nullable(),
  
  // Rental Info
  start_date: z.string().min(1, "Date de début requise"),
  end_date: z.string().min(1, "Date de fin requise"),
  pickup_location: z.string().min(2, "Lieu de départ requis"),
  return_location: z.string().min(2, "Lieu de retour requis"),
  
  // Vehicle specific during rental
  initial_mileage: z.coerce.number().min(0, "Kilométrage requis"),
  fuel_level: z.string().min(1, "Niveau de carburant requis"),
  included_accessories: z.array(z.string()).default(["ROUE_SECOURS", "POSTE_RADIO", "SIEGE_ENFANT", "PORTE_BAGAGE", "CRIQ", "VOITRE_PROPRE"]),

  // Financials
  deposit_amount: z.coerce.number().min(0, "Caution requise"),
  daily_price_override: z.coerce.number().optional(),
  insurance_deductible: z.coerce.number().min(0, "Franchise d'assurance requise").default(5000),
  payment_method: z.enum(["CASH", "CARD", "TRANSFER", "CHEQUE"]).default("CASH"),
  payment_terms: z.enum(["COMPTANT", "ECHEANCIER"]).default("COMPTANT"),
  is_paid: z.boolean().default(false),
});

export type ContractFormValues = z.infer<typeof contractSchema>;

interface Car {
  id: string;
  brand: string;
  model: string;
  color?: string;
  price_per_day: number;
  image?: string;
  images?: string[];
}

interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  location: string;
  return_location?: string;
  carId: string;
  car: Car;
  status: string;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  license_number: string;
  cin_number: string;
  birth_date?: string;
  nationality?: string;
  address?: string;
}

interface UseContractFormProps {
  initialData?: any;
  onSuccess: () => void;
  prefillFromBookingId?: string | null;
}

export function useContractForm({ initialData, onSuccess, prefillFromBookingId }: UseContractFormProps) {
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema) as any,
    defaultValues: initialData || {
      car_id: "",
      driver_first_name: "",
      driver_last_name: "",
      driver_birth_date: "",
      driver_nationality: "Marocaine",
      driver_license_number: "",
      driver_license_date: "",
      driver_phone: "",
      driver_email: "",
      driver_cin_number: "",
      cin_issue_date: "",
      passport_number: "",
      passport_issue_date: "",
      driver_address: "",
      start_date: "",
      end_date: "",
      contract_type: "STANDARD",
      pickup_location: "Agence Casablanca",
      return_location: "Agence Casablanca",
      initial_mileage: 0,
      fuel_level: "FULL",
      included_accessories: ["ROUE_SECOURS", "POSTE_RADIO", "SIEGE_ENFANT", "PORTE_BAGAGE", "CRIQ", "VOITRE_PROPRE"],
      deposit_amount: 5000,
      insurance_deductible: 5000,
      payment_method: "CASH",
      payment_terms: "COMPTANT",
      has_second_driver: false,
      is_paid: false,
    },
  });

  const { setValue, watch } = form;
  const selectedCarId = watch("car_id");
  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const dailyPriceOverride = watch("daily_price_override");

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const [carsRes, bookingsRes, customersRes] = await Promise.all([
        fetch("/api/admin/voitures"),
        fetch(`${API_BASE_URL}/bookings`),
        fetch(`${API_BASE_URL}/customers`)
      ]);

      const [carsData, bookingsData, customersData] = await Promise.all([
        carsRes.json(),
        bookingsRes.json(),
        customersRes.json()
      ]);

      setCars(Array.isArray(carsData) ? carsData : carsData.data || []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : bookingsData.data || []);
      setCustomers(customersData.data || []);
    } catch (error) {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBookingSelect = useCallback((bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setValue("car_id", booking.carId);
    setValue("driver_first_name", booking.firstName);
    setValue("driver_last_name", booking.lastName);
    setValue("driver_email", booking.email);
    setValue("driver_phone", booking.phone);
    setValue("start_date", new Date(booking.startDate).toISOString().slice(0, 16));
    setValue("end_date", new Date(booking.endDate).toISOString().slice(0, 16));
    setValue("pickup_location", booking.location);
    setValue("return_location", booking.return_location || booking.location);
    setValue("booking_id", booking.id);
    
    // Valeurs par défaut pour les nouveaux champs lors d'une réservation
    setValue("initial_mileage", 0);
    setValue("fuel_level", "FULL");
    setValue("insurance_deductible", 5000);
    
    toast.success("Données pré-remplies depuis la réservation");
  }, [bookings, setValue]);

  const handleCustomerSelect = useCallback((customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    setValue("customer_id", customer.id);
    setValue("driver_first_name", customer.first_name);
    setValue("driver_last_name", customer.last_name);
    setValue("driver_email", customer.email);
    setValue("driver_phone", customer.phone);
    setValue("driver_license_number", customer.license_number || "");
    setValue("driver_cin_number", customer.cin_number || "");
    
    // Fill all available customer fields
    if (customer.birth_date) setValue("driver_birth_date", customer.birth_date);
    if (customer.nationality) setValue("driver_nationality", customer.nationality);
    if (customer.address) setValue("driver_address", customer.address);
    if ((customer as any).license_issue_date) setValue("driver_license_date", (customer as any).license_issue_date);
    if ((customer as any).cin_issue_date) setValue("cin_issue_date", (customer as any).cin_issue_date);
    if ((customer as any).passport_number) setValue("passport_number", (customer as any).passport_number);
    if ((customer as any).passport_issue_date) setValue("passport_issue_date", (customer as any).passport_issue_date);
    
    toast.success("Client sélectionné - Informations pré-remplies");
  }, [customers, setValue]);

  useEffect(() => {
    if (prefillFromBookingId && bookings.length > 0) {
      handleBookingSelect(prefillFromBookingId);
    }
  }, [prefillFromBookingId, bookings, handleBookingSelect]);

  const calculateTotalPrice = useCallback(() => {
    if (!selectedCarId || !startDate || !endDate) return 0;
    const car = cars.find(c => c.id === selectedCarId);
    if (!car) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    
    const pricePerDay = dailyPriceOverride || car.price_per_day;
    return diffDays * pricePerDay;
  }, [selectedCarId, startDate, endDate, dailyPriceOverride, cars]);

  const onSubmit = async (values: ContractFormValues) => {
    setLoading(true);
    try {
      // Nettoyage des données pour l'API
      const payload = {
        ...values,
        // Conversion explicite pour éviter les erreurs de type sur l'API
        deposit_amount: Number(values.deposit_amount),
        insurance_deductible: Number(values.insurance_deductible),
        initial_mileage: Number(values.initial_mileage),
        daily_price_override: values.daily_price_override ? Number(values.daily_price_override) : null,
        // S'assurer que les chaînes vides sont transmises comme null pour les champs optionnels
        company_name: values.company_name || null,
        company_ice: values.company_ice || null,
        second_driver_first_name: values.second_driver_first_name || null,
        second_driver_last_name: values.second_driver_last_name || null,
        second_driver_license_number: values.second_driver_license_number || null,
        second_driver_phone: values.second_driver_phone || null,
        second_driver_email: values.second_driver_email || null,
      };

      const url = initialData 
        ? `/api/admin/contracts/${initialData.id}` 
        : "/api/admin/contracts";
        
      const response = await fetch(url, {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const successMessage = initialData 
          ? "Contrat mis à jour" 
          : (data.message || "Contrat créé avec succès");
          
        toast.success(successMessage);
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.message || "Une erreur est survenue lors de l'enregistrement");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const onFormError = useCallback((errors: any) => {
    console.error("Form Validation Errors:", errors);
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      toast.error(`Erreur: ${firstError.message}`);
    } else {
      toast.error("Veuillez vérifier tous les champs du formulaire.");
    }
  }, []);

  return {
    form,
    loading,
    isFetching,
    cars,
    bookings,
    customers,
    handleBookingSelect,
    handleCustomerSelect,
    calculateTotalPrice,
    onSubmit: form.handleSubmit(onSubmit, onFormError),
  };
}
