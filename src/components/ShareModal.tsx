
import React from 'react';

export default function ShareModal({ lastShareId, onClose, pushToast }: any) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 text-center">
        <h2 className="text-2xl font-black mb-4">Compartilhar</h2>
        <p className="text-sm opacity-60 mb-6">O link para esta página foi gerado:</p>
        <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-xl font-mono text-xs mb-6 truncate">
          {`kriative.studio/#/share/${lastShareId}`}
        </div>
        <button 
          onClick={() => { navigator.clipboard.writeText(`kriative.studio/#/share/${lastShareId}`); pushToast("Link copiado!"); }}
          className="w-full py-4 bg-brand-teal text-white rounded-2xl font-bold mb-3"
        >
          Copiar Link
        </button>
        <button onClick={onClose} className="w-full py-3 opacity-50 font-bold">Voltar</button>
      </div>
    </div>
  );
}
