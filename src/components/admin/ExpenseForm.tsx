"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, X, Calendar, DollarSign, FileText, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import FormContainer from '@/components/admin/FormContainer';
import BaseForm from '@/components/admin/BaseForm';
import { AdminForm, AdminFormField, AdminSelectInput, AdminNumberInput, AdminDateInput, AdminTextareaInput, AdminFormActions, AdminFormSection, AdminFormSectionWithIcon } from './forms';
import { useFormContext } from './forms/FormContext';
import { Car } from '@/services/carService';
import { Expense, createExpense, updateExpense } from '@/services/expenseService';

const EXPENSE_CATEGORIES = [
  { id: "PONCTUELLE", label: "Ponctuelle", types: ["vidange", "pneu", "amende", "lavage", "réparation"] },
  { id: "RECURRENTE", label: "Récurrente (Fixe)", types: ["assurance", "vignette", "visite technique"] },
  { id: "CREDIT", label: "Crédit / Financement", types: ["crédit"] },
];

const ALL_TYPES = EXPENSE_CATEGORIES.flatMap(c => c.types);

interface ExpenseFormProps {
  initialData?: Expense | null;
  cars: Car[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ExpenseForm({ initialData, cars, onClose, onSuccess }: ExpenseFormProps) {
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken as string | undefined;
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    car_id: initialData?.car_id || "",
    type: initialData?.type || "",
    amount: initialData?.amount?.toString() || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    note: initialData?.note || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (data: Record<string, any>) => {
    setError("");

    if (!accessToken) {
      toast.error("Non autorisé");
      return;
    }

    if (!formData.car_id || !formData.type || !formData.amount || !formData.date) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);

    try {
      const expenseData = {
        car_id: formData.car_id,
        type: formData.type.toLowerCase(),
        amount: parseFloat(formData.amount),
        date: formData.date,
        note: formData.note,
      };

      let result;
      if (initialData) {
        result = await updateExpense(initialData.id, expenseData, accessToken);
      } else {
        result = await createExpense(expenseData, accessToken);
      }

      if (result.success) {
        toast.success(initialData ? "Charge modifiée avec succès" : "Charge créée avec succès");
        onSuccess();
      } else {
        setError(result.error || "Une erreur est survenue");
        toast.error(result.error || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Erreur lors de l'enregistrement");
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <FormContainer
      title={initialData ? "Modifier la Charge" : "Enregistrer une Charge"}
      subtitle={initialData ? "Modifier les informations de la charge" : "Remplissez le formulaire pour enregistrer une nouvelle charge"}
      variant="modal"
      size="md"
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
        <AdminForm onSubmit={handleSubmit}>
          {/* Section: Véhicule */}
          <AdminFormSection title="Véhicule" icon={<div className="w-5 h-5 bg-[var(--color-primary)] rounded" />}> 
            <AdminFormField
              name="car_id"
              label="Véhicule"
              required
              inputClassName="admin-input"
            >
              <select
                value={formData.car_id}
                onChange={(e) => setFormData({ ...formData, car_id: e.target.value })}
                className="appearance-none w-full h-full p-0 bg-transparent border-none focus:ring-0 focus:outline-none"
                required
              >
                <option value="">Sélectionner un véhicule</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.brand} {car.model}
                  </option>
                ))}
              </select>
            </AdminFormField>
          </AdminFormSection>

          {/* Section: Type de charge */}
          <AdminFormSection title="Type de charge" icon={<Tag size={20} className="text-[var(--color-primary)]" />}> 
            <AdminFormField
              name="type"
              label="Type de charge"
              required
              inputClassName="admin-input"
            >
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="appearance-none w-full h-full p-0 bg-transparent border-none focus:ring-0 focus:outline-none"
                required
              >
                <option value="">Sélectionner un type</option>
                {EXPENSE_CATEGORIES.map((category) => (
                  <optgroup key={category.id} label={category.label}>
                    {category.types.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </AdminFormField>
          </AdminFormSection>

          {/* Section: Montant et Date */}
          <AdminFormSection title="Montant et Date" icon={<DollarSign size={20} className="text-[var(--color-primary)]" />}> 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminFormField
                name="amount"
                label="Montant (DH)"
                required
                inputClassName="admin-input"
              >
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                  className="w-full h-full p-0 bg-transparent border-none focus:ring-0 focus:outline-none"
                />
              </AdminFormField>

              <AdminFormField
                name="date"
                label="Date"
                required
                inputClassName="admin-input"
              >
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="[color-scheme:dark] w-full h-full p-0 bg-transparent border-none focus:ring-0 focus:outline-none"
                  required
                />
              </AdminFormField>
            </div>
          </AdminFormSection>

          {/* Section: Note */}
          <AdminFormSection title="Note" icon={<FileText size={20} className="text-[var(--color-primary)]" />}> 
            <AdminFormField
              name="note"
              label="Note (facultatif)"
              inputClassName="admin-input normal-case resize-none"
            >
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full h-full p-0 bg-transparent border-none focus:ring-0 focus:outline-none"
                placeholder="Ajouter une note ou description..."
                rows={3}
              />
            </AdminFormField>
          </AdminFormSection>

          <AdminFormActions
            submitLabel={initialData ? "Enregistrer" : "Créer la charge"}
            cancelLabel="Annuler"
            onCancel={onClose}
            loading={loading}
            variant="default"
          />
        </AdminForm>
      </BaseForm>
    </FormContainer>
  );

  if (!mounted) return null;

  return modalContent;
}