export const dynamic = 'force-dynamic';
export const revalidate = 0;

import SiteClientLayout from "@/components/SiteClientLayout";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteClientLayout>{children}</SiteClientLayout>;
}
