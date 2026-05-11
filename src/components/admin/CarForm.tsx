"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Upload, X, Loader2, Plus, Check, Info, CheckCircle, AlertTriangle, Calendar, Clock } from 'lucide-react';
import SuccessMessage from './SuccessMessage';
import BaseForm from './BaseForm';
import FormContainer from './FormContainer';
import { AdminForm, AdminFormField, AdminTextInput, AdminSelectInput, AdminNumberInput, AdminDateInput, AdminTextareaInput, AdminFormActions, AdminFormSection, AdminFormSectionWithIcon } from './forms';
import { useFormContext } from './forms/FormContext';

interface CarFormProps {
  initialData?: any;
  isEditing?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
}

const COMMON_FEATURES = [
  "Climatisation", "GPS", "Bluetooth", "Caméra de recul", 
  "Sièges en cuir", "Toit panoramique", "Régulateur de vitesse",
  "Aide au stationnement", "Apple CarPlay", "Android Auto"
];

const ARABIC_LETTERS = [
  "أ", "ب", "ج", "د", "هـ", "و", "ز", "ح", "ط", "ي", "ك", "ل", "م", "ن", "س", "ع", "ف", "ص", "ق", "ر", "ش", "ت", "ث", "خ", "ذ", "ض", "ظ", "غ"
];

export default function CarForm({ initialData, isEditing = false, onSuccess, onClose }: CarFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingSecondary, setUploadingSecondary] = useState(false);

  // Parser les données JSON si elles viennent de la DB
  const initialImages = initialData?.images ? (typeof initialData.images === 'string' ? JSON.parse(initialData.images) : initialData.images) : [];
  const initialFeatures = initialData?.features ? (typeof initialData.features === 'string' ? JSON.parse(initialData.features) : initialData.features) : [];

  const [formData, setFormData] = useState({
    brand: initialData?.brand || "",
    model: initialData?.model || "",
    year: initialData?.year || new Date().getFullYear(),
    pricePerDay: initialData?.pricePerDay || "",
    currency: initialData?.currency || "MAD",
    fuel: initialData?.fuel || "Diesel",
    transmission: initialData?.transmission || "Automatique",
    category: initialData?.category || "Berline",
    color: initialData?.color || "",
    description: initialData?.description || "",
    image: initialData?.image || "", 
    images: initialImages || [], 
    features: initialFeatures || [],
    deposit: initialData?.deposit || "0",
    available: initialData?.available ?? true,
    plateNumber: initialData?.plateNumber || "",
    plateLetter: initialData?.plateLetter || "أ",
    plateCityCode: initialData?.plateCityCode || "",
    // Financial Parameters
    has_credit: initialData?.has_credit ?? false,
    monthly_credit: initialData?.monthly_credit || "0",
    credit_start_date: initialData?.credit_start_date || "",
    credit_end_date: initialData?.credit_end_date || "",
    credit_payment_day: initialData?.credit_payment_day || "1",
    annual_insurance: initialData?.annual_insurance || "0",
    insurance_expiry_date: initialData?.insurance_expiry_date || "",
    annual_vignette: initialData?.annual_vignette || "0",
    vignette_expiry_date: initialData?.vignette_expiry_date || "",
  });

  const [newFeature, setNewFeature] = useState("");

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body: uploadData });
      if (response.ok) {
        const { url } = await response.json();
        setFormData((prev) => ({ ...prev, image: url }));
      }
    } catch (error) {
      alert("Erreur upload");
    } finally {
      setUploadingMain(false);
    }
  };

  const handleSecondaryImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remainingSlots = 4 - formData.images.length;
    if (remainingSlots <= 0) return;

    setUploadingSecondary(true);
    const uploadedUrls: string[] = [];
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToUpload) {
      const uploadData = new FormData();
      uploadData.append("file", file);
      try {
        const response = await fetch("/api/admin/upload", { method: "POST", body: uploadData });
        if (response.ok) {
          const { url } = await response.json();
          uploadedUrls.push(url);
        }
      } catch (error) {}
    }
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls].slice(0, 4) }));
    setUploadingSecondary(false);
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature) 
        ? prev.features.filter((f: string) => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const addCustomFeature = () => {
    if (newFeature && !formData.features.includes(newFeature)) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature] }));
      setNewFeature("");
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    if (!formData.image) return alert("Image principale requise");
    setLoading(true);

    try {
      const accessToken = (session?.user as any)?.accessToken as string | undefined;
      if (!accessToken) {
        alert("Vous devez être connecté");
        return;
      }

      const API_URL = "https://mohadrive.com/api";
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `${API_URL}/cars/${initialData.id}` : `${API_URL}/cars`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year.toString()),
          price_per_day: parseFloat(formData.pricePerDay.toString()),
          currency: formData.currency,
          fuel: formData.fuel,
          transmission: formData.transmission,
          category: formData.category,
          image: formData.image,
          images: formData.images,
          description: formData.description,
          features: formData.features,
          deposit: parseFloat(formData.deposit.toString()),
          available: formData.available,
          plate_number: formData.plateNumber,
          plate_letter: formData.plateLetter,
          plate_city_code: formData.plateCityCode,
          // Financial fields
          has_credit: formData.has_credit,
          monthly_credit: formData.has_credit ? parseFloat(formData.monthly_credit.toString()) : 0,
          credit_start_date: formData.has_credit ? formData.credit_start_date : null,
          credit_end_date: formData.has_credit ? formData.credit_end_date : null,
          credit_payment_day: formData.has_credit ? parseInt(formData.credit_payment_day.toString()) : 1,
          annual_insurance: parseFloat(formData.annual_insurance.toString()),
          insurance_expiry_date: formData.insurance_expiry_date,
          annual_vignette: parseFloat(formData.annual_vignette.toString()),
          vignette_expiry_date: formData.vignette_expiry_date,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          // Rafraîchir la liste des voitures
          if (onSuccess) onSuccess();
          // Fermer le modal si fourni
          if (onClose) onClose();
          // Redirect si pas de callback (ancienne méthode)
          if (!onSuccess && !onClose) {
            router.push("/admin/voitures");
            router.refresh();
          }
        }, 3000);
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.message || "Erreur lors de l'enregistrement"}`);
      }
    } catch (error) {
      alert("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const carName = `${formData.brand} ${formData.model}`;
    return (
      <SuccessMessage
        title="Voiture"
        highlightedText={isEditing ? "Modifiée avec succès !" : "Créée avec succès !"}
        message={`${carName} a été ${isEditing ? "modifiée" : "ajoutée"} avec succès dans votre flotte de véhicules.`}
        autoCloseDelay={3000}
        onClose={onClose}
      />
    );
  }

  return (
    <BaseForm
      title={isEditing ? "Modifier le Véhicule" : "Ajouter un Véhicule"}
      subtitle={isEditing ? "Modifiez les informations du véhicule" : "Remplissez le formulaire pour ajouter un nouveau véhicule à votre flotte"}
      headerVariant="default"
      onSubmit={handleSubmit}
    >
      <AdminForm onSubmit={handleSubmit}>
        {/* Section 1: Informations Générales */}
        <AdminFormSection title="Informations Générales" icon={<div className="w-5 h-5 bg-[var(--color-primary)] rounded" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AdminTextInput
              name="brand"
              label="Marque"
              required
              placeholder="ex: Volkswagen"
              defaultValue={formData.brand}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({...prev, brand: e.target.value}))}
            />
            <AdminTextInput
              name="model"
              label="Modèle"
              required
              placeholder="ex: Golf 8"
              defaultValue={formData.model}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({...prev, model: e.target.value}))}
            />
            <AdminNumberInput
              name="year"
              label="Année"
              required
              defaultValue={formData.year}
              min={2015}
              max={2030}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({...prev, year: e.target.value}))}
            />
            <AdminSelectInput
              name="category"
              label="Catégorie"
              required
              defaultValue={formData.category}
              options={[{ value: "Berline", label: "Berline" }, { value: "SUV", label: "SUV" }, { value: "Luxe", label: "Luxe" }, { value: "Sport", label: "Sport" }, { value: "Utilitaire", label: "Utilitaire" }]}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({...prev, category: e.target.value}))}
            />
            <AdminTextInput
              name="color"
              label="Couleur"
              placeholder="ex: Noir, Blanc, Gris"
              defaultValue={formData.color}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({...prev, color: e.target.value}))}
            />
          </div>
        </AdminFormSection>

        {/* Section: Matricule (Format Marocain) */}
        <AdminFormSection title="Matricule (Format Marocain)" icon={<AlertTriangle size={20} className="text-orange-400" />}> 
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
            <AdminTextInput
              name="plateNumber"
              label="Numéro / رقم"
              required
              maxLength={6}
              placeholder="12345"
              defaultValue={formData.plateNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value.replace(/\D/g, "");
                setFormData(prev => ({...prev, plateNumber: val}));
              }}
              inputClassName="admin-input font-mono text-center text-2xl tracking-widest"
            />
            <AdminSelectInput
              name="plateLetter"
              label="Lettre / حرف"
              required
              defaultValue={formData.plateLetter}
              options={ARABIC_LETTERS.map(letter => ({ value: letter, label: letter }))}
              inputClassName="admin-input text-center text-2xl font-black appearance-none cursor-pointer"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({...prev, plateLetter: e.target.value}))}
            />
            <AdminTextInput
              name="plateCityCode"
              label="Ville / مدينة"
              required
              maxLength={2}
              placeholder="48"
              defaultValue={formData.plateCityCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value.replace(/\D/g, "");
                setFormData(prev => ({...prev, plateCityCode: val}));
              }}
              inputClassName="admin-input font-mono text-center text-2xl"
            />
            
            {/* Real-time Preview */}
            <div className="bg-[var(--color-bg)] border-2 border-dashed border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[100px] shadow-inner">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Aperçu de la plaque</p>
              <div className="flex items-center gap-4 text-[var(--color-primary)] font-black text-2xl">
                <span className={formData.plateNumber ? "" : "text-gray-200"}>{formData.plateNumber || "•••••"}</span>
                <span className="text-gray-100 not-italic">/</span>
                <span className="text-[var(--color-highlight)]">{formData.plateLetter}</span>
                <span className="text-gray-100 not-italic">/</span>
                <span className={formData.plateCityCode ? "" : "text-gray-200"}>{formData.plateCityCode || "••"}</span>
              </div>
            </div>
          </div>
        </AdminFormSection>

        {/* Section: Paramètres Financiers (Automatisation des charges) */}
        <AdminFormSection title="Paramètres Financiers (Automatisation)" icon={<Calendar size={20} className="text-orange-400" />}> 
          <div className="space-y-8">
            {/* Toggle Crédit */}
            <div className="flex items-center justify-between p-6 bg-orange-50/30 rounded-2xl border border-orange-100/50 shadow-inner">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-500 ${formData.has_credit ? "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)]" : "bg-gray-200"}`} onClick={() => setFormData(prev => ({...prev, has_credit: !prev.has_credit}))}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-md ${formData.has_credit ? "left-8" : "left-1"}`} />
                </div>
                <div>
                  <span className="admin-label block">Financement par Crédit</span>
                  <span className="text-[8px] font-bold text-orange-400 uppercase">{formData.has_credit ? "Véhicule sous crédit actif" : "Véhicule payé au comptant"}</span>
                </div>
              </div>
            </div>

            {/* Champs Crédit (Conditionnels) */}
            {formData.has_credit && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <AdminNumberInput
                  name="monthly_credit"
                  label="Mensualité (DH) *"
                  required
                  min={1}
                  placeholder="ex: 2500"
                  defaultValue={formData.monthly_credit}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({...prev, monthly_credit: e.target.value}))}
                  inputClassName="admin-input border-orange-100"
                />
                <AdminDateInput
                  name="credit_start_date"
                  label="Début Crédit *"
                  required
                  defaultValue={formData.credit_start_date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({...prev, credit_start_date: e.target.value}))}
                  inputClassName="admin-input border-orange-100"
                />
                <AdminDateInput
                  name="credit_end_date"
                  label="Fin Crédit *"
                  required
                  min={formData.credit_start_date}
                  defaultValue={formData.credit_end_date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({...prev, credit_end_date: e.target.value}))}
                  inputClassName="admin-input border-orange-100"
                />
                <AdminSelectInput
                  name="credit_payment_day"
                  label="Jour de Prélèvement"
                  defaultValue={formData.credit_payment_day}
                  options={[{ value: "1", label: "Le 01 du mois" }, { value: "5", label: "Le 05 du mois" }, { value: "10", label: "Le 10 du mois" }, { value: "15", label: "Le 15 du mois" }, { value: "20", label: "Le 20 du mois" }, { value: "25", label: "Le 25 du mois" }]}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({...prev, credit_payment_day: e.target.value}))}
                  inputClassName="admin-input border-orange-100 appearance-none cursor-pointer"
                />
              </div>
            )}

            {/* Assurance & Vignette (Toujours visibles) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
              {/* Bloc Assurance */}
              <div className="space-y-4">
                <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  Assurance Automobile
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <AdminNumberInput
                    name="annual_insurance"
                    label="Prime Annuelle (DH)"
                    placeholder="0"
                    defaultValue={formData.annual_insurance}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({...prev, annual_insurance: e.target.value}))}
                    inputClassName="admin-input bg-blue-50/30"
                  />
                  <AdminDateInput
                    name="insurance_expiry_date"
                    label="Date d&apos;Échéance"
                    defaultValue={formData.insurance_expiry_date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({...prev, insurance_expiry_date: e.target.value}))}
                    inputClassName="admin-input bg-blue-50/30"
                  />
                </div>
              </div>

              {/* Bloc Vignette */}
              <div className="space-y-4">
                <h4 className="text-[9px] font-black text-green-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Vignette Annuelle
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <AdminNumberInput
                    name="annual_vignette"
                    label="Montant (DH)"
                    placeholder="0"
                    defaultValue={formData.annual_vignette}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({...prev, annual_vignette: e.target.value}))}
                    inputClassName="admin-input bg-green-50/30"
                  />
                  <AdminDateInput
                    name="vignette_expiry_date"
                    label="Date d&apos;Échéance"
                    defaultValue={formData.vignette_expiry_date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({...prev, vignette_expiry_date: e.target.value}))}
                    inputClassName="admin-input bg-green-50/30"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <p className="mt-8 text-[9px] font-bold text-gray-400 flex items-center gap-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <Info size={14} className="text-[var(--color-primary)]" />
            Note: L&apos;assurance et la vignette sont automatiquement lissées sur 12 mois. Le crédit est déduit selon le jour de prélèvement choisi.
          </p>
        </AdminFormSection>

        {/* Section: Configuration & Prix */}
        <AdminFormSection title="Configuration & Prix" icon={<Clock size={20} className="text-[var(--color-primary)]" />}> 
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <AdminNumberInput
              name="pricePerDay"
              label="Prix / Jour"
              required
              placeholder="ex: 250"
              defaultValue={formData.pricePerDay}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({...prev, pricePerDay: e.target.value}))}
              inputClassName="admin-input text-[var(--color-accent)] font-black text-lg"
            />
            <AdminNumberInput
              name="deposit"
              label="Caution (MAD)"
              required
              placeholder="ex: 1000"
              defaultValue={formData.deposit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({...prev, deposit: e.target.value}))}
              inputClassName="admin-input"
            />
            <AdminSelectInput
              name="fuel"
              label="Carburant"
              required
              defaultValue={formData.fuel}
              options={[{ value: "Diesel", label: "Diesel" }, { value: "Essence", label: "Essence" }, { value: "Hybride", label: "Hybride" }, { value: "Électrique", label: "Électrique" }]}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({...prev, fuel: e.target.value}))}
              inputClassName="admin-input appearance-none cursor-pointer"
            />
            <AdminSelectInput
              name="transmission"
              label="Transmission"
              required
              defaultValue={formData.transmission}
              options={[{ value: "Automatique", label: "Automatique" }, { value: "Manuelle", label: "Manuelle" }]}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({...prev, transmission: e.target.value}))}
              inputClassName="admin-input appearance-none cursor-pointer"
            />
          </div>
        </AdminFormSection>

        {/* Section: Galerie Photos */}
        <AdminFormSection title="Galerie Photos" icon={<Upload size={20} className="text-[var(--color-primary)]" />}> 
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-2">
              <AdminFormField name="mainImage" label="Photo Principale">
                <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-dashed border-gray-100 bg-[var(--color-bg)] group/upload transition-all hover:border-[var(--color-secondary)]/30">
                  {formData.image ? (
                    <>
                      <Image src={formData.image} alt="Main" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
                      <button type="button" onClick={() => setFormData(prev => ({...prev, image: ""}))} className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all"><X size={20} /></button>
                    </>
                  ) : (
                    <div onClick={() => fileInputRef.current?.click()} className="h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-colors duration-500">
                      <div className="p-6 bg-white rounded-2xl shadow-sm mb-4 text-gray-300 group-hover/upload:text-[var(--color-primary)] group-hover/upload:scale-110 transition-all duration-500">
                        {uploadingMain ? <Loader2 className="animate-spin" size={40} /> : <Upload size={40} />}
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Cliquez pour uploader</p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} />
                </div>
              </AdminFormField>
            </div>
            <div className="lg:col-span-5 space-y-2">
              <AdminFormField name="secondaryImages" label={`Galerie (${formData.images.length}/4)`}>
                <div className="grid grid-cols-2 gap-4">
                  {formData.images.map((img: string, i: number) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-white shadow-md group/img">
                      <Image src={img} alt={`sec-${i}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                      <button type="button" onClick={() => setFormData(prev => ({...prev, images: prev.images.filter((_: any, idx: number) => idx !== i)}))} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover/img:opacity-100 transition-opacity"><X size={14} /></button>
                    </div>
                  ))}
                  {formData.images.length < 4 && (
                    <div onClick={() => secondaryFileInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-gray-100 bg-[var(--color-bg)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-secondary)]/30 hover:bg-white transition-all duration-500">
                      {uploadingSecondary ? <Loader2 className="animate-spin text-[var(--color-primary)]" size={24} /> : <Plus className="text-gray-300" size={24} />}
                    </div>
                  )}
                  <input ref={secondaryFileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleSecondaryImagesUpload} />
                </div>
              </AdminFormField>
            </div>
          </div>
        </AdminFormSection>

        {/* Section: Équipements du véhicule */}
        <AdminFormSection title="Équipements du véhicule" icon={<Check size={20} className="text-[var(--color-primary)]" />}> 
          <div className="flex flex-wrap gap-3 mb-8">
            {COMMON_FEATURES.map(feature => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 ${
                  formData.features.includes(feature)
                    ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg shadow-blue-900/10"
                    : "bg-gray-50 border-transparent text-gray-400 hover:border-gray-200"
                }`}
              >
                {formData.features.includes(feature) && <Check size={12} className="inline mr-2" />}
                {feature}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <AdminTextInput
              name="customFeature"
              label="Ajouter un équipement personnalisé"
              placeholder="ex: Sièges chauffants"
              value={newFeature}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFeature(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())}
              inputClassName="flex-grow admin-input"
            />
            <button type="button" onClick={addCustomFeature} className="admin-btn-primary whitespace-nowrap">Ajouter</button>
          </div>
        </AdminFormSection>

        {/* Section: Description & Finalisation */}
        <AdminFormSection title="Description & Finalisation" icon={<Info size={20} className="text-[var(--color-primary)]" />}> 
          <div className="space-y-8">
            <AdminTextareaInput
              name="description"
              label="Description Marketing"
              required
              rows={5}
              placeholder="Vendez votre véhicule avec une description percutante..."
              defaultValue={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({...prev, description: e.target.value}))}
              inputClassName="admin-input resize-none font-light text-lg rounded-2xl"
            />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-500 ${formData.available ? "bg-[var(--color-accent)]" : "bg-gray-200"}`} onClick={() => setFormData(prev => ({...prev, available: !prev.available}))}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-md ${formData.available ? "left-8" : "left-1"}`} />
                </div>
                <span className="admin-label">Disponible à la location</span>
              </div>
              
              <AdminFormActions
                submitLabel={isEditing ? "Mettre à jour" : "Publier le véhicule"}
                loading={loading}
                showCancelButton={false}
                variant="default"
              />
            </div>
          </div>
        </AdminFormSection>
      </AdminForm>
    </BaseForm>
  );
}