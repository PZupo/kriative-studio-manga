import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth();
  const location = useLocation();

  // 1. Loading robusto igual ao Social Studio
  if (loading || (user && !userData)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020305]">
        <div className="w-10 h-10 border-4 border-purple-600/20 border-t-purple-600 rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Sincronizando Permissões...</p>
      </div>
    );
  }

  // 2. Se não houver usuário, redireciona para o login interno do App
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Lógica de Acesso (Adaptada da V2 do Social Studio)
  const isOwner = user.email === 'pedrozuponeto@gmail.com';
// Mude de:

// Para:
const isAdmin = (userData as any)?.tier === 'Admin' || (userData as any)?.role === 'admin';  
  // Chaves do Mangá
  const mangaKeys = ['studio-manga', 'kriative-manga', 'manga-pro'];
  const hasAppExplicitlyActive = userData?.activeApps?.some((app: string) => mangaKeys.includes(app));

  // Se tiver qualquer saldo, libera (Igual ao Social Studio)
  const hasCredits = (userData?.credits || 0) > 0;

  const hasAccess = isOwner || isAdmin || hasAppExplicitlyActive || hasCredits;

  if (!hasAccess) {
    console.warn("Acesso negado para:", user.email);
    const HUB_URL = "https://afiliattuz.mydigitaldropp.com";
    window.location.href = `${HUB_URL}/#/dashboard?action=buy_credits`;
    return null;
  }

  return <>{children}</>;
}