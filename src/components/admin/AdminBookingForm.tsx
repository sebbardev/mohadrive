"use client";

import { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock,
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Car as CarIcon, 
  CreditCard,
  AlertTriangle,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { getAllCars, Car } from '@/services/carService';
import { createBooking } from '@/services/bookingService';
import SuccessMessage from './SuccessMessage';
import FormContainer from './FormContainer';
import { AdminForm, AdminFormField, AdminTextInput, AdminSelectInput, AdminNumberInput, AdminDateInput, AdminTextareaInput, AdminFormActions, AdminFormSection, AdminFormSectionWithIcon } from './forms';
import { useFormContext } from './forms/FormContext';

interface AdminBookingFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminBookingForm({ onClose, onSuccess }: AdminBookingFormProps) {
  const [mounted, setMounted] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    car_id: "",
    start_date: "2026-02-04",
    start_time: "09:00",
    end_date: "2026-12-04",
    end_time: "18:00",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "Agence",
    return_location: "Agence",
    daily_price: 250,
    status: "CONFIRMED"
  });

  const [days, setDays] = useState(304);
  const [totalPrice, setTotalPrice] = useState(76000);

  const selectedCar = cars.find((c) => c.id === formData.car_id);
  const carDisplayName = selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : "";

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const allCars = await getAllCars();
        setCars(allCars);
        if (allCars.length > 0) {
          setFormData(prev => ({ ...prev, car_id: allCars[0].id }));
        }
      } catch (err) {
        console.error("Erreur lors du chargement des voitures:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    if (formData.start_date && formData.end_date && formData.start_time && formData.end_time) {
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
      const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);
      
      if (!isNaN(startDateTime.getTime()) && !isNaN(endDateTime.getTime())) {
        const diffTime = Math.abs(endDateTime.getTime() - startDateTime.getTime());
        const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDays(calculatedDays > 0 ? calculatedDays : 1);
        setTotalPrice((calculatedDays > 0 ? calculatedDays : 1) * formData.daily_price);
      }
    }
  }, [formData.start_date, formData.end_date, formData.start_time, formData.end_time, formData.daily_price]);

  const handleSubmit = async (data: Record<string, any>) => {
    setSubmitting(true);
    setError(null);

    try {
      const startDateTime = `${formData.start_date} ${formData.start_time}:00`;
      const endDateTime = `${formData.end_date} ${formData.end_time}:00`;

      await createBooking({
        ...formData,
        start_date: startDateTime,
        end_date: endDateTime,
        total_price: totalPrice
      });
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la création de la réservation.");
      setShowConfirmation(false);
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <FormContainer
      title="Nouvelle Réservation"
      subtitle={carDisplayName ? `Réservation • ${carDisplayName}` : "Remplissez le formulaire pour créer cette réservation"}
      onClose={onClose}
      variant="modal"
      size="lg"
    >
      {submitted ? (
        <div className="p-8 sm:p-10 lg:p-12">
          <SuccessMessage
            title="Réservation"
            highlightedText="Créée avec succès !"
            message="La réservation a été enregistrée avec succès. Elle est maintenant visible dans le planning."
            autoCloseDelay={3000}
            onClose={onClose}
          />
        </div>
      ) : (
        <AdminForm onSubmit={handleSubmit}>
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-600">
                  <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-bold uppercase tracking-wider leading-relaxed">{error}</p>
                </div>
              )}

              <AdminFormSection title="Informations de la réservation" icon={<Calendar size={20} className="text-[var(--color-primary)]" />}> 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AdminSelectInput
                    name="car_id"
                    label="Véhicule"
                    required
                    defaultValue={formData.car_id}
                    options={cars.map(car => ({ value: car.id, label: `${car.brand} ${car.model} (${car.plateNumber || 'Sans matricule'})` }))}
                  />

                  <AdminNumberInput
                    name="daily_price"
                    label="Tarif Journalier (MAD)"
                    required
                    placeholder="ex: 250"
                    defaultValue={formData.daily_price}
                  />

                  <AdminDateInput
                    name="start_date"
                    label="Date de début"
                    required
                    defaultValue={formData.start_date}
                  />

                  <AdminTextInput
                    name="start_time"
                    label="Heure de départ"
                    required
                    defaultValue={formData.start_time}
                    placeholder="ex: 14:00"
                  />

                  <AdminDateInput
                    name="end_date"
                    label="Date de fin"
                    required
                    defaultValue={formData.end_date}
                  />

                  <AdminTextInput
                    name="end_time"
                    label="Heure de retour"
                    required
                    defaultValue={formData.end_time}
                    placeholder="ex: 14:00"
                  />
                </div>
              </AdminFormSection>

              <AdminFormSection title="Informations du client" icon={<User size={20} className="text-[var(--color-primary)]" />}> 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AdminTextInput
                    name="first_name"
                    label="Prénom"
                    required
                    placeholder="Ex: Ahmed"
                    defaultValue={formData.first_name}
                  />

                  <AdminTextInput
                    name="last_name"
                    label="Nom"
                    required
                    placeholder="Ex: Alami"
                    defaultValue={formData.last_name}
                  />

                  <AdminTextInput
                    name="email"
                    label="Email"
                    required
                    type="email"
                    placeholder="Ex: ahmed@email.com"
                    defaultValue={formData.email}
                  />

                  <AdminTextInput
                    name="phone"
                    label="Téléphone"
                    required
                    placeholder="Ex: +212 600000000"
                    defaultValue={formData.phone}
                  />
                </div>
              </AdminFormSection>

              <AdminFormSection title="Résumé et validation" icon={<CheckCircle size={20} className="text-[var(--color-highlight)]" />}> 
                <div className="admin-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="admin-label">Durée totale</span>
                    </div>
                    <span className="text-sm font-black text-[var(--color-text)]">{days} Jours</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-gray-400" />
                      <span className="admin-label">Tarif appliqué</span>
                    </div>
                    <span className="text-sm font-black text-[var(--color-text)]">{formData.daily_price} MAD/Jour</span>
                  </div>
                  <div className="h-px bg-gray-200 mb-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-[var(--color-highlight)]" />
                      <span className="admin-section-title">Montant Total</span>
                    </div>
                    <span className="text-2xl font-black text-[var(--color-highlight)]">
                      {totalPrice.toLocaleString()} <span className="text-xs not-italic text-gray-400">MAD</span>
                    </span>
                  </div>
                </div>

                {showConfirmation ? (
                  <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="p-4 bg-[var(--color-highlight)]/10 border border-[var(--color-highlight)]/20 rounded-2xl flex items-center gap-3 text-[var(--color-accent)]">
                      <AlertTriangle size={20} />
                      <p className="text-[10px] font-black uppercase tracking-wider">
                        Confirmer la réservation de {days} jours pour un total de {totalPrice.toLocaleString()} MAD ?
                      </p>
                    </div>
                    <AdminFormActions
                      submitLabel="✓ Confirmer la réservation"
                      cancelLabel="Annuler"
                      onCancel={() => setShowConfirmation(false)}
                      loading={submitting}
                      variant="compact"
                      showSubmitIcon={false}
                    />
                  </div>
                ) : (
                  <AdminFormActions
                    submitLabel="Vérifier la réservation →"
                    onCancel={onClose}
                    showCancelButton={false}
                    variant="default"
                  />
                )}
              </AdminFormSection>
            </>
          )}
        </AdminForm>
      )}
    </FormContainer>
  );

  return mounted ? modalContent : null;
}