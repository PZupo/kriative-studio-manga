import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GoogleAuthProvider, signInWithRedirect, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Lock, Mail, Key, ArrowRight, Loader2, Star } from "lucide-react";

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. CORREÇÃO DO LOOP: Se o usuário já existe (logou), sai daqui imediatamente.
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true); setError("");
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      // 2. CORREÇÃO DO BLOQUEIO: Usamos Redirect, não Popup.
      await signInWithRedirect(auth, provider);
    } catch (err: any) { 
        console.error(err); 
        setError("Erro ao iniciar login Google."); 
        setLoading(false); 
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Preencha e-mail e senha."); return; }
    setLoading(true); setError("");
    try { 
        await signInWithEmailAndPassword(auth, email, password);
        // O useEffect acima cuidará do redirecionamento
    } catch (err: any) { 
        console.error(err); 
        setError("Credenciais inválidas."); 
        setLoading(false);
    } 
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans text-white bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
      <div className="w-full max-w-md bg-[#0f141f] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-24 bg-orange-600 blur-[80px] opacity-60"></div>

        <div className="flex flex-col items-center text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(234,88,12,0.4)] border border-white/10">
            <Lock size={28} className="text-white drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1 tracking-tight">Acesso Restrito</h1>
          <p className="text-slate-400 text-sm font-medium">Entre para acessar o <strong className="text-orange-500">Studio Mangá</strong></p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4 relative z-10">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input 
              type="email" 
              placeholder="Seu e-mail de acesso" 
              className="w-full bg-[#05080f] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative group">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input 
              type="password" 
              placeholder="Sua senha secreta" 
              className="w-full bg-[#05080f] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center font-bold bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-black py-4 rounded-xl text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
          >
            {loading ? <Loader2 size={18} className="animate-spin text-orange-600"/> : <>ENTRAR AGORA <ArrowRight size={18}/></>}
          </button>
        </form>

        <div className="relative my-8 flex items-center justify-center z-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <span className="relative bg-[#0f141f] px-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">OU ACESSE COM</span>
        </div>

        <button onClick={handleGoogleLogin} className="w-full bg-[#1e2330] hover:bg-[#2a3040] border border-white/5 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-3 relative z-10">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12.5S6.42 23 12.1 23c5.83 0 8.84-4.15 8.84-8.83c0-.76-.15-1.07-.15-1.07Z"/></svg>
          Google Account
        </button>

        <div className="mt-8 text-center relative z-10">
          <p className="text-slate-500 text-xs mb-3 font-medium">Ainda não tem uma licença ativa?</p>
          <a href="https://afiliattuz.mydigitaldropp.com/checkout/studio-manga-pro" target="_blank" rel="noopener noreferrer" className="block w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-orange-900/30 transition-all flex items-center justify-center gap-2">
            <Star size={14} className="animate-pulse" /> QUERO COMPRAR ACESSO
          </a>
        </div>
      </div>
    </div>
  );
}