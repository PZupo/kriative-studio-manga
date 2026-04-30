import React, { useState, useEffect } from "react";
import { X, Trash2, Download, Image as ImageIcon, Calendar } from "lucide-react";

interface GalleryModalProps {
  onClose: () => void;
}

interface SnapshotItem {
  key: string;
  dataUrl: string;
  date: number;
}

export default function GalleryModal({ onClose }: GalleryModalProps) {
  const [snapshots, setSnapshots] = useState<SnapshotItem[]>([]);

  // 1. Carrega as imagens salvas no LocalStorage ao abrir
  useEffect(() => {
    const loaded: SnapshotItem[] = [];
    // Varre o LocalStorage procurando chaves que começam com "share_"
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("share_")) {
        const dataUrl = localStorage.getItem(key);
        if (dataUrl) {
          // Extrai o timestamp da chave "share_123456789"
          const dateStr = key.replace("share_", "");
          const date = parseInt(dateStr) || Date.now();
          loaded.push({ key, dataUrl, date });
        }
      }
    }
    // Ordena do mais recente para o mais antigo
    setSnapshots(loaded.sort((a, b) => b.date - a.date));
  }, []);

  const handleDelete = (key: string) => {
    localStorage.removeItem(key);
    setSnapshots(prev => prev.filter(s => s.key !== key));
  };

  const handleDownload = (dataUrl: string, date: number) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `snapshot_${date}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 font-sans text-white animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-[#1e293b] rounded-2xl border border-white/10 shadow-2xl flex flex-col h-[85vh] overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#161b22]">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 border border-blue-500/30">
                    <ImageIcon size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white leading-none tracking-tight">Galeria de Snapshots</h2>
                    <p className="text-xs text-slate-400 mt-1">Imagens salvas temporariamente no seu navegador.</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Grade de Imagens */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0f141f] custom-scroll">
            {snapshots.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4">
                    <div className="p-6 rounded-full bg-white/5 border border-white/5">
                        <ImageIcon size={48} strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-medium">Nenhum snapshot salvo ainda.</p>
                    <p className="text-xs text-slate-700">Use o botão "Snapshot" no editor para salvar versões.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {snapshots.map((snap) => (
                        <div key={snap.key} className="group relative bg-black rounded-xl border border-white/10 overflow-hidden shadow-lg hover:border-brand-orange/50 transition-all">
                            {/* Aspect Ratio Wrapper */}
                            <div className="aspect-[7/10] w-full relative">
                                <img src={snap.dataUrl} alt="Snapshot" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                
                                {/* Overlay de Ações */}
                                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3 p-4 backdrop-blur-sm">
                                    <div className="text-[10px] font-mono text-white/70 mb-2 flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                                        <Calendar size={10} />
                                        {new Date(snap.date).toLocaleDateString()} {new Date(snap.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleDownload(snap.dataUrl, snap.date)}
                                            className="p-3 bg-white text-slate-900 rounded-full hover:scale-110 transition-transform shadow-lg hover:bg-blue-50"
                                            title="Baixar PNG"
                                        >
                                            <Download size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(snap.key)}
                                            className="p-3 bg-red-500/20 text-red-500 border border-red-500/50 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                                            title="Excluir"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Rodapé */}
        <div className="p-4 border-t border-white/10 bg-[#161b22] flex justify-between items-center text-[10px] text-slate-500 font-medium uppercase tracking-wider">
            <span>Total: {snapshots.length} imagens</span>
            <span>Armazenamento Local (Cache)</span>
        </div>
        
        <style>{`
            .custom-scroll::-webkit-scrollbar { width: 6px; }
            .custom-scroll::-webkit-scrollbar-track { background: #0f141f; }
            .custom-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
            .custom-scroll::-webkit-scrollbar-thumb:hover { background: #475569; }
        `}</style>
      </div>
    </div>
  );
}