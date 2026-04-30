import React, { useState } from 'react';
import { X, FileDown, Archive } from 'lucide-react';

interface MagazineExporterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MagazineExporter({ isOpen, onClose }: MagazineExporterProps) {
  // Estado do formulário
  const [title, setTitle] = useState('Minha Revista');
  const [pageSize, setPageSize] = useState('A4');
  const [margin, setMargin] = useState(12);
  const [bleed, setBleed] = useState(0);
  const [pages, setPages] = useState([{ id: 1, name: 'Página 1', selected: true }]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0f141f] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Topo do Modal */}
        <div className="p-6 pb-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Salvar como Revista (PDF)</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Selecione as páginas, defina a ordem e salve tudo em um único PDF multipágina.</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Coluna Esquerda: Configurações */}
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Título</label>
                    <input 
                        type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-medium focus:border-orange-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Tamanho</label>
                    <select 
                        value={pageSize} onChange={(e) => setPageSize(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:border-orange-500 outline-none"
                    >
                        <option value="A4">Usar tamanho do Projeto (A4)</option>
                        <option value="A5">A5</option>
                        <option value="B5">B5 (Mangá Padrão)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Margem (px)</label>
                    <input 
                        type="number" value={margin} onChange={(e) => setMargin(Number(e.target.value))}
                        className="w-full bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:border-orange-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Sangria (px)</label>
                    <input 
                        type="number" value={bleed} onChange={(e) => setBleed(Number(e.target.value))}
                        className="w-full bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:border-orange-500 outline-none"
                    />
                </div>
                
                <p className="text-[10px] text-slate-500 leading-tight">Rodapé com numeração e título abreviado é adicionado automaticamente.</p>
            </div>

            {/* Coluna Direita: Seleção de Páginas */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Páginas</label>
                    <span className="text-[10px] text-slate-500">Selecionadas: {pages.filter(p => p.selected).length}</span>
                </div>
                
                <div className="bg-slate-50 dark:bg-[#0B0F19] rounded-lg border border-slate-200 dark:border-white/10 h-[220px] overflow-y-auto p-2">
                    {pages.map((page, index) => (
                        <div key={page.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded group">
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={page.selected}
                                    onChange={() => {
                                        const newPages = [...pages];
                                        newPages[index].selected = !newPages[index].selected;
                                        setPages(newPages);
                                    }}
                                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">{page.name}</span>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="w-6 h-6 flex items-center justify-center bg-white dark:bg-white/10 rounded border border-slate-200 dark:border-white/5 text-[10px]">↑</button>
                                <button className="w-6 h-6 flex items-center justify-center bg-white dark:bg-white/10 rounded border border-slate-200 dark:border-white/5 text-[10px]">↓</button>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-2">A ordem final segue a lista acima (apenas páginas selecionadas entram no PDF).</p>
            </div>
        </div>

        {/* Rodapé Botões */}
        <div className="p-6 pt-0 flex gap-3 mt-auto">
            <button className="flex-1 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-slate-200 text-white dark:text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                <FileDown size={18} /> Salvar PDF
            </button>
            <button className="flex-1 bg-white dark:bg-transparent border border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Archive size={18} /> Salvar CBZ (ZIP)
            </button>
            <button onClick={onClose} className="px-6 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 font-bold py-3 rounded-lg transition-colors">
                Fechar
            </button>
        </div>

      </div>
    </div>
  );
}