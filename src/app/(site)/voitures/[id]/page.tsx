import { notFound } from "next/navigation";
import { getCarById, getAllCars, Car } from "@/services/carService";
import CarDetailPage from "@/components/CarDetailPage";

interface CarPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const cars = await getAllCars();
  return cars.map((car) => ({
    id: car.id,
  }));
}

export default async function CarPage({ params }: CarPageProps) {
  const { id } = await params;
  const car = await getCarById(id);

  if (!car) {
    notFound();
  }

  return <CarDetailPage car={car} />;
}
