"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Memoize the callback to avoid re-renders
  const handleMenuClick = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);
  
  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Prevent hydration issues and improve initial render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (status === "loading" || !isMounted) {
    return (
      <div className="flex h-screen bg-[var(--color-bg)] items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header session={session} onMenuClick={handleMenuClick} />
        <main className="flex-1 admin-scroll-container p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
