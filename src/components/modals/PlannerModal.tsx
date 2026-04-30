import React, { useState } from 'react';
import { X, Calendar, Clock, Share2, CheckCircle2, Globe, Instagram, Twitter } from 'lucide-react';

interface PlannerModalProps {
  onClose: () => void;
}

export default function PlannerModal({ onClose }: PlannerModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Estado do Formulário
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState("18:00");
  const [platforms, setPlatforms] = useState<string[]>([]);

  const togglePlatform = (p: string) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleSchedule = () => {
    setLoading(true);
    // Simula uma chamada de API para agendar
    setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        // Fecha após 1.5s de sucesso
        setTimeout(onClose, 1500);
    }, 1500);
  };

  if (success) {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-[#1e293b] border border-green-500/30 w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-4 animate-bounce">
                    <CheckCircle2 size={32} />
                </div>
                <h2 className="text-xl font-black text-white mb-1">Agendado!</h2>
                <p className="text-slate-400 text-xs">Sua publicação foi programada com sucesso.</p>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 font-sans text-white animate-in zoom-in-95 duration-200">
      <div className="w-full max-w-lg bg-[#1e293b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Cabeçalho */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#161b22]">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 border border-purple-500/30">
                    <Share2 size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white leading-none tracking-tight">Planner de Publicação</h2>
                    <p className="text-xs text-slate-400 mt-1">Agende o lançamento do seu capítulo.</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Corpo do Formulário */}
        <div className="p-6 space-y-6 bg-[#0f141f]">
            
            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Calendar size={12} /> Data
                    </label>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none transition-colors"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Clock size={12} /> Horário
                    </label>
                    <input 
                        type="time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Seleção de Plataformas */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Destinos de Publicação</label>
                <div className="grid grid-cols-2 gap-3">
                    {['Webtoon', 'Tapas', 'Instagram', 'Twitter / X'].map((plat) => (
                        <button 
                            key={plat}
                            onClick={() => togglePlatform(plat)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                                platforms.includes(plat) 
                                ? 'bg-brand-teal/20 border-brand-teal text-brand-teal shadow-[0_0_15px_rgba(45,212,191,0.2)]' 
                                : 'bg-[#161b22] border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                            }`}
                        >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${platforms.includes(plat) ? 'border-brand-teal bg-brand-teal' : 'border-slate-500'}`}>
                                {platforms.includes(plat) && <CheckCircle2 size={10} className="text-[#0f141f]" />}
                            </div>
                            {plat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Legenda */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Legenda / Notas do Capítulo</label>
                <textarea 
                    rows={3}
                    placeholder="Escreva algo sobre este lançamento..." 
                    className="w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none resize-none transition-colors placeholder:text-slate-600"
                />
            </div>

        </div>

        {/* Rodapé */}
        <div className="p-6 pt-4 border-t border-white/10 bg-[#161b22] flex gap-3">
            <button onClick={onClose} className="px-6 py-3.5 border border-white/10 hover:bg-white/5 text-white/70 hover:text-white font-bold rounded-xl transition-colors text-xs uppercase tracking-wide">
                Cancelar
            </button>
            <button 
                onClick={handleSchedule}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wide hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {loading ? (
                 <>Agendando...</>
               ) : (
                 <>
                    <Calendar size={16} />
                    Agendar Publicação
                 </>
               )}
            </button>
        </div>
      </div>
    </div>
  );
}