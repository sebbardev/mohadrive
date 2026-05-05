"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn('credentials', {
        email: formData.email.toLowerCase(),
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Identifiants invalides");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-bold text-center">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
        />
      </div>

      {/* Mot de passe */}
      <div>
        <label htmlFor="password" className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
          Mot de passe <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Connexion...
          </>
        ) : (
          "Accéder au Dashboard"
        )}
      </button>

      <div className="text-center pt-4 border-t border-gray-100">
        <Link
          href="/admin/forgot-password"
          className="text-sm text-[var(--color-primary)] hover:text-[#055a7a] font-bold transition-colors"
        >
          Mot de passe oublié ?
        </Link>
      </div>
    </form>
  );
}