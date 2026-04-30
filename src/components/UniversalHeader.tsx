import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAuth, signOut } from "firebase/auth";
import { 
  Moon, Sun, Globe, ChevronRight, ChevronDown, 
  ArrowLeft, Check, LogOut, Coins
} from 'lucide-react';
import i18n from '../i18n';
// Hook simples para persistir estado local (Header independente)
function useLocalState(key: string, initial: any) {
    const [value, setValue] = useState(() => {
        try { const item = window.localStorage.getItem(key); return item ? JSON.parse(item) : initial; } 
        catch { return initial; }
    });
    const setValueWrap = (val: any) => {
        try { setValue(val); window.localStorage.setItem(key, JSON.stringify(val)); } catch {}
    };
    return [value, setValueWrap];
}

// Traduções internas do Header para os 8 idiomas
const headerTranslations: Record<string, any> = {
  'pt-BR': { welcome: "O que vamos desenhar hoje?", credits: "CRÉDITOS", plan: "PLANO VIGENTE", active: "ATIVO", inactive: "INATIVO", manage: "GERENCIAR PLANO" },
  'en-US': { welcome: "What will we draw today?", credits: "CREDITS", plan: "CURRENT PLAN", active: "ACTIVE", inactive: "INACTIVE", manage: "MANAGE PLAN" },
  'es': { welcome: "¿Qué dibujaremos hoy?", credits: "CRÉDITOS", plan: "PLAN ACTUAL", active: "ACTIVO", inactive: "INACTIVO", manage: "GESTIONAR PLAN" },
  'it': { welcome: "Cosa disegniamo oggi?", credits: "CREDITI", plan: "PIANO ATTUALE", active: "ATTIVO", inactive: "INATTIVO", manage: "GESTISCI PIANO" },
  'de': { welcome: "Was zeichnen wir heute?", credits: "KREDITE", plan: "AKTUELLER PLAN", active: "AKTIV", inactive: "INAKTIV", manage: "PLAN VERWALTEN" },
  'fr': { welcome: "Que allons-nous dessiner ?", credits: "CRÉDITS", plan: "PLAN ACTUEL", active: "ACTIF", inactive: "INACTIF", manage: "GÉRER LE PLAN" },
  'ko': { welcome: "오늘 무엇을 그릴까요?", credits: "크레딧", plan: "현재 요금제", active: "활성", inactive: "비활성", manage: "요금제 관리" },
  'pt-PT': { welcome: "O que vamos desenhar hoje?", credits: "CRÉDITOS", plan: "PLANO VIGENTE", active: "ATIVO", inactive: "INATIVO", manage: "GERENCIAR PLANO" }
};

interface UniversalHeaderProps {
  onOpenPlans?: () => void;
}

export default function UniversalHeader({ onOpenPlans }: UniversalHeaderProps) {
  const { userData, loading } = useAuth();
  
  // --- Estados Locais ---
const [lang, setLang] = useLocalState('kriative_lang', 'pt-BR');
  const [isDark, setIsDark] = useLocalState('k_theme_mode', true);
  const [langOpen, setLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // --- Lista de Idiomas do Ecossistema Afiliattuz (agora com 8) ---
  const languages = [
    { code: 'pt-BR', label: 'PORTUGUÊS (BR)' },
    { code: 'pt-PT', label: 'PORTUGUÊS (PT)' },
    { code: 'en-US', label: 'ENGLISH' },
    { code: 'es', label: 'ESPAÑOL' },
    { code: 'it', label: 'ITALIANO' },
    { code: 'de', label: 'DEUTSCH' },
    { code: 'fr', label: 'FRANÇAIS' },
    { code: 'ko', label: 'KOREAN' }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) { root.classList.add('dark'); } else { root.classList.remove('dark'); }
  }, [isDark]);

  const handleLogout = async () => { try { await signOut(getAuth()); } catch (error) { console.error(error); } };

  // Dados do Usuário
  const user = (userData as any) || {};
  const displayName = user.displayName || 'Criador';
  const displayEmail = user.email || '';
  const photoURL = user.photoURL;
  const credits = user.credits || 0;
  const planName = (user.tier || user.billing?.plan || 'Free').toUpperCase();
  const initial = displayName.charAt(0).toUpperCase();
  
  // Textos
  const t = headerTranslations[lang] || headerTranslations['pt-BR'];
  
  // Tema
  const theme = { text: 'text-orange-500', badge: 'bg-orange-950 text-orange-400 border-orange-900', border: 'border-orange-500/30', from: 'from-orange-600', to: 'to-red-600' };
  const isActive = credits > 0 || planName !== 'FREE';
  const statusBadge = isActive ? theme.badge : 'bg-red-100 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900';

  if (loading) return <div className="h-[220px] w-full animate-pulse bg-white/5 rounded-2xl mb-6"></div>;

  return (
    <section className="w-full mb-6 font-sans transition-colors duration-300">
        <div className="flex flex-col xl:flex-row items-stretch gap-4 xl:gap-6 w-full min-h-[220px]">
          
          {/* LOGO */}
          <div className={`w-full xl:w-[280px] shrink-0 rounded-2xl border ${theme.border} bg-gradient-to-br ${theme.from} ${theme.to} flex flex-col justify-center relative overflow-hidden shadow-2xl p-6`}>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-20"></div>
              <div className="relative z-10 flex flex-col h-full items-center justify-center text-center w-full">
                <div className="mb-4 w-full flex items-center justify-center">
                   <img src="/studio-manga-header.png" alt="Studio Mangá" className="w-full h-auto max-h-24 object-contain drop-shadow-lg" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<h1 class="text-3xl font-black text-white italic tracking-tighter">STUDIO<br/>MANGÁ</h1>`; }} />
                </div>
                <h2 className="text-lg font-black text-white leading-tight tracking-tight uppercase">STUDIO MANGÁ</h2>
                <p className="text-[10px] text-white/80 mt-2 font-medium border-t border-white/20 pt-2 w-full uppercase tracking-wider">EDITOR VISUAL & IA</p>
              </div>
          </div>

          {/* INFO CENTRAL */}
          <div className="flex-1 min-w-0 bg-white dark:bg-[#0B0F19] rounded-2xl p-3 flex flex-col justify-between relative shadow-xl transition-colors duration-300 border border-gray-200 dark:border-white/5">
            <div className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 mb-4">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-0.5">Olá, {displayName.split(' ')[0]}</span>
                    <h3 className="text-sm md:text-base font-black text-slate-800 dark:text-white leading-none tracking-tight">{t.welcome}</h3>
                </div>
                
                <div className="flex items-center gap-3">
                    
                    {/* --- BLOCO SELETOR DE IDIOMA --- */}
                    <div className="relative w-36" ref={langMenuRef}>
                         <button onClick={() => setLangOpen(!langOpen)} className="flex items-center justify-between w-full h-9 px-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg text-[10px] font-bold text-slate-700 dark:text-white uppercase hover:border-orange-500 transition-colors">
                             <div className="flex items-center gap-2">
                                <Globe size={14} className="text-slate-400"/>
                                <span className="truncate">{languages.find(l => l.code === lang)?.label || 'IDIOMA'}</span>
                             </div>
                             <ChevronDown size={12} className={`text-slate-400 transition-transform ${langOpen ? 'rotate-180' : ''}`}/>
                         </button>
                         {langOpen && (
                             <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1 max-h-60 overflow-y-auto custom-scroll">
                                 {languages.map((l) => (
                                    <button 
                                        key={l.code} 
                                        onClick={() => { setLang(l.code); setLangOpen(false); }} 
                                        className="w-full flex items-center justify-between px-4 py-2.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-500/20 hover:text-orange-700 dark:hover:text-orange-300 text-left transition-colors"
                                    >
                                        {l.label} 
                                        {lang === l.code && <Check size={12} className="text-orange-500" />}
                                    </button>
                                 ))}
                             </div>
                         )}
                    </div>
                    {/* ----------------------------------------- */}

                    <div className="w-[1px] h-4 bg-gray-300 dark:bg-white/10"></div>
                    
                    <button onClick={() => setIsDark(!isDark)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-white transition-all shadow-sm hover:shadow-md">
                        {isDark ? <Moon size={16} /> : <Sun size={16} />}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="bg-gray-50 dark:bg-[#050608] rounded-xl p-4 border border-gray-200 dark:border-white/5 flex flex-col justify-center relative overflow-hidden group">
                  <div className={`absolute right-0 top-0 p-3 opacity-10 ${theme.text} group-hover:scale-110 transition-transform`}>
                      <Coins size={40} />
                  </div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold z-10">{t.credits}</span>
                  <div className="flex items-end gap-1 z-10">
                      <span className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">{credits}</span>
                      <span className={`text-[10px] font-bold mb-1 ${theme.text}`}>UNID.</span>
                  </div>
              </div>
              <div className="bg-gray-50 dark:bg-[#050608] rounded-xl p-4 border border-gray-200 dark:border-white/5 flex flex-col justify-center items-end text-right transition-colors">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">{t.plan}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wide border flex items-center gap-1 ${statusBadge}`}>
                        {isActive ? t.active : t.inactive}
                    </span>
                </div>
                <span className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none mb-1">{planName}</span>
                <button onClick={onOpenPlans} className={`text-[9px] ${theme.text} hover:opacity-80 transition-opacity cursor-pointer font-bold uppercase tracking-wider flex items-center gap-1 hover:underline`}>
                    {t.manage} <ChevronRight size={10} className="inline-block" />
                </button>
              </div>
            </div>
          </div>

          {/* PERFIL */}
          <div className="w-full xl:w-[280px] shrink-0 bg-white dark:bg-[#0B0F19] rounded-2xl p-3 flex flex-col justify-between shadow-xl transition-colors duration-300 border border-gray-200 dark:border-white/5">
            <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h2 className="text-base md:text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Acesso Rápido</h2>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#0B0F19] p-3 rounded-xl border border-gray-200 dark:border-white/5 mb-3 transition-colors">
                  {photoURL ? (
                      <img src={photoURL} alt="User" className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                  ) : (
                      <div className={`w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br ${theme.from} ${theme.to} flex items-center justify-center text-sm font-black text-white border border-white/10 shadow-inner`}>{initial}</div>
                  )}
                  <div className="overflow-hidden min-w-0 flex flex-col justify-center">
                    <span className="text-[8px] uppercase text-slate-500 font-bold leading-none mb-1">MANGAKÁ</span>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-none mb-0.5">{displayName}</p>
                    <p className="text-[9px] text-slate-500 truncate">{displayEmail}</p>
                  </div>
                </div>
            </div>
            <div className="mt-auto flex flex-col gap-2">
                <a href='https://afiliattuz.mydigitaldropp.com/dashboard' className="w-full inline-flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold uppercase px-4 py-3.5 transition-all border border-gray-200 dark:border-white/10 shadow-lg group">
                    <ArrowLeft size={14} className="mr-2 text-slate-400 group-hover:text-orange-500 transition-colors" />
                    Voltar ao HUB
                </a>
                <button onClick={handleLogout} className="w-full inline-flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase px-4 py-2.5 transition-all border border-red-200 dark:border-red-500/20">
                    <LogOut size={14} className="mr-2" />
                    Sair / Logout
                </button>
            </div>
          </div>
        </div>
        <style>{`.custom-scroll::-webkit-scrollbar { width: 4px; } .custom-scroll::-webkit-scrollbar-track { background: transparent; } .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }`}</style>
    </section>
  );
}