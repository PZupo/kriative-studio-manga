import React from 'react';
import { Project } from '../../lib/types';
import { X, Trash2, FolderOpen, Calendar, Clock } from 'lucide-react';

interface ProjectsModalProps {
  projects: Project[];
  onClose: () => void;
  onLoad: (id: string) => void;
  deleteProject: (id: string) => void;
  onSchedule: (id: string) => void; // NOVA PROP
}

export default function ProjectsModal({ projects, onClose, onLoad, deleteProject, onSchedule }: ProjectsModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 font-sans text-white animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-[#1e293b] rounded-2xl border border-white/10 shadow-2xl flex flex-col h-[85vh] overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#161b22]">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500/20 rounded-lg text-violet-400 border border-violet-500/30">
                    <FolderOpen size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white leading-none tracking-tight">Meus Projetos</h2>
                    <p className="text-xs text-slate-400 mt-1">Gerencie, carregue ou agende suas obras salvas.</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Grid de Projetos */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0f141f] custom-scroll">
            {projects.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4">
                    <div className="p-6 rounded-full bg-white/5 border border-white/5">
                        <FolderOpen size={48} strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-medium">Nenhum projeto salvo ainda.</p>
                    <p className="text-xs text-slate-700">Salve seu trabalho atual para vê-lo aqui.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((p) => (
                        <div key={p.id} className="group relative bg-[#161b22] rounded-2xl border border-white/10 overflow-hidden shadow-lg hover:border-brand-teal/50 hover:shadow-brand-teal/10 transition-all flex flex-col">
                            {/* Capa do Projeto */}
                            <div className="relative aspect-[16/9] overflow-hidden bg-black">
                                {p.cover ? (
                                    <img src={p.cover} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/10 text-4xl font-black">?</div>
                                )}
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
                                    <Clock size={10} />
                                    {new Date(p.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Info e Ações */}
                            <div className="p-4 flex flex-col gap-4 flex-1">
                                <div>
                                    <h3 className="font-bold text-white text-sm truncate">{p.title || "Sem Título"}</h3>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{p.pages.length} Páginas • {p.pages[0].theme.slice(0, 30)}...</p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mt-auto">
                                    <button 
                                        onClick={() => onLoad(p.id)} 
                                        className="col-span-1 py-2.5 bg-slate-800 hover:bg-brand-teal hover:text-white text-slate-300 rounded-xl text-[10px] font-black uppercase transition-all border border-white/5 flex flex-col items-center justify-center gap-1"
                                        title="Abrir no Editor"
                                    >
                                        <FolderOpen size={14} />
                                        Abrir
                                    </button>
                                    
                                    {/* BOTÃO AGENDAR (NOVO) */}
                                    <button 
                                        onClick={() => onSchedule(p.id)} 
                                        className="col-span-1 py-2.5 bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-300 rounded-xl text-[10px] font-black uppercase transition-all border border-white/5 flex flex-col items-center justify-center gap-1"
                                        title="Agendar Publicação"
                                    >
                                        <Calendar size={14} />
                                        Agendar
                                    </button>

                                    <button 
                                        onClick={() => deleteProject(p.id)} 
                                        className="col-span-1 py-2.5 bg-slate-800 hover:bg-red-500 hover:text-white text-slate-300 rounded-xl text-[10px] font-black uppercase transition-all border border-white/5 flex flex-col items-center justify-center gap-1"
                                        title="Excluir Projeto"
                                    >
                                        <Trash2 size={14} />
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        {/* Rodapé */}
        <div className="p-4 border-t border-white/10 bg-[#161b22] flex justify-between items-center text-[10px] text-slate-500 font-medium uppercase tracking-wider">
            <span>Total: {projects.length} projetos</span>
            <span>Armazenamento Local</span>
        </div>
      </div>
    </div>
  );
}