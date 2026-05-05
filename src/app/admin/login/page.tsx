"use client";

import LoginForm from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-[var(--color-primary)] uppercase tracking-tighter mb-2">
            MOHA<span className="text-[var(--color-secondary)]">DRIVE</span>
          </h2>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">
            Administration sécurisée
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg">
          <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-8 text-center uppercase tracking-tight">
            Connexion
          </h1>
          <LoginForm />
        </div>
        
        <p className="text-center mt-8 text-gray-400 text-xs uppercase tracking-widest">
          &copy; {new Date().getFullYear()} MOHADRIVE Location de Voitures. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
