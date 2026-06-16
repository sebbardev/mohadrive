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

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mohadrive.com/api";
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

        {/* Section: Param\u00e8tres Financiers - DISABLED */}
        <AdminFormSection title="Param\u00e8tres Financiers (Automatisation)" icon={<Calendar size={20} className="text-orange-400" />}>
          <div className="relative">
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] rounded-2xl z-10 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><rect width="11" height="11" x="11" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fonctionnalit\u00e9 bient\u00f4t disponible</p>
            </div>
            <div className="opacity-30 pointer-events-none select-none space-y-8">
              <div className="flex items-center justify-between p-6 bg-orange-50/30 rounded-2xl border border-orange-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-7 rounded-full bg-gray-200 relative"><div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md" /></div>
                  <div><span className="admin-label block">Financement par Cr\u00e9dit</span></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                <div className="h-20 bg-gray-100 rounded-2xl" />
                <div className="h-20 bg-gray-100 rounded-2xl" />
              </div>
            </div>
          </div>
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
          <div className="flex flex-wrap gap-3 mb-6">
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
            {formData.features.filter((f: string) => !COMMON_FEATURES.includes(f)).map((feature: string) => (
              <span key={feature} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[var(--color-primary)] border border-[var(--color-primary)] text-white shadow-lg shadow-blue-900/10">
                <Check size={12} />
                {feature}
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, features: prev.features.filter((x: string) => x !== feature) }))} className="ml-1 opacity-70 hover:opacity-100 hover:text-red-300 transition-all"><X size={12} /></button>
              </span>
            ))}
          </div>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <AdminTextInput
                name="customFeature"
                label="Ajouter un équipement personnalisé"
                placeholder="ex: Sièges chauffants"
                value={newFeature}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFeature(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())}
              />
            </div>
            <button type="button" onClick={addCustomFeature} className="admin-btn-primary whitespace-nowrap mb-0.5">Ajouter</button>
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