"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { User, Mail, Lock, Loader2, CheckCircle, Camera, X } from 'lucide-react';
import Image from 'next/image';
import { AdminForm, AdminFormField, AdminTextInput, AdminTextareaInput, AdminFormActions, AdminFormSection, AdminFormSectionWithIcon } from './forms';
import { useFormContext } from './forms/FormContext';

interface ProfileFormProps {
  user: {
    name: string | null;
    email: string | null;
    profileImage?: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(user.profileImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setProfileImage(data.url);
      }
    } catch (_) {}
    finally { setUploadingPhoto(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (data: Record<string, any>) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, profileImage }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
        await updateSession({ profileImage, name: formData.name });
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.message || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminForm onSubmit={handleSubmit}>
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-100 text-green-600 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in duration-300 shadow-sm">
          <div className="p-2 bg-green-100 rounded-xl">
            <CheckCircle size={20} className="text-green-600" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Profil mis à jour avec succès</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in duration-300 shadow-sm">
          <div className="p-2 bg-red-100 rounded-xl">
            <Lock size={20} className="text-red-600" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">{error}</p>
        </div>
      )}

      {/* Photo de profil */}
      <div className="flex items-center gap-6 p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
        <div className="relative group/avatar">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-gray-100 flex items-center justify-center">
            {profileImage ? (
              <Image src={profileImage} alt="Photo de profil" fill className="object-cover" />
            ) : (
              <User size={32} className="text-gray-300" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center"
          >
            {uploadingPhoto ? <Loader2 size={18} className="text-white animate-spin" /> : <Camera size={18} className="text-white" />}
          </button>
          {profileImage && (
            <button
              type="button"
              onClick={() => setProfileImage(null)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white shadow-sm hover:bg-red-600 transition-colors"
            >
              <X size={10} />
            </button>
          )}
        </div>
        <div>
          <p className="text-sm font-black text-gray-700 uppercase tracking-widest mb-1">Photo de profil</p>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-3">JPG, PNG — Max 5MB</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="admin-btn-secondary !py-2 !px-4 text-[9px]"
          >
            {uploadingPhoto ? 'Chargement...' : 'Changer la photo'}
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Informations de base */}
        <AdminFormSection title="Informations Générales" icon={<User size={20} className="text-[var(--color-primary)]" />}> 
          <AdminFormField
            name="name"
            label="Nom Complet"
            required
            inputClassName="admin-input"
          >
            <input
              type="text"
              name="name"
              required
              placeholder="VOTRE NOM"
              defaultValue={formData.name}
              onChange={handleChange}
              className="w-full h-full p-0 bg-transparent border-none focus:ring-0 focus:outline-none"
            />
          </AdminFormField>

          <AdminFormField
            name="email"
            label="Email Professionnel"
            required
            inputClassName="admin-input"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="VOTRE@EMAIL.COM"
              defaultValue={formData.email}
              onChange={handleChange}
              className="w-full h-full p-0 bg-transparent border-none focus:ring-0 focus:outline-none"
            />
          </AdminFormField>
        </AdminFormSection>

        {/* Sécurité */}
        <AdminFormSection title="Sécurité & Mot de passe" icon={<Lock size={20} className="text-[var(--color-accent)]" />}> 
          <AdminFormField
            name="currentPassword"
            label="Mot de passe actuel"
            inputClassName="admin-input"
          >
            <input
              type="password"
              name="currentPassword"
              placeholder="MOT DE PASSE ACTUEL"
              defaultValue={formData.currentPassword}
              onChange={handleChange}
              className="w-full h-full p-0 bg-transparent border-none focus:ring-0 focus:outline-none"
            />
          </AdminFormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AdminFormField
              name="newPassword"
              label="Nouveau mot de passe"
              inputClassName="admin-input pl-6"
            >
              <input
                type="password"
                name="newPassword"
                placeholder="NOUVEAU"
                defaultValue={formData.newPassword}
                onChange={handleChange}
                className="w-full h-full p-0 bg-transparent border-none focus:ring-0 focus:outline-none"
              />
            </AdminFormField>
            <AdminFormField
              name="confirmPassword"
              label="Confirmer"
              inputClassName="admin-input pl-6"
            >
              <input
                type="password"
                name="confirmPassword"
                placeholder="CONFIRMER"
                defaultValue={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-full p-0 bg-transparent border-none focus:ring-0 focus:outline-none"
              />
            </AdminFormField>
          </div>

          {/* Security hint */}
          <div className="bg-[var(--color-bg)] border border-gray-100 rounded-2xl p-4 flex items-start gap-3">
            <Lock size={16} className="text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
            <p className="text-[9px] text-gray-400 font-bold leading-relaxed">
              Le mot de passe doit contenir au moins 8 caractères. Laissez vide si vous ne souhaitez pas le modifier.
            </p>
          </div>
        </AdminFormSection>
      </div>

      <div className="pt-8 border-t border-gray-100 flex justify-end">
        <AdminFormActions
          submitLabel="ENREGISTRER LES MODIFICATIONS"
          loading={loading}
        />
      </div>
    </AdminForm>
  );
}