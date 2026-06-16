"use client";

import { useState, useEffect } from "react";
import { Calendar, Send, X, User, ArrowRight, ArrowLeft, MapPin, Clock } from "lucide-react";
import { createBooking } from "@/services/bookingService";
import { toast } from "react-hot-toast";
import { Car } from "@/services/carService";
import { createPortal } from "react-dom";
import SuccessMessage from "@/components/admin/SuccessMessage";
import Button from "@/components/ui/Button";
import { sendBookingNotification } from "@/services/emailService";

interface BookingFormModalProps {
  car: Car;
}

export default function BookingFormModal({ car }: BookingFormModalProps) {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [bookingFormData, setBookingFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    returnLocation: "",
  });

  const [mounted, setMounted] = useState(false);

  // Block body scroll and disable navbar when modal is open
  useEffect(() => {
    if (showBookingForm) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Disable navbar interactions
      const navbar = document.querySelector('nav');
      if (navbar) {
        (navbar as HTMLElement).style.pointerEvents = 'none';
        (navbar as HTMLElement).style.opacity = '0';
        (navbar as HTMLElement).style.transition = 'opacity 0.3s ease';
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
      
      // Restore navbar interactions
      const navbar = document.querySelector('nav');
      if (navbar) {
        (navbar as HTMLElement).style.pointerEvents = 'auto';
        (navbar as HTMLElement).style.opacity = '1';
      }
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      const navbar = document.querySelector('nav');
      if (navbar) {
        (navbar as HTMLElement).style.pointerEvents = 'auto';
        (navbar as HTMLElement).style.opacity = '1';
      }
    };
  }, [showBookingForm]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const calculateTotalPrice = () => {
    if (!bookingFormData.startDate || !bookingFormData.endDate) return 0;
    const start = new Date(bookingFormData.startDate + 'T00:00:00');
    const end = new Date(bookingFormData.endDate + 'T00:00:00');
    const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * car.pricePerDay : 0;
  };

  const calculateDays = () => {
    if (!bookingFormData.startDate || !bookingFormData.endDate) return 0;
    const start = new Date(bookingFormData.startDate + 'T00:00:00');
    const end = new Date(bookingFormData.endDate + 'T00:00:00');
    const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitting(true);

    try {
      const totalPrice = calculateTotalPrice();
      // Combine date and time into datetime format
      const startDateTime = `${bookingFormData.startDate} ${bookingFormData.startTime}:00`;
      const endDateTime = `${bookingFormData.endDate} ${bookingFormData.endTime}:00`;
      
      const bookingData = {
        car_id: car.id,
        first_name: bookingFormData.firstName,
        last_name: bookingFormData.lastName,
        email: bookingFormData.email,
        phone: bookingFormData.phone,
        start_date: startDateTime,
        end_date: endDateTime,
        location: bookingFormData.location,
        return_location: bookingFormData.returnLocation,
        daily_price: car.pricePerDay,
        total_price: totalPrice,
        status: "PENDING",
      };

      const result = await createBooking(bookingData);

      if (result) {
        setBookingSubmitted(true);
        toast.success("Réservation créée avec succès !");
        
        // Envoyer notification à l'admin
        await sendBookingNotification({
          firstName: bookingFormData.firstName,
          lastName: bookingFormData.lastName,
          email: bookingFormData.email,
          phone: bookingFormData.phone,
          carBrand: car.brand,
          carModel: car.model,
          carImage: car.image,
          startDate: bookingFormData.startDate,
          endDate: bookingFormData.endDate,
          location: bookingFormData.location,
          totalPrice: totalPrice,
        });
        
        setBookingFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
          location: "",
          returnLocation: "",
        });
        setTimeout(() => {
          setBookingSubmitted(false);
          setShowBookingForm(false);
          setStep(1);
        }, 4000);
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la réservation");
    }
    
    setBookingSubmitting(false);
  };

  const closeModal = () => {
    setShowBookingForm(false);
    setBookingSubmitted(false);
    setStep(1);
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const inputClass = "w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm";
  const labelClass = "block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2";

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-fade-in"
      onClick={closeModal}
    >
      <div
        id="booking-form-section"
        className="bg-white rounded-[2.5rem] p-12 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[100px] opacity-10" />

        {bookingSubmitted ? (
          <SuccessMessage
            title="Réservation"
            highlightedText="Confirmée !"
            message="Votre réservation a été créée avec succès. Vous recevrez un email de confirmation shortly."
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="flex-1">
                <h3 className="text-3xl font-black text-[var(--color-primary)] mb-1 uppercase">
                  Réserver <span className="text-[var(--color-secondary)]">{car.brand} {car.model}</span>
                </h3>
                <p className="text-[var(--color-text-muted)] font-light text-sm">
                  {step === 1 ? "Vos informations personnelles" : "Dates, lieux et confirmation"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-3 bg-[var(--color-bg)] rounded-xl text-gray-400 hover:text-[var(--color-primary)] transition-all ml-4 flex-shrink-0"
              >
                <X size={22} />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-8 relative z-10">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                    step === s
                      ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30 scale-110'
                      : step > s
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s ? '✓' : s}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest block ${
                    step === s ? 'text-[var(--color-primary)]' : 'text-gray-400'
                  }`}>
                    {s === 1 ? 'Informations' : 'Réservation'}
                  </span>
                  {s < 2 && (
                    <div className={`h-px w-16 transition-all duration-300 ${step > s ? 'bg-[var(--color-accent)]' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* STEP 1 — Informations personnelles */}
            {step === 1 && (
              <form onSubmit={handleStep1Next} className="space-y-5 relative z-10">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="p-2.5 bg-[var(--color-primary)]/10 rounded-xl">
                    <User size={16} className="text-[var(--color-primary)]" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">Vos coordonnées</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Prénom *</label>
                    <input
                      type="text"
                      required
                      value={bookingFormData.firstName}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className={inputClass}
                      placeholder="Mohammed"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Nom *</label>
                    <input
                      type="text"
                      required
                      value={bookingFormData.lastName}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className={inputClass}
                      placeholder="Alaoui"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    type="email"
                    required
                    value={bookingFormData.email}
                    onChange={(e) => setBookingFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={inputClass}
                    placeholder="exemple@email.com"
                  />
                </div>

                <div>
                  <label className={labelClass}>Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={bookingFormData.phone}
                    onChange={(e) => setBookingFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={inputClass}
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-black uppercase tracking-widest text-sm py-4 rounded-2xl hover:shadow-xl hover:shadow-[var(--color-primary)]/30 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Étape suivante
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2 — Dates, lieux & confirmation */}
            {step === 2 && (
              <form onSubmit={handleBookingSubmit} className="space-y-5 relative z-10">
                {/* Dates */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="p-2.5 bg-[var(--color-primary)]/10 rounded-xl">
                    <Calendar size={16} className="text-[var(--color-primary)]" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">Période de location</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Date de début *</label>
                    <input
                      type="date"
                      required
                      value={bookingFormData.startDate}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Heure de départ *</label>
                    <input
                      type="time"
                      required
                      value={bookingFormData.startTime}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, startTime: e.target.value, endTime: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Date de fin *</label>
                    <input
                      type="date"
                      required
                      value={bookingFormData.endDate}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      min={bookingFormData.startDate || new Date().toISOString().split('T')[0]}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Heure de retour *</label>
                    <input
                      type="time"
                      required
                      value={bookingFormData.endTime}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Locations */}
                <div className="flex items-center gap-3 pt-2 mb-4 pb-4 border-b border-gray-100">
                  <div className="p-2.5 bg-[var(--color-primary)]/10 rounded-xl">
                    <MapPin size={16} className="text-[var(--color-primary)]" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">Lieux</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Lieu de prise en charge *</label>
                    <input
                      type="text"
                      required
                      value={bookingFormData.location}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, location: e.target.value }))}
                      className={inputClass}
                      placeholder="Casablanca, Agadir…"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Lieu de retour *</label>
                    <input
                      type="text"
                      required
                      value={bookingFormData.returnLocation}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, returnLocation: e.target.value }))}
                      className={inputClass}
                      placeholder="Même lieu ou autre"
                    />
                  </div>
                </div>

                {/* Price Summary */}
                {calculateDays() > 0 && (
                  <div className="bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 border-2 border-[var(--color-primary)]/20 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Durée</span>
                      <span className="text-base font-black text-[var(--color-primary)]">{calculateDays()} jour{calculateDays() > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Tarif journalier</span>
                      <span className="text-base font-black text-[var(--color-primary)]">{car.pricePerDay} {car.currency}</span>
                    </div>
                    <div className="border-t border-[var(--color-primary)]/20 pt-3 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">Total</span>
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">{calculateTotalPrice()} {car.currency}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-[var(--color-bg)] text-[var(--color-primary)] font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-100 transition-all duration-300 flex-shrink-0"
                  >
                    <ArrowLeft size={16} />
                    Retour
                  </button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={bookingSubmitting}
                    icon={<Send size={16} />}
                    iconPosition="left"
                  >
                    Confirmer la Réservation
                  </Button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Reservation Button */}
      <Button
        onClick={() => setShowBookingForm(true)}
        variant="primary"
        size="lg"
        fullWidth
        icon={<Calendar size={18} />}
        iconPosition="left"
        className="shadow-2xl shadow-[var(--color-accent)]/30 hover:shadow-[var(--color-highlight)]/40 hover:-translate-y-1 mb-6"
      >
        Réserver Maintenant
      </Button>

      {/* Render modal via Portal to ensure it's centered in viewport */}
      {showBookingForm && mounted && createPortal(modalContent, document.body)}
    </>
  );
}
