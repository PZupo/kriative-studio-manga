
import React from 'react';

export default function ShareViewer({ shareViewDataUrl, setShareViewDataUrl }: any) {
  if (!shareViewDataUrl) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6">
      <div className="relative max-w-2xl w-full h-full flex flex-col items-center">
        <button 
          onClick={() => { setShareViewDataUrl(null); location.hash = ''; }}
          className="absolute top-0 right-0 text-white text-5xl p-4"
        >
          &times;
        </button>
        <img src={shareViewDataUrl} className="max-h-[85vh] object-contain rounded-3xl shadow-2xl border-4 border-white/20" />
        <h2 className="text-white font-black text-2xl mt-6">Página Compartilhada</h2>
      </div>
    </div>
  );
}
