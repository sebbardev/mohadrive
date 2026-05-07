"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
      
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: "Une erreur est survenue" }));
        throw new Error(data.message || "Une erreur est survenue");
      }

      const data = await response.json();
      setSuccess(true);
    } catch (err: any) {
      if (err.message === "Failed to fetch") {
        setError("Impossible de se connecter au serveur. Vérifiez que le backend Laravel est en cours d'exécution.");
      } else {
        setError(err.message || "Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600" size={40} />
              </div>
              
              <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-4 uppercase tracking-tight">
                Email envoyé !
              </h1>
              
              <p className="text-gray-600 mb-6">
                Un lien de réinitialisation a été envoyé à :
              </p>
              
              <p className="text-[var(--color-primary)] font-bold mb-6">
                {email}
              </p>
              
              <p className="text-gray-500 text-sm mb-8">
                Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
              </p>

              <Link 
                href="/admin/login"
                className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[#055a7a] text-white font-black uppercase tracking-wider py-4 px-8 rounded-2xl transition-all shadow-lg shadow-[var(--color-primary)]/20"
              >
                <ArrowLeft size={18} />
                Retour à la connexion
              </Link>
            </div>
          </div>
          
          <p className="text-center mt-8 text-gray-400 text-xs uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Premium Car Rental. Tous droits réservés.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-[var(--color-primary)] uppercase tracking-tighter mb-2">
            Premium <span className="text-[var(--color-secondary)]">Car Rental</span>
          </h2>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">
            Administration sécurisée
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg">
          <div className="mb-6">
            <Link 
              href="/admin/login"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors text-sm font-bold uppercase tracking-wider"
            >
              <ArrowLeft size={16} />
              Retour
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-2 text-center uppercase tracking-tight">
            Mot de passe oublié
          </h1>
          
          <p className="text-gray-500 text-sm text-center mb-8">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-bold text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Email Professionnel</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 text-[var(--color-text-main)] rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                  placeholder="admin@car-rental.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] hover:bg-[#055a7a] text-white font-black uppercase tracking-wider py-4 rounded-2xl transition-all shadow-lg shadow-[var(--color-primary)]/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  ENVOI EN COURS...
                </>
              ) : (
                "Envoyer le lien de réinitialisation"
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-gray-400 text-xs uppercase tracking-widest">
          &copy; {new Date().getFullYear()} MOHADRIVE Location de Voitures. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
