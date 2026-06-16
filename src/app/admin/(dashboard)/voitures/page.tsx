"use client";

import { getAllCars } from "@/services/carService";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Search,
  Filter,
  Download,
  Car as CarIcon,
  Loader2,
  X,
  Edit
} from "lucide-react";
import CarForm from "@/components/admin/CarForm";
import MobileCardList from "@/components/admin/MobileCardList";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export default function AdminCarsPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCar, setEditingCar] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowAddModal(true);
      router.replace('/admin/voitures');
    }
  }, [searchParams]);

  // Fermer le modal avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (showAddModal || editingCar)) {
        setShowAddModal(false);
        setEditingCar(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showAddModal, editingCar]);

  const fetchCars = async () => {
    try {
      console.log("🚗 Début de la récupération des voitures...");
      // Utilisation du service centralisé qui gère déjà le mapping Laravel -> Frontend
      const data = await getAllCars();
      console.log("🚗 Données reçues:", data);
      console.log("🚗 Nombre de voitures:", data.length);
      setCars(data);
    } catch (error) {
      console.error("❌ Error fetching cars:", error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/voitures/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCars(prev => prev.filter(car => car.id !== id));
      } else {
        const error = await response.json();
        alert(error.message || "Erreur lors de la suppression du véhicule.");
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Une erreur est survenue.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={48} />
        <p className="admin-label">Chargement du parc...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="admin-header-title">
            Gestion du <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Parc</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] rounded-full" />
            <p className="admin-header-subtitle">{cars.length} Véhicules enregistrés</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="admin-btn-primary group"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Plus size={22} className="relative z-10" />
          <span className="relative z-10">Ajouter un véhicule</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Desktop Table */}
        <div className="hidden md:block admin-table-container">
          <div className="overflow-x-auto admin-scroll-container">
            <table className="w-full text-left border-none">
              <thead>
                <tr>
                  <th className="admin-table-th">Véhicule</th>
                  <th className="admin-table-th">Matricule</th>
                  <th className="admin-table-th">Prix / Jour</th>
                  <th className="admin-table-th">Statut</th>
                  <th className="admin-table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/50">
                {cars.map((car) => (
                  <tr key={car.id} className="admin-table-row group">
                    <td className="admin-table-td">
                      <div className="flex items-center gap-5">
                        <div className="relative h-16 w-28 rounded-2xl overflow-hidden border-4 border-white shadow-md group-hover:shadow-xl transition-all group-hover:-translate-y-1 duration-500">
                          <Image
                            src={car.image || "/placeholder-car.png"}
                            alt={car.brand}
                            fill
                            className="object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-car.png"; }}
                            unoptimized={!car.image?.startsWith("https://")}
                          />
                        </div>
                        <div className="flex flex-col">
                          <p className="admin-table-primary-text uppercase tracking-wider">{car.brand} {car.model}</p>
                          <p className="admin-table-secondary-text font-bold uppercase tracking-widest mt-1">{car.category} • {car.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="admin-table-td">
                      {car.plateNumber ? (
                        <div className="inline-flex items-center border-2 border-gray-800 rounded-md overflow-hidden text-sm font-black tracking-widest bg-white shadow-sm">
                          <span className="px-2 py-1 text-gray-900">{car.plateNumber}</span>
                          <span className="px-1 py-1 border-l-2 border-r-2 border-gray-800 text-gray-900">{car.plateLetter}</span>
                          <span className="px-2 py-1 text-gray-900">{car.plateCityCode}</span>
                        </div>
                      ) : (
                        <span className="admin-label">—</span>
                      )}
                    </td>
                    <td className="admin-table-td">
                      <span className="admin-table-price">
                        {car.pricePerDay} <span className="admin-table-unit">{car.currency}</span>
                      </span>
                    </td>
                    <td className="admin-table-td">
                      {car.available ? (                    
                        <span className="admin-pill admin-pill-success">
                          Disponible
                        </span>
                      ) : (
                        <span className="admin-pill admin-pill-warning">
                          Loué
                        </span>
                      )}
                    </td>
                    <td className="admin-table-td text-right">
                      <div className="admin-actions-container">
                        <button 
                          onClick={() => setEditingCar(car)}
                          className="admin-btn-icon !text-blue-500 hover:!bg-blue-500 hover:!text-white"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(car.id)}
                          disabled={deletingId === car.id}
                          className="admin-btn-icon !text-red-500 hover:!bg-red-500 hover:!text-white"
                          title="Supprimer"
                        >
                          {deletingId === car.id ? <Loader2 className="animate-spin" size="16" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {cars.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-8 py-32 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-200 shadow-sm">
                        <div className="w-10 h-10 bg-gray-200 rounded-full opacity-20" />
                      </div>
                      <p className="admin-label tracking-[0.3em]">Aucun véhicule dans le parc</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards View */}
        {isMobile && (
          <div className="md:hidden">
            {cars.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200">
                  <div className="w-8 h-8 bg-gray-200 rounded-full opacity-20" />
                </div>
                <p className="admin-label tracking-[0.3em] text-[9px]">Aucun véhicule dans le parc</p>
              </div>
            ) : (
              <MobileCardList
                items={cars.map((car) => ({
                  title: `${car.brand} ${car.model}`,
                  subtitle: `${car.category} • ${car.year} • ${car.plateNumber} ${car.plateLetter} ${car.plateCityCode}`,
                  image: car.image,
                  badge: {
                    text: car.available ? "Disponible" : "Loué",
                    variant: car.available ? "success" : "warning",
                  },
                  rightContent: (
                    <div className="text-right">
                      <p className="text-lg font-black text-[var(--color-primary)] tracking-tighter">
                        {car.pricePerDay}
                      </p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase">{car.currency}/jour</p>
                    </div>
                  ),
                  actions: (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCar(car);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-500 rounded-xl transition-all text-[10px] font-black uppercase tracking-wider min-h-[44px]"
                      >
                        <Edit size={14} />
                        Modifier
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(car.id);
                        }}
                        disabled={deletingId === car.id}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all text-[10px] font-black uppercase tracking-wider min-h-[44px] disabled:opacity-50"
                      >
                        {deletingId === car.id ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Supprimer
                      </button>
                    </>
                  ),
                }))}
              />
            )}
          </div>
        )}
      </div>

      {/* Modal Formulaire Ajout Véhicule */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto" onClick={() => setShowAddModal(false)}>
          <div className="w-full max-w-5xl transform transition-all animate-scale-in duration-300 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-[2.5rem] shadow-2xl relative">
              {/* Header du modal */}
              <div className="flex items-center justify-between p-8 sm:p-10 lg:p-12 border-b border-gray-100 rounded-t-[2.5rem]">
                <div>
                  <h2 className="admin-header-title">
                    Ajouter un <span className="text-[var(--color-secondary)]">Véhicule</span>
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-0.5 w-8 bg-[var(--color-highlight)] rounded-full" />
                    <p className="admin-header-subtitle">Nouveau membre de la flotte</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-3 bg-gray-50 border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Contenu du formulaire */}
              <div className="p-8 sm:p-10 lg:p-12 max-h-[calc(100vh-200px)] overflow-y-auto">
                <CarForm 
                  onSuccess={() => {
                    fetchCars();
                    setShowAddModal(false);
                  }}
                  onClose={() => setShowAddModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Formulaire Modification Véhicule */}
      {editingCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto" onClick={() => setEditingCar(null)}>
          <div className="w-full max-w-5xl transform transition-all animate-scale-in duration-300 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-[2.5rem] shadow-2xl relative">
              {/* Header du modal */}
              <div className="flex items-center justify-between p-8 sm:p-10 lg:p-12 border-b border-gray-100 rounded-t-[2.5rem]">
                <div>
                  <h2 className="admin-header-title">
                    Modifier <span className="text-[var(--color-secondary)]">{editingCar.brand} {editingCar.model}</span>
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-0.5 w-8 bg-[var(--color-highlight)] rounded-full" />
                    <p className="admin-header-subtitle">Mise à jour du véhicule</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingCar(null)}
                  className="p-3 bg-gray-50 border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Contenu du formulaire */}
              <div className="p-8 sm:p-10 lg:p-12 max-h-[calc(100vh-200px)] overflow-y-auto">
                <CarForm 
                  initialData={editingCar}
                  isEditing={true}
                  onSuccess={() => {
                    fetchCars();
                    setEditingCar(null);
                  }}
                  onClose={() => setEditingCar(null)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
