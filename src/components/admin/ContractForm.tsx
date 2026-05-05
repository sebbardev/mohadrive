"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Car as CarIcon, 
  Calendar, 
  CreditCard, 
  Check, 
  Loader2, 
  AlertCircle,
  FileText,
  Building2,
  Gauge,
  Fuel,
  ShieldCheck,
  Package,
  MapPin,
  Phone,
  Mail,
  Home,
  Hash
} from "lucide-react";
import { useContractForm } from "@/hooks/admin/useContractForm";
import { 
  FormField, 
  AdaptiveInput, 
  AdaptiveSelect 
} from "./contracts/AdaptiveFormFields";
import CarSelector from "./contracts/CarSelector";
import SuccessMessage from "./SuccessMessage";
import BaseForm from "./BaseForm";
import FormActions from "./FormActions";

interface ContractFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
  prefillFromBookingId?: string | null;
}

export default function ContractForm({ initialData, onSuccess, onCancel, prefillFromBookingId }: ContractFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [customerMode, setCustomerMode] = useState<'new' | 'existing'>('new');
  const [saveCustomer, setSaveCustomer] = useState(true);
  const totalSteps = 3;
  const {
    form,
    loading,
    isFetching,
    cars,
    customers,
    handleBookingSelect,
    handleCustomerSelect,
    calculateTotalPrice,
    onSubmit,
  } = useContractForm({ 
    initialData, 
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
      }, 3000);
    }, 
    prefillFromBookingId 
  });

  const { register, watch, formState: { errors }, setValue } = form;

  const contractType = watch("contract_type");
  const hasSecondDriver = watch("has_second_driver");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      nextStep();
    } else {
      onSubmit(e);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Synchronisation des ressources...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {submitted ? (
        <SuccessMessage
          title="Contrat"
          highlightedText={initialData ? "Mis à jour !" : "Créé avec succès !"}
          message={initialData 
            ? "Le contrat a été modifié avec succès."
            : "Le contrat a été créé avec succès. Vous pouvez maintenant le consulter et le gérer."
          }
        />
      ) : (
        <BaseForm
          title=""
          subtitle=""
          onSubmit={handleSubmit}
          showHeader={false}
        >
          {/* Progress Bar */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-black text-sm transition-all ${
                    step < currentStep 
                      ? "bg-[var(--color-secondary)] text-white" 
                      : step === currentStep 
                      ? "admin-btn-active scale-110" 
                      : "bg-gray-200 text-gray-400"
                  }`}>
                    {step < currentStep ? <Check size={18} /> : step}
                  </div>
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                    step < currentStep ? "bg-[var(--color-secondary)]" : "bg-gray-200"
                  }`} style={{ display: step === 3 ? 'none' : 'block' }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
              <span className={currentStep === 1 ? "text-[var(--color-primary)]" : ""}>Véhicule</span>
              <span className={currentStep === 2 ? "text-[var(--color-primary)]" : ""}>Conducteur</span>
              <span className={currentStep === 3 ? "text-[var(--color-primary)]" : ""}>Paiement</span>
            </div>
          </div>
          {/* STEP 1: VEHICLE & RENTAL */}
          {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="mb-8">
              <h3 className="text-2xl font-black text-[var(--color-primary)] uppercase tracking-tight flex items-center gap-3">
                <div className="h-8 w-1.5 bg-[var(--color-primary)] rounded-full" />
                Véhicule & Location
              </h3>
              <p className="text-[var(--color-text-muted)] font-light mt-2 ml-5">Sélection du véhicule et détails de la location</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormField label="Véhicule" error={errors.car_id} required name="car_id">
                  <CarSelector 
                    cars={cars} 
                    selectedCarId={watch("car_id")} 
                    onSelect={(carId) => setValue("car_id", carId)}
                    error={!!errors.car_id}
                  />
                </FormField>
              </div>

              <FormField label="Kilométrage Départ" error={errors.initial_mileage} required name="initial_mileage">
                <AdaptiveInput 
                  register={register} 
                  name="initial_mileage" 
                  type="number" 
                  icon={<Gauge size={18} />}
                />
              </FormField>

              <FormField label="Niveau Carburant" error={errors.fuel_level} required name="fuel_level">
                <AdaptiveSelect 
                  register={register} 
                  name="fuel_level"
                  icon={<Fuel size={18} />}
                  options={[
                    { value: "RESERVE", label: "Réserve" },
                    { value: "1/4", label: "1/4" },
                    { value: "2/4", label: "1/2 (2/4)" },
                    { value: "3/4", label: "3/4" },
                    { value: "FULL", label: "Plein" },
                  ]}
                />
              </FormField>

              <div className="md:col-span-2 space-y-3 p-6 bg-[var(--color-bg)] rounded-3xl">
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <Package size={14} /> Accessoires Inclus
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "ROUE_SECOURS", label: "Roue secours" },
                    { id: "POSTE_RADIO", label: "Poste Radio" },
                    { id: "SIEGE_ENFANT", label: "Siège Enfant" },
                    { id: "PORTE_BAGAGE", label: "Porte bagage" },
                    { id: "CRIQ", label: "Crique" },
                    { id: "VOITRE_PROPRE", label: "Voiture Propre" },
                  ].map((acc) => (
                    <label key={acc.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-100 cursor-pointer hover:border-[var(--color-secondary)] transition-all">
                      <input 
                        type="checkbox" 
                        value={acc.id}
                        {...register("included_accessories")}
                        className="w-4 h-4 accent-[var(--color-secondary)] rounded"
                      />
                      <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tight">{acc.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <FormField label="Date de Début" error={errors.start_date} required name="start_date">
                <AdaptiveInput register={register} name="start_date" type="datetime-local" icon={<Calendar size={18} />} />
              </FormField>

              <FormField label="Date de Fin" error={errors.end_date} required name="end_date">
                <AdaptiveInput register={register} name="end_date" type="datetime-local" icon={<Calendar size={18} />} />
              </FormField>

              <FormField label="Lieu de Livraison" error={errors.pickup_location} required name="pickup_location">
                <AdaptiveInput register={register} name="pickup_location" placeholder="E.g. Agence, Aéroport..." icon={<MapPin size={18} />} />
              </FormField>

              <FormField label="Lieu de Retour" error={errors.return_location} required name="return_location">
                <AdaptiveInput register={register} name="return_location" placeholder="E.g. Agence, Aéroport..." icon={<MapPin size={18} />} />
              </FormField>
            </div>

            {/* Step Navigation */}
            <FormActions
              submitLabel="Étape Suivante"
              cancelLabel="Annuler"
              onCancel={onCancel}
              onSubmit={nextStep}
              variant="default"
              showSubmitIcon={true}
            />
          </div>
          )}

          {/* STEP 2: DRIVER INFORMATION */}
          {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="mb-8">
              <h3 className="text-2xl font-black text-[var(--color-primary)] uppercase tracking-tight flex items-center gap-3">
                <div className="h-8 w-1.5 bg-[var(--color-secondary)] rounded-full" />
                Conducteur Principal
              </h3>
              <p className="text-[var(--color-text-muted)] font-light mt-2 ml-5">Informations du locataire</p>
            </div>

            {/* Customer Mode Selector */}
            <div className="p-6 bg-gradient-to-r from-[var(--color-bg)] to-white rounded-2xl border border-gray-100">
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Mode de saisie du client</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setCustomerMode('new')}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    customerMode === 'new'
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    customerMode === 'new' ? 'admin-btn-active' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <User size={20} />
                  </div>
                  <div className="text-left">
                    <p className={`text-xs font-black uppercase tracking-wider ${
                      customerMode === 'new' ? 'text-[var(--color-primary)]' : 'text-gray-600'
                    }`}>Nouveau client</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">Saisir manuellement</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCustomerMode('existing')}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    customerMode === 'existing'
                      ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    customerMode === 'existing' ? 'bg-[var(--color-secondary)] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <FileText size={20} />
                  </div>
                  <div className="text-left">
                    <p className={`text-xs font-black uppercase tracking-wider ${
                      customerMode === 'existing' ? 'text-[var(--color-secondary)]' : 'text-gray-600'
                    }`}>Client existant</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">Sélectionner depuis la liste</p>
                  </div>
                </button>
              </div>

              {/* Save Customer Toggle (only for new customer mode) */}
              {customerMode === 'new' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-wider">Ajouter aux clients</p>
                      <p className="text-[9px] font-bold text-gray-400 mt-0.5">Sauvegarder ce client dans la base de données</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSaveCustomer(!saveCustomer)}
                      className={`w-14 h-7 rounded-full transition-all relative ${
                        saveCustomer ? 'bg-[var(--color-secondary)]' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                        saveCustomer ? 'left-8' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Existing Customer Selector */}
            {customerMode === 'existing' && (
              <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                  Sélectionner un client <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => {
                    setSelectedCustomerId(e.target.value);
                    if (e.target.value) {
                      handleCustomerSelect(e.target.value);
                    }
                  }}
                  className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl py-3.5 pl-12 pr-10 text-[var(--color-text)] text-sm font-bold outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all appearance-none"
                >
                  <option value="">-- Choisir un client --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.first_name} {c.last_name} - {c.phone}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Type de Contrat" error={errors.contract_type} required name="contract_type">
                <AdaptiveSelect 
                  register={register} 
                  name="contract_type"
                  icon={<FileText size={18} />}
                  options={[
                    { value: "STANDARD", label: "Standard" },
                    { value: "CORPORATE", label: "Entreprise" },
                    { value: "LONG_TERM", label: "Longue Durée" },
                  ]}
                />
              </FormField>

              {contractType === "CORPORATE" && (
                <>
                  <FormField label="Société" error={errors.company_name} required name="company_name">
                    <AdaptiveInput register={register} name="company_name" placeholder="Nom de l'entreprise" icon={<Building2 size={18} />} />
                  </FormField>
                  <FormField label="ICE" error={errors.company_ice} required name="company_ice">
                    <AdaptiveInput register={register} name="company_ice" placeholder="Identifiant Fiscal" icon={<Hash size={18} />} />
                  </FormField>
                </>
              )}

              <FormField label="Prénom" error={errors.driver_first_name} required name="driver_first_name">
                <AdaptiveInput register={register} name="driver_first_name" icon={<User size={18} />} />
              </FormField>
              <FormField label="Nom" error={errors.driver_last_name} required name="driver_last_name">
                <AdaptiveInput register={register} name="driver_last_name" icon={<User size={18} />} />
              </FormField>
              <FormField label="Né(e) le" error={errors.driver_birth_date} name="driver_birth_date">
                <AdaptiveInput register={register} name="driver_birth_date" type="date" icon={<Calendar size={18} />} />
              </FormField>
              <FormField label="Nationalité" error={errors.driver_nationality} name="driver_nationality">
                <AdaptiveInput register={register} name="driver_nationality" placeholder="E.g. Marocaine" icon={<Home size={18} />} />
              </FormField>
              <FormField label="N° Permis" error={errors.driver_license_number} required name="driver_license_number">
                <AdaptiveInput register={register} name="driver_license_number" icon={<FileText size={18} />} />
              </FormField>
              <FormField label="Permis Délivré le" error={errors.driver_license_date} required name="driver_license_date">
                <AdaptiveInput register={register} name="driver_license_date" type="date" icon={<Calendar size={18} />} />
              </FormField>
              <FormField label="CIN n°" error={errors.driver_cin_number} required name="driver_cin_number">
                <AdaptiveInput register={register} name="driver_cin_number" icon={<Hash size={18} />} />
              </FormField>
              <FormField label="CIN Délivré le" error={errors.cin_issue_date} name="cin_issue_date">
                <AdaptiveInput register={register} name="cin_issue_date" type="date" icon={<Calendar size={18} />} />
              </FormField>
              <FormField label="Passeport n°" error={errors.passport_number} name="passport_number">
                <AdaptiveInput register={register} name="passport_number" icon={<Hash size={18} />} />
              </FormField>
              <FormField label="Passeport Délivré le" error={errors.passport_issue_date} name="passport_issue_date">
                <AdaptiveInput register={register} name="passport_issue_date" type="date" icon={<Calendar size={18} />} />
              </FormField>
              <FormField label="Adresse" error={errors.driver_address} required name="driver_address" className="md:col-span-2">
                <AdaptiveInput register={register} name="driver_address" placeholder="Adresse de résidence complète" icon={<Home size={18} />} />
              </FormField>
              <FormField label="Téléphone" error={errors.driver_phone} required name="driver_phone">
                <AdaptiveInput register={register} name="driver_phone" type="tel" icon={<Phone size={18} />} />
              </FormField>
              <FormField label="Email" error={errors.driver_email} required name="driver_email">
                <AdaptiveInput register={register} name="driver_email" type="email" icon={<Mail size={18} />} />
              </FormField>
            </div>

            {/* Step Navigation */}
            <FormActions
              submitLabel="Étape Suivante"
              cancelLabel="Étape Précédente"
              onCancel={prevStep}
              onSubmit={nextStep}
              variant="default"
              showSubmitIcon={true}
            />
          </div>
          )}

          {/* STEP 3: PAYMENT & FINALIZATION */}
          {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="mb-8">
              <h3 className="text-2xl font-black text-[var(--color-primary)] uppercase tracking-tight flex items-center gap-3">
                <div className="h-8 w-1.5 bg-[var(--color-highlight)] rounded-full" />
                Paiement & Tarif
              </h3>
              <p className="text-[var(--color-text-muted)] font-light mt-2 ml-5">Conditions financières</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <FormField label="Caution" error={errors.deposit_amount} required name="deposit_amount">
                  <AdaptiveInput register={register} name="deposit_amount" type="number" icon={<ShieldCheck size={18} />} />
                </FormField>

                <FormField label="Franchise" error={errors.insurance_deductible} required name="insurance_deductible">
                  <AdaptiveInput register={register} name="insurance_deductible" type="number" icon={<AlertCircle size={18} />} />
                </FormField>

                <FormField label="Mode de Paiement" error={errors.payment_method} required name="payment_method">
                  <AdaptiveSelect 
                    register={register} 
                    name="payment_method"
                    icon={<CreditCard size={18} />}
                    options={[
                      { value: "CASH", label: "Espèces" },
                      { value: "CARD", label: "Carte Bancaire" },
                      { value: "TRANSFER", label: "Virement" },
                      { value: "CHEQUE", label: "Chèque" },
                    ]}
                  />
                </FormField>

                <FormField label="Mode de Règlement" error={errors.payment_terms} required name="payment_terms">
                  <AdaptiveSelect 
                    register={register} 
                    name="payment_terms"
                    icon={<CreditCard size={18} />}
                    options={[
                      { value: "COMPTANT", label: "Comptant" },
                      { value: "ECHEANCIER", label: "Échéancier" },
                    ]}
                  />
                </FormField>

                <div className="flex items-center gap-4 p-5 bg-[var(--color-bg)] rounded-2xl">
                  <input 
                    type="checkbox" 
                    {...register("is_paid")} 
                    className="w-5 h-5 accent-[var(--color-secondary)] rounded-lg cursor-pointer"
                  />
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer">
                    Paiement intégral reçu
                  </label>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-[var(--color-bg)] rounded-[2rem]">
                  <div className="flex items-center justify-between mb-6">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Conducteur Secondaire</label>
                    <button
                      type="button"
                      onClick={() => setValue("has_second_driver", !hasSecondDriver)}
                      className={`w-12 h-6 rounded-full transition-all relative ${hasSecondDriver ? "bg-[var(--color-secondary)]" : "bg-gray-200"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${hasSecondDriver ? "left-7" : "left-1"}`} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {hasSecondDriver && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-6 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField label="Prénom" error={errors.second_driver_first_name} name="second_driver_first_name">
                            <AdaptiveInput register={register} name="second_driver_first_name" placeholder="Prénom du 2ème conducteur" icon={<User size={14} />} />
                          </FormField>
                          <FormField label="Nom" error={errors.second_driver_last_name} name="second_driver_last_name">
                            <AdaptiveInput register={register} name="second_driver_last_name" placeholder="Nom du 2ème conducteur" icon={<User size={14} />} />
                          </FormField>
                          <FormField label="Né(e) le" error={errors.second_driver_birth_date} name="second_driver_birth_date">
                            <AdaptiveInput register={register} name="second_driver_birth_date" type="date" icon={<Calendar size={14} />} />
                          </FormField>
                          <FormField label="Nationalité" error={errors.second_driver_nationality} name="second_driver_nationality">
                            <AdaptiveInput register={register} name="second_driver_nationality" placeholder="E.g. Marocaine" icon={<Home size={14} />} />
                          </FormField>
                          <FormField label="N° Permis" error={errors.second_driver_license_number} name="second_driver_license_number">
                            <AdaptiveInput register={register} name="second_driver_license_number" placeholder="N° permis du 2ème conducteur" icon={<FileText size={14} />} />
                          </FormField>
                          <FormField label="Permis Délivré le" error={errors.second_driver_license_date} name="second_driver_license_date">
                            <AdaptiveInput register={register} name="second_driver_license_date" type="date" icon={<Calendar size={14} />} />
                          </FormField>
                          <FormField label="CIN n°" error={errors.second_driver_cin_number} name="second_driver_cin_number">
                            <AdaptiveInput register={register} name="second_driver_cin_number" placeholder="CIN du 2ème conducteur" icon={<Hash size={14} />} />
                          </FormField>
                          <FormField label="CIN Délivré le" error={errors.second_driver_cin_issue_date} name="second_driver_cin_issue_date">
                            <AdaptiveInput register={register} name="second_driver_cin_issue_date" type="date" icon={<Calendar size={14} />} />
                          </FormField>
                          <FormField label="Passeport n°" error={errors.second_driver_passport_number} name="second_driver_passport_number">
                            <AdaptiveInput register={register} name="second_driver_passport_number" placeholder="Passeport du 2ème conducteur" icon={<Hash size={14} />} />
                          </FormField>
                          <FormField label="Passeport Délivré le" error={errors.second_driver_passport_issue_date} name="second_driver_passport_issue_date">
                            <AdaptiveInput register={register} name="second_driver_passport_issue_date" type="date" icon={<Calendar size={14} />} />
                          </FormField>
                          <FormField label="Adresse" error={errors.second_driver_address} name="second_driver_address" className="md:col-span-2">
                            <AdaptiveInput register={register} name="second_driver_address" placeholder="Adresse complète du 2ème conducteur" icon={<Home size={14} />} />
                          </FormField>
                          <FormField label="Téléphone" error={errors.second_driver_phone} name="second_driver_phone">
                            <AdaptiveInput register={register} name="second_driver_phone" type="tel" placeholder="Téléphone du 2ème conducteur" icon={<Phone size={14} />} />
                          </FormField>
                          <FormField label="Email" error={errors.second_driver_email} name="second_driver_email">
                            <AdaptiveInput register={register} name="second_driver_email" type="email" placeholder="Email du 2ème conducteur" icon={<Mail size={14} />} />
                          </FormField>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Submit Button - Premium Style */}
            <FormActions
              submitLabel={initialData ? "Sauvegarder" : "Créer le contrat"}
              cancelLabel="Étape Précédente"
              onCancel={prevStep}
              loading={loading}
              variant="premium"
              totalAmount={calculateTotalPrice()}
              currency="MAD"
            />
          </div>
          )}
        </BaseForm>
      )}
    </div>
  );
}
