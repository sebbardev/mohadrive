import { getCarById } from "@/services/carService";
import CarForm from "@/components/admin/CarForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface EditCarPageProps {
  params: {
    id: string;
  };
}

export default async function EditCarPage({ params }: EditCarPageProps) {
  const car = await getCarById(params.id);

  if (!car) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/voitures"
          className="p-2 bg-white border border-gray-200 text-gray-500 hover:text-[var(--color-primary)] rounded-xl transition-all shadow-sm"
        >
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Modifier le véhicule</h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest mt-1">
            {car.brand} {car.model} ({car.year})
          </p>
        </div>
      </div>

      <CarForm initialData={car} isEditing={true} />
    </div>
  );
}
