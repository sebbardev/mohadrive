"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!token || !email) {
      router.push("/admin/login");
    }
  }, [token, email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      setLoading(false);
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mohadrive.com/api";
      
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email: email?.toLowerCase(),
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: "Une erreur est survenue" }));
        throw new Error(data.message || "Une erreur est survenue");
      }

      const data = await response.json();
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/admin/login");
      }, 3000);
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
                Succès !
              </h1>
              
              <p className="text-gray-600 mb-6">
                Votre mot de passe a été réinitialisé avec succès.
              </p>
              
              <p className="text-gray-500 text-sm mb-8">
                Vous allez être redirigé vers la page de connexion...
              </p>

              <Link 
                href="/admin/login"
                className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[#055a7a] text-white font-black uppercase tracking-wider py-4 px-8 rounded-2xl transition-all shadow-lg shadow-[var(--color-primary)]/20"
              >
                Se connecter maintenant
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
          <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-2 text-center uppercase tracking-tight">
            Nouveau mot de passe
          </h1>
          
          <p className="text-gray-500 text-sm text-center mb-8">
            Créez un nouveau mot de passe pour votre compte
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-bold text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 text-[var(--color-text-main)] rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                  placeholder="••••••••"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 text-[var(--color-text-main)] rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                  placeholder="••••••••"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-blue-700 text-xs font-bold">
                💡 Le mot de passe doit contenir au moins 8 caractères
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] hover:bg-[#055a7a] text-white font-black uppercase tracking-wider py-4 rounded-2xl transition-all shadow-lg shadow-[var(--color-primary)]/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  RÉINITIALISATION...
                </>
              ) : (
                "Réinitialiser le mot de passe"
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
