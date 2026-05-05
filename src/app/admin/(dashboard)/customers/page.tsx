"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Plus, 
  Search, 
  User, 
  Edit2, 
  Trash2, 
  Loader2,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  ChevronLeft,
  ChevronRight,
  History,
  Filter,
  FileText,
  Calendar,
  Hash,
  Home,
  Globe,
  X,
  Eye
} from "lucide-react";
import { toast } from "react-hot-toast";
import StandardFormField from "@/components/admin/StandardFormField";
import FormActions from "@/components/admin/FormActions";
import FormContainer from "@/components/admin/FormContainer";
import BaseForm from "@/components/admin/BaseForm";
import SuccessMessage from "@/components/admin/SuccessMessage";
import MobileCardList from "@/components/admin/MobileCardList";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { AdminTable, AdminTableHeader, AdminTableBody, AdminTableRow, AdminTableCell, AdminTableHeaderCell, AdminTableActionCell, AdminTableStatusBadge } from "@/components/admin/tables";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  license_number: string;
  license_issue_date: string;
  cin_number: string;
  cin_issue_date: string;
  passport_number: string;
  passport_issue_date: string;
  address: string;
  birth_date: string;
  nationality: string;
  created_at: string;
}

interface CustomerFormModalProps {
  initialData?: any;
  onSuccess: () => void;
  onClose: () => void;
}

