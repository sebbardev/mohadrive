"use client";

import { useState } from "react";
import Image from "next/image";
import { Car } from "@/services/carService";
import { CheckCircle, Loader2, X } from "lucide-react";
import { createBooking } from "@/actions/bookings";
import Button from "@/components/ui/Button";
import { sendBookingNotification } from "@/services/emailService";

interface SidebarBookingFormProps {
  car: Car;
  onClose?: () => void;
}

export default function SidebarBookingForm({ car, onClose }: SidebarBookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    car_id: car.id,
    start_date: "",
    start_time: "09:00",
    end_date: "",
    end_time: "18:00",
    location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Combine date and time into datetime format for API
    const payload = {
      ...formData,
      start_date: `${formData.start_date} ${formData.start_time}:00`,
      end_date: `${formData.end_date} ${formData.end_time}:00`,
      car_brand: car.brand,
      car_model: car.model,
      total_price: car.pricePerDay * (formData.start_date && formData.end_date ? Math.round((new Date(formData.end_date + 'T00:00:00').getTime() - new Date(formData.start_date + 'T00:00:00').getTime()) / (1000 * 60 * 60 * 24)) || 1 : 1),
    };

    console.log("Sending booking data:", payload);

    const result = await createBooking(payload);

    if (result.success) {
      setSubmitted(true);
      
      // Envoyer notification à l'admin
      await sendBookingNotification({
        firstName: formData.first_name,
        lastName: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        carBrand: car.brand,
        carModel: car.model,
        carImage: car.image,
        startDate: formData.start_date,
        endDate: formData.end_date,
        location: formData.location,
        totalPrice: payload.total_price,
      });
    } else {
      setError(result.error || "Une erreur est survenue");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="mb-8 p-6 bg-[var(--color-bg)] rounded-[2rem] text-[var(--color-accent)]">
          <CheckCircle className="h-20 w-20 mx-auto" />
        </div>
        <h3 className="text-3xl font-black text-[var(--color-primary)] mb-4 uppercase">
          Merci Pour Votre <span className="text-[var(--color-secondary)]">Réservation !</span>
        </h3>
        <p className="text-[var(--color-text-muted)] font-light text-lg mb-8">
          Votre demande pour la <span className="text-[var(--color-primary)] font-bold">{car.brand} {car.model}</span> a été reçue. Notre équipe vous contactera sous peu.
        </p>
        <Button
          onClick={onClose}
          variant="secondary"
          size="lg"
          fullWidth
        >
          Fermer la fenêtre
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 bg-[var(--color-bg)] rounded-xl text-gray-400 hover:text-[var(--color-primary)] transition-all z-10"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>
      )}

      {submitted ? (
        <div className="text-center py-12">
          <div className="mb-8 p-6 bg-[var(--color-bg)] rounded-[2rem] text-[var(--color-accent)]">
            <CheckCircle className="h-20 w-20 mx-auto" />
          </div>
          <h3 className="text-3xl font-black text-[var(--color-primary)] mb-4 uppercase">
            Merci Pour Votre <span className="text-[var(--color-secondary)]">Réservation !</span>
          </h3>
          <p className="text-[var(--color-text-muted)] font-light text-lg mb-8">
            Votre demande pour la <span className="text-[var(--color-primary)] font-bold">{car.brand} {car.model}</span> a été reçue. Notre équipe vous contactera sous peu.
          </p>
          <Button
            onClick={onClose}
            variant="secondary"
            size="lg"
            fullWidth
          >
            Fermer la fenêtre
          </Button>
        </div>
      ) : (
        <>
          {/* Car Image */}
          <div className="relative h-40 sm:h-48 w-full rounded-2xl overflow-hidden mb-4 sm:mb-6">
            <Image
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 inline-block">
                <p className="text-xs sm:text-sm font-black text-[var(--color-primary)] uppercase">
                  {car.brand} {car.model}
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-3xl font-black text-[var(--color-primary)] mb-2 uppercase">
            Réserver ce <span className="text-[var(--color-secondary)]">Véhicule</span>
          </h3>
          <p className="text-[var(--color-text-muted)] mb-8 font-light">
            {car.pricePerDay} {car.currency}/jour
          </p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 p-3 sm:p-4 rounded-2xl text-xs font-bold mb-4 sm:mb-6 text-center uppercase tracking-[0.2em] shadow-sm">
              {error}
            </div>
          )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Informations personnelles</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Prénom</label>
              <input
                type="text"
                name="first_name"
                required
                placeholder="John"
                className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm placeholder:text-gray-400"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Nom</label>
              <input
                type="text"
                name="last_name"
                required
                placeholder="Doe"
                className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm placeholder:text-gray-400"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm placeholder:text-gray-400"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Téléphone</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+212 6..."
                className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm placeholder:text-gray-400"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Dates & Times */}
        <div className="p-5 bg-[var(--color-bg)] rounded-xl space-y-4">
          <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Dates de location</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Date de début</label>
              <input
                type="date"
                name="start_date"
                required
                className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Heure de début</label>
              <input
                type="time"
                name="start_time"
                required
                defaultValue="09:00"
                className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Date de fin</label>
              <input
                type="date"
                name="end_date"
                required
                className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Heure de fin</label>
              <input
                type="time"
                name="end_time"
                required
                defaultValue="18:00"
                className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Lieu de prise en charge</label>
          <input
            type="text"
            name="location"
            required
            placeholder="Ex: Aéroport Casablanca, Agence Centre-ville..."
            className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm placeholder:text-gray-400"
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="secondary"
          size="lg"
          fullWidth
          isLoading={loading}
          icon={<CheckCircle size={18} />}
          iconPosition="left"
        >
          Confirmer la réservation
        </Button>
      </form>
        </>
      )}
    </div>
  );
}
