"use client";

export const dynamic = 'force-dynamic';

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getAllCars, Car } from "@/services/carService";
import { CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";

function BookingFormContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    carId: carId || "",
    startDate: "",
    startTime: "09:00",
    endDate: "",
    endTime: "18:00",
    city: "",
    message: "",
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getAllCars();
        setCars(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des voitures:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate email sending
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-16 bg-[#1e293b] rounded-3xl shadow-2xl p-8 border border-gray-700">
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-[var(--color-primary)] h-20 w-20" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Demande envoyée avec succès !</h2>
        <p className="text-gray-300 mb-8 text-lg">
          Merci {formData.firstName}. Nous avons bien reçu votre demande de réservation.
          Notre équipe vous contactera dans les plus brefs délais pour confirmer la disponibilité.
        </p>
        <Button
          onClick={() => window.location.href = "/"}
          variant="secondary"
          size="lg"
        >
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1e293b] rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-700">
      <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-wider border-b border-gray-700 pb-4">Formulaire de <span className="text-[var(--color-primary)]">Réservation</span></h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Prénom</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all placeholder-gray-500"
            placeholder="Votre prénom"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Nom</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all placeholder-gray-500"
            placeholder="Votre nom"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all placeholder-gray-500"
            placeholder="votre@email.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Téléphone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all placeholder-gray-500"
            placeholder="+212 6..."
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="carId" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Véhicule souhaité</label>
        <div className="relative">
          <select
            id="carId"
            name="carId"
            required
            value={formData.carId}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#0f172a]">{loading ? "Chargement..." : "Sélectionnez une voiture"}</option>
            {!loading && cars.map((car) => (
              <option key={car.id} value={car.id} className="bg-[#0f172a]">
                {car.name} - {car.pricePerDay} {car.currency}/jour
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Date de début</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            required
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all placeholder-gray-500 [color-scheme:dark]"
          />
        </div>
        <div>
          <label htmlFor="startTime" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Heure de départ</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            required
            value={formData.startTime}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all placeholder-gray-500 [color-scheme:dark]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="endDate" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Date de fin</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            required
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all placeholder-gray-500 [color-scheme:dark]"
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Heure de retour</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            required
            value={formData.endTime}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all placeholder-gray-500 [color-scheme:dark]"
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="city" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Ville de prise en charge</label>
        <input
          type="text"
          id="city"
          name="city"
          required
          placeholder="Ex: Casablanca, Aéroport Mohammed V..."
          value={formData.city}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all placeholder-gray-500"
        />
      </div>

      <div className="mb-8">
        <label htmlFor="message" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Message (optionnel)</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all placeholder-gray-500"
          placeholder="Informations complémentaires..."
        ></textarea>
      </div>

      <Button
        type="submit"
        variant="secondary"
        size="lg"
        fullWidth
      >
        Envoyer la demande
      </Button>
    </form>
  );
}

export default function BookingPage() {
  return (
    <div className="bg-[var(--color-dark)] min-h-screen py-12 pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">Réservez votre <span className="text-[var(--color-primary)]">Voiture</span></h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Remplissez le formulaire ci-dessous et nous vous contacterons rapidement pour confirmer votre réservation.
          </p>
        </div>
        <Suspense fallback={<div className="text-white text-center">Chargement...</div>}>
          <BookingFormContent />
        </Suspense>
      </div>
    </div>
  );
}