function CustomerFormModal({ initialData, onSuccess, onClose }: CustomerFormModalProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    license_number: initialData?.license_number || "",
    license_issue_date: initialData?.license_issue_date || "",
    cin_number: initialData?.cin_number || "",
    cin_issue_date: initialData?.cin_issue_date || "",
    passport_number: initialData?.passport_number || "",
    passport_issue_date: initialData?.passport_issue_date || "",
    address: initialData?.address || "",
    birth_date: initialData?.birth_date || "",
    nationality: initialData?.nationality || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    setLoading(true);

    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(initialData ? "Client mis à jour avec succès" : "Client créé avec succès");
      setSubmitted(true);
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError("Une erreur est survenue lors de l'enregistrement");
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <FormContainer
      title={initialData ? "Modifier le Client" : "Créer un Nouveau Client"}
      subtitle={initialData ? "Modifiez les informations du client" : "Remplissez le formulaire pour créer un nouveau client"}
      variant="modal"
      size="lg"
      onClose={onClose}
    >
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-bold">
          {error}
        </div>
      )}

      <BaseForm
        title=""
        subtitle=""
        onSubmit={handleSubmit}
        showHeader={false}
      >
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StandardFormField label="Prénom" required inputClassName="admin-input">
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              />
            </StandardFormField>
            <StandardFormField label="Nom" required inputClassName="admin-input">
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              />
            </StandardFormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StandardFormField label="Email" required inputClassName="admin-input">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </StandardFormField>
            <StandardFormField label="Téléphone" inputClassName="admin-input">
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </StandardFormField>
          </div>

          {/* Identity Documents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StandardFormField label="Numéro de Permis" inputClassName="admin-input">
              <input
                type="text"
                value={formData.license_number}
                onChange={(e) => setFormData({...formData, license_number: e.target.value})}
              />
            </StandardFormField>
            <StandardFormField label="Date d'émission" inputClassName="admin-input">
              <input
                type="date"
                value={formData.license_issue_date}
                onChange={(e) => setFormData({...formData, license_issue_date: e.target.value})}
                className="[color-scheme:dark]"
              />
            </StandardFormField>
            <StandardFormField label="Numéro CIN" inputClassName="admin-input">
              <input
                type="text"
                value={formData.cin_number}
                onChange={(e) => setFormData({...formData, cin_number: e.target.value})}
              />
            </StandardFormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StandardFormField label="Date d'émission CIN" inputClassName="admin-input">
              <input
                type="date"
                value={formData.cin_issue_date}
                onChange={(e) => setFormData({...formData, cin_issue_date: e.target.value})}
                className="[color-scheme:dark]"
              />
            </StandardFormField>
            <StandardFormField label="Numéro Passeport" inputClassName="admin-input">
              <input
                type="text"
                value={formData.passport_number}
                onChange={(e) => setFormData({...formData, passport_number: e.target.value})}
              />
            </StandardFormField>
            <StandardFormField label="Date d'émission Passeport" inputClassName="admin-input">
              <input
                type="date"
                value={formData.passport_issue_date}
                onChange={(e) => setFormData({...formData, passport_issue_date: e.target.value})}
                className="[color-scheme:dark]"
              />
            </StandardFormField>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StandardFormField label="Adresse" inputClassName="admin-input">
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </StandardFormField>
            <StandardFormField label="Né(e) le" inputClassName="admin-input">
              <input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                className="[color-scheme:dark]"
              />
            </StandardFormField>
          </div>

          <StandardFormField label="Nationalité" inputClassName="admin-input">
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) => setFormData({...formData, nationality: e.target.value})}
            />
          </StandardFormField>
        </div>

        <FormActions
          submitLabel={initialData ? "Mettre à jour" : "Créer le client"}
          cancelLabel="Annuler"
          onCancel={onClose}
          loading={loading}
          variant="default"
        />
      </BaseForm>
    </FormContainer>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1);
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    // Mock data loading
    const mockCustomers: Customer[] = [
      {
        id: "1",
        first_name: "Ahmed",
        last_name: "Alami",
        email: "ahmed.alami@email.com",
        phone: "+212 600000000",
        license_number: "AB123456",
        license_issue_date: "2023-01-15",
        cin_number: "CA789012",
        cin_issue_date: "2022-03-20",
        passport_number: "P12345678",
        passport_issue_date: "2021-08-10",
        address: "123 Rue Hassan II, Casablanca",
        birth_date: "1990-05-15",
        nationality: "Marocaine",
        created_at: "2024-01-15T10:30:00Z"
      },
      {
        id: "2",
        first_name: "Fatima",
        last_name: "Benali",
        email: "fatima.benali@email.com",
        phone: "+212 611111111",
        license_number: "CD789012",
        license_issue_date: "2023-03-22",
        cin_number: "CB345678",
        cin_issue_date: "2022-06-15",
        passport_number: "P87654321",
        passport_issue_date: "2021-11-25",
        address: "456 Avenue Mohammed V, Rabat",
        birth_date: "1985-08-22",
        nationality: "Marocaine",
        created_at: "2024-02-20T14:45:00Z"
      }
    ];

    setCustomers(mockCustomers);
    setLoading(false);
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleCreateCustomer = () => {
    setShowForm(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setViewingCustomer(customer);
    setShowForm(true);
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      setCustomers(customers.filter(customer => customer.id !== id));
      toast.success("Client supprimé avec succès");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setViewingCustomer(null);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div className="space-y-1">
            <h1 className="admin-header-title">
              Gestion des <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Clients</span>
            </h1>
            <div className="flex items-center gap-2">
              <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] rounded-full" />
              <p className="admin-header-subtitle">Gérez la base de données clients et leurs réservations</p>
            </div>
          </div>
          <button
            onClick={handleCreateCustomer}
            className="admin-btn-primary mt-4 sm:mt-0 whitespace-nowrap"
          >
            <Plus size={20} className="inline mr-2" />
            Nouveau Client
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-3 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                Tous
              </button>
              <button className="px-4 py-3 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                Actifs
              </button>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        {!showForm && (
          <div className="space-y-6">
            {/* Desktop Table */}
            <div className="hidden md:block">
              {loading ? (
                <div className="p-32 flex flex-col items-center justify-center text-gray-400 gap-6">
                  <Loader2 size={40} className="animate-spin text-[var(--color-primary)]" />
                  <p className="admin-label tracking-[0.3em]">Synchronisation des clients...</p>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="p-32 text-center text-gray-500">
                  <User size={48} className="mx-auto mb-4 opacity-20 text-gray-500" />
                  <p className="admin-label tracking-[0.3em]">Aucun client trouvé</p>
                  <p className="text-sm mt-2">Essayez une recherche différente ou créez un nouveau client</p>
                </div>
              ) : (
                <AdminTable>
                  <AdminTableHeader>
                    <AdminTableRow>
                      <AdminTableHeaderCell>Identité</AdminTableHeaderCell>
                      <AdminTableHeaderCell>Contact</AdminTableHeaderCell>
                      <AdminTableHeaderCell>Documents</AdminTableHeaderCell>
                      <AdminTableHeaderCell>Inscrit le</AdminTableHeaderCell>
                      <AdminTableHeaderCell className="text-right">Actions</AdminTableHeaderCell>
                    </AdminTableRow>
                  </AdminTableHeader>
                  <AdminTableBody>
                    {filteredCustomers.map((customer) => (
                      <AdminTableRow key={customer.id} onClick={() => setViewingCustomer(customer)}>
                        <AdminTableCell>
                          <div className="flex flex-col">
                            <span className="admin-table-primary-text uppercase tracking-wider">
                              {customer.first_name} {customer.last_name}
                            </span>
                            <span className="admin-table-secondary-text font-bold uppercase tracking-widest mt-1">
                              ID #{customer.id}
                            </span>
                          </div>
                        </AdminTableCell>
                        <AdminTableCell>
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-2 text-[13px] font-bold text-[#1A3B5D]">
                              <Mail size={12} className="text-gray-400" /> {customer.email}
                            </span>
                            <span className="flex items-center gap-2 admin-table-secondary-text font-bold uppercase tracking-widest">
                              <Phone size={12} /> {customer.phone}
                            </span>
                          </div>
                        </AdminTableCell>
                        <AdminTableCell>
                          <div className="flex flex-col gap-1">
                            <span className="admin-table-secondary-text font-bold uppercase tracking-widest">
                              Permis: <span className="text-[#1A3B5D] tracking-normal">{customer.license_number || "—"}</span>
                            </span>
                            <span className="admin-table-secondary-text font-bold uppercase tracking-widest">
                              CIN: <span className="text-[#1A3B5D] tracking-normal">{customer.cin_number || "—"}</span>
                            </span>
                            {customer.passport_number && (
                              <span className="admin-table-secondary-text font-bold uppercase tracking-widest">
                                Passeport: <span className="text-[#1A3B5D] tracking-normal">{customer.passport_number}</span>
                              </span>
                            )}
                          </div>
                        </AdminTableCell>
                        <AdminTableCell>
                          <span className="admin-table-secondary-text">
                            {new Date(customer.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </AdminTableCell>
                        <AdminTableActionCell>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCustomer(customer);
                              }}
                              className="admin-btn-icon"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCustomer(customer.id);
                              }}
                              className="admin-btn-icon"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </AdminTableActionCell>
                      </AdminTableRow>
                    ))}
                  </AdminTableBody>
                </AdminTable>
              )}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <MobileCardList 
                items={filteredCustomers.map(customer => ({
                  title: `${customer.first_name} ${customer.last_name}`,
                  subtitle: customer.email,
                  badge: {
                    text: 'Client',
                    variant: 'default'
                  }
                }))}
              />
            </div>

            {/* Pagination */}
            {filteredCustomers.length > 0 && (
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-500">
                  Affichage {Math.min((currentPage - 1) * 10 + 1, filteredCustomers.length)}-{Math.min(currentPage * 10, filteredCustomers.length)} sur {filteredCustomers.length} clients
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <button 
                    className="px-3 py-1 rounded-lg admin-btn-active"
                    disabled
                  >
                    {currentPage}
                  </button>
                  <button 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customer Form Modal */}
        {showForm && (
          <CustomerFormModal 
            initialData={viewingCustomer} 
            onSuccess={() => {
              // Refresh customers list
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
              }, 500);
            }}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </div>
  );
}