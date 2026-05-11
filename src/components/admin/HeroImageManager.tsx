"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Image, Upload, Trash2, Edit2, GripVertical, X, Check, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import type { HeroImage } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://mohadrive.com/api";

export default function HeroImageManager() {
  const { data: session } = useSession();
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getToken = () => {
    return (session?.user as any)?.accessToken;
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/hero-images`, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching hero images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = getToken();
    if (!token) {
      toast.error("Non authentifié");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/hero-images`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Image ajoutée avec succès");
        await fetchImages();
      } else {
        const error = await response.json().catch(() => ({ message: "Erreur serveur" }));
        console.error("Upload error:", error);
        toast.error(error.message || `Erreur ${response.status}: Échec de l'upload`);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Erreur de connexion au serveur");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return;

    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/hero-images/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Image supprimée");
        await fetchImages();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleToggleActive = async (image: HeroImage) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/hero-images/${image.id}`, {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_active: !image.is_active,
        }),
      });

      if (response.ok) {
        toast.success(image.is_active ? "Image masquée" : "Image affichée");
        await fetchImages();
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  if (loading) {
    return (
      <div className="admin-card">
        <div className="flex items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--color-primary)]/10 rounded-xl">
            <Image className="text-[var(--color-primary)]" size={24} />
          </div>
          <div>
            <h2 className="admin-section-title">Images Hero (Page d'accueil)</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
              {images.length} image(s) - Défilement automatique toutes les 1 seconde
            </p>
          </div>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:shadow-lg transition-all disabled:opacity-50"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Upload...
            </>
          ) : (
            <>
              <Plus size={16} />
              Ajouter
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {images.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
          <Image size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-4">
            Aucune image hero
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:shadow-lg transition-all"
          >
            <Upload size={16} />
            Sélectionner une image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`relative group rounded-2xl overflow-hidden border-2 transition-all ${
                image.is_active ? "border-[var(--color-primary)]/20" : "border-gray-200 opacity-60"
              }`}
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={image.image_path}
                  alt={image.title || "Hero image"}
                  className="w-full h-full object-cover"
                />
                
                {/* Order badge */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg">
                  <span className="text-xs font-black uppercase tracking-wider">
                    #{index + 1}
                  </span>
                </div>

                {/* Status badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-lg backdrop-blur-sm ${
                  image.is_active ? "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)]/90 text-white" : "bg-gray-500/90 text-white"
                }`}>
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {image.is_active ? "Actif" : "Masqué"}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-sm text-[var(--color-primary)] uppercase tracking-tight truncate flex-1">
                    {image.title || "Sans titre"}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(image)}
                      className={`p-2 rounded-lg transition-all ${
                        image.is_active
                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      title={image.is_active ? "Masquer" : "Afficher"}
                    >
                      <Check size={14} />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {image.subtitle && (
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {image.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Image className="text-blue-500" size={16} />
          </div>
          <div className="text-xs text-blue-700">
            <p className="font-black uppercase tracking-wider mb-1">Comment ça marche ?</p>
            <ul className="space-y-1 text-blue-600 font-medium">
              <li>• Les images défilent automatiquement toutes les 1 seconde sur la page d'accueil</li>
              <li>• Utilisez le bouton vert pour afficher/masquer une image</li>
              <li>• Les images sont affichées dans l'ordre (de haut en bas, gauche à droite)</li>
              <li>• Format recommandé : 1920x1080px ou plus</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
