import React, { useState } from 'react';
import { X, Plus, Trash2, User } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  role: string; // Protagonista, Aliado, Antagonista
  type: string; // Adulto, Adolescente, Criança
  alignment: string; // Neutro, Bom, Mal
  personality: string;
  appearance: string;
  color: string;
  image?: string;
}

interface CharacterManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CharacterManager({ isOpen, onClose }: CharacterManagerProps) {
  // Mock inicial baseado na imagem
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: '1', name: 'Yuki', role: 'Protagonista', type: 'Adolescente', alignment: 'Feminina',
      personality: 'Corajosa, curiosa e impulsiva',
      appearance: 'Cabelos curtos, jaqueta vermelha, olhar determinado',
      color: '#22c55e', image: '' 
    },
    {
      id: '2', name: 'Kenji', role: 'Aliado', type: 'Adulto', alignment: 'Masculino',
      personality: 'Calmo, estratégico, protetor',
      appearance: 'Cabelos pretos, óculos, casaco longo escuro',
      color: '#3b82f6', image: ''
    }
  ]);

  // Estado do Formulário
  const [formData, setFormData] = useState({
    name: '', role: 'Protagonista', type: 'Adulto', alignment: 'Neutro / Outro',
    personality: '', appearance: '', color: '#22c55e', image: ''
  });

  const handleAdd = () => {
    if (!formData.name) return;
    setCharacters([...characters, { ...formData, id: Date.now().toString() } as Character]);
    // Reset form
    setFormData({ ...formData, name: '', personality: '', appearance: '', image: '' });
  };

  const handleDelete = (id: string) => {
    setCharacters(characters.filter(c => c.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-[#0f141f] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0B0F19] rounded-t-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="text-orange-500" /> Gerenciar Personagens
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Lista de Cards (Topo da Imagem 1) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {characters.map((char) => (
                    <div key={char.id} className="bg-[#1a202e] rounded-xl p-4 border border-white/5 flex gap-4 relative group">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0`} style={{ backgroundColor: char.color }}>
                            {char.image ? <img src={char.image} className="w-full h-full rounded-full object-cover" /> : char.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-lg">{char.name}</h3>
                            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
                                {char.role} • {char.alignment} • {char.type}
                            </p>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-300"><strong className="text-slate-500">Personalidade:</strong> {char.personality}</p>
                                <p className="text-xs text-slate-300"><strong className="text-slate-500">Aparência:</strong> {char.appearance}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(char.id)} className="absolute top-2 right-2 p-2 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Formulário de Adição (Parte inferior da Imagem 1) */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/5 mt-6">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Adicionar novo personagem</h3>
                
                <div className="space-y-4">
                    {/* Linha 1: Nome */}
                    <input 
                        type="text" placeholder="Nome" 
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />

                    {/* Linha 2: Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select 
                            className="bg-[#0B0F19] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none appearance-none"
                            value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                        >
                            <option>Protagonista</option><option>Aliado</option><option>Antagonista</option>
                        </select>
                        <select 
                            className="bg-[#0B0F19] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none appearance-none"
                            value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                        >
                            <option>Adulto</option><option>Adolescente</option><option>Criança</option>
                        </select>
                        <select 
                            className="bg-[#0B0F19] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none appearance-none"
                            value={formData.alignment} onChange={e => setFormData({...formData, alignment: e.target.value})}
                        >
                            <option>Neutro / Outro</option><option>Masculino</option><option>Feminino</option>
                        </select>
                    </div>

                    {/* Linha 3: Text Areas */}
                    <textarea 
                        placeholder="Personalidade" rows={2}
                        value={formData.personality} onChange={e => setFormData({...formData, personality: e.target.value})}
                        className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                    />
                    <textarea 
                        placeholder="Aparência" rows={2}
                        value={formData.appearance} onChange={e => setFormData({...formData, appearance: e.target.value})}
                        className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                    />

                    {/* Linha 4: Cor e Imagem */}
                    <div className="flex gap-4 items-center">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-400">Cor (opcional)</span>
                            <input 
                                type="color" 
                                value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}
                                className="h-10 w-16 rounded bg-transparent cursor-pointer"
                            />
                        </div>
                        <div className="flex-1">
                            <span className="text-xs text-slate-400 block mb-1">Imagem / Avatar (URL opcional)</span>
                            <input 
                                type="text" placeholder="Cole aqui a URL da imagem (https://...)" 
                                value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
                                className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Botão Adicionar */}
                    <button 
                        onClick={handleAdd}
                        className="w-full bg-black hover:bg-gray-900 text-white font-bold py-4 rounded-xl border border-white/10 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}