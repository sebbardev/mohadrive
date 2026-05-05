export const dynamic = 'force-dynamic';
export const revalidate = 0;

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - MOHADRIVE Location de Voitures",
  description: "Panneau d'administration MOHADRIVE Location de Voitures",
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
