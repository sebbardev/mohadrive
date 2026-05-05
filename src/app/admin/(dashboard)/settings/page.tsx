import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import ProfileForm from "@/components/admin/ProfileForm";
import { Shield, Bell, Globe } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) return null;

  const user = {
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    profileImage: (session.user as any).profileImage ?? null,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="admin-header-title">
            Paramètres <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">du Système</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] rounded-full" />
            <p className="admin-header-subtitle">Gérez votre compte et les préférences du site</p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="admin-card group admin-card-hover">
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-bg)] rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
        
        <div className="flex items-center gap-3 mb-8 relative z-10">
          <div className="admin-icon-container">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="admin-section-title">Profil Administrateur</h2>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">Informations personnelles et sécurité</p>
          </div>
        </div>
        
        <ProfileForm user={user} />
      </div>

      {/* Upcoming Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="admin-card relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12" />
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="admin-icon-container">
              <Globe className="text-blue-500" size={24} />
            </div>
            <div>
              <h3 className="admin-section-title text-lg">Configuration du Site</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-0.5 w-6 bg-blue-400 rounded-full" />
                <p className="text-[8px] text-blue-400 font-black uppercase tracking-[0.2em]">À venir</p>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest relative z-10">
            Gestion des coordonnées, réseaux sociaux et mentions légales.
          </p>
          
          {/* Coming soon badge */}
          <div className="absolute top-6 right-6 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl">
            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Bientôt</span>
          </div>
        </div>

        <div className="admin-card relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-12 -mt-12" />
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="admin-icon-container">
              <Bell className="text-purple-500" size={24} />
            </div>
            <div>
              <h3 className="admin-section-title text-lg">Notifications Email</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-0.5 w-6 bg-purple-400 rounded-full" />
                <p className="text-[8px] text-purple-400 font-black uppercase tracking-[0.2em]">À venir</p>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest relative z-10">
            Personnalisation des templates d'emails automatiques.
          </p>
          
          {/* Coming soon badge */}
          <div className="absolute top-6 right-6 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-xl">
            <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest">Bientôt</span>
          </div>
        </div>
      </div>
    </div>
  );
}
