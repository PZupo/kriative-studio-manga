import React, { useState, useEffect, useMemo } from "react";
import { KChar } from "../../lib/types";
import { Filter, Save, X, RotateCcw, Trash2, UserPlus, Image as ImageIcon, Palette } from "lucide-react";

interface CharactersModalProps {
  characters: KChar[];
  setCharacters: (chars: KChar[]) => void;
  onClose: () => void;
  pushToast: (msg: string) => void;
  initialCharId?: string | null;
  lang: string;
}

const texts: Record<string, any> = {
  'pt-BR': { title: "Elenco", new_btn: "Novo Personagem", edit_title: "EDITAR FICHA", new_title: "NOVA FICHA", name_lbl: "Nome Completo", avatar_lbl: "Avatar URL (Imagem)", color_lbl: "Cor do Card", role_lbl: "Papel na Trama", age_lbl: "Faixa Etária", gender_lbl: "Gênero", eth_lbl: "Etnia / Origem", pers_lbl: "Personalidade & Traços", save_btn: "SALVAR ALTERAÇÕES", add_btn: "ADICIONAR AO ELENCO", cancel_btn: "Cancelar", clear_btn: "Limpar", all: "Todos", roles: { Protagonista: "Protagonista", Antagonista: "Antagonista", Coadjuvante: "Coadjuvante", Figurante: "Figurante" } },
  'en-US': { title: "Cast", new_btn: "New Character", edit_title: "EDIT PROFILE", new_title: "NEW PROFILE", name_lbl: "Full Name", avatar_lbl: "Avatar URL", color_lbl: "Card Color", role_lbl: "Role", age_lbl: "Age Group", gender_lbl: "Gender", eth_lbl: "Ethnicity / Origin", pers_lbl: "Personality & Traits", save_btn: "SAVE CHANGES", add_btn: "ADD TO CAST", cancel_btn: "Cancel", clear_btn: "Clear", all: "All", roles: { Protagonista: "Protagonist", Antagonista: "Antagonist", Coadjuvante: "Supporting", Figurante: "Extra" } },
  'es': { title: "Elenco", new_btn: "Nuevo Personaje", edit_title: "EDITAR PERFIL", new_title: "NUEVO PERFIL", name_lbl: "Nombre Completo", avatar_lbl: "URL Avatar", color_lbl: "Color de Tarjeta", role_lbl: "Papel", age_lbl: "Rango de Edad", gender_lbl: "Género", eth_lbl: "Etnia / Origen", pers_lbl: "Personalidad", save_btn: "GUARDAR CAMBIOS", add_btn: "AÑADIR AL ELENCO", cancel_btn: "Cancelar", clear_btn: "Limpiar", all: "Todos", roles: { Protagonista: "Protagonista", Antagonista: "Antagonista", Coadjuvante: "Secundario", Figurante: "Extra" } },
  'it': { title: "Cast", new_btn: "Nuovo Personaggio", edit_title: "MODIFICA PROFILO", new_title: "NUOVO PROFILO", name_lbl: "Nome Completo", avatar_lbl: "URL Avatar", color_lbl: "Colore Scheda", role_lbl: "Ruolo", age_lbl: "Fascia d'Età", gender_lbl: "Genere", eth_lbl: "Etnia / Origine", pers_lbl: "Personalità", save_btn: "SALVA MODIFICHE", add_btn: "AGGIUNGI AL CAST", cancel_btn: "Annulla", clear_btn: "Pulisci", all: "Tutti", roles: { Protagonista: "Protagonista", Antagonista: "Antagonista", Coadjuvante: "Non Protagonista", Figurante: "Comparsa" } },
  'de': { title: "Besetzung", new_btn: "Neuer Charakter", edit_title: "PROFIL BEARBEITEN", new_title: "NEUES PROFIL", name_lbl: "Vollständiger Name", avatar_lbl: "Avatar URL", color_lbl: "Kartenfarbe", role_lbl: "Rolle", age_lbl: "Altersgruppe", gender_lbl: "Geschlecht", eth_lbl: "Ethnie / Herkunft", pers_lbl: "Persönlichkeit", save_btn: "ÄNDERUNGEN SPEICHERN", add_btn: "ZUR BESETZUNG HINZUFÜGEN", cancel_btn: "Abbrechen", clear_btn: "Löschen", all: "Alle", roles: { Protagonista: "Protagonist", Antagonista: "Antagonist", Coadjuvante: "Nebenrolle", Figurante: "Statist" } },
  'fr': { title: "Casting", new_btn: "Nouveau Personnage", edit_title: "MODIFIER PROFIL", new_title: "NOUVEAU PROFIL", name_lbl: "Nom Complet", avatar_lbl: "URL Avatar", color_lbl: "Couleur Carte", role_lbl: "Rôle", age_lbl: "Tranche d'Âge", gender_lbl: "Genre", eth_lbl: "Ethnie / Origine", pers_lbl: "Personnalité", save_btn: "SAUVEGARDER", add_btn: "AJOUTER AU CASTING", cancel_btn: "Annuler", clear_btn: "Effacer", all: "Tous", roles: { Protagonista: "Protagoniste", Antagonista: "Antagoniste", Coadjuvante: "Secondaire", Figurante: "Figurant" } },
  'ko': { title: "출연진", new_btn: "새 캐릭터", edit_title: "프로필 편집", new_title: "새 프로필", name_lbl: "전체 이름", avatar_lbl: "아바타 URL", color_lbl: "카드 색상", role_lbl: "역할", age_lbl: "연령대", gender_lbl: "성별", eth_lbl: "민족 / 출신", pers_lbl: "성격 및 특징", save_btn: "변경 사항 저장", add_btn: "출연진에 추가", cancel_btn: "취소", clear_btn: "지우기", all: "전체", roles: { Protagonista: "주인공", Antagonista: "적대자", Coadjuvante: "조연", Figurante: "엑스트라" } }
};

const getRandomColor = () => {
  const colors = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function CharactersModal({ characters, setCharacters, onClose, pushToast, initialCharId, lang }: CharactersModalProps) {
  const t = texts[lang] || texts['pt-BR'];
  const [filterRole, setFilterRole] = useState<string>("Todos");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    role: "Protagonista",
    age: "Jovem",
    gender: "Neutro",
    ethnicity: "",
    personality: "",
    color: getRandomColor(),
    avatar: ""
  });

  useEffect(() => {
    if (initialCharId) {
      handleEdit(initialCharId);
    }
  }, [initialCharId]);

  const filteredCharacters = useMemo(() => {
    if (filterRole === "Todos") return characters;
    return characters.filter(c => c.role === filterRole);
  }, [characters, filterRole]);

  const handleEdit = (id: string) => {
    const char = characters.find(c => c.id === id);
    if (!char) return;
    const ethnicity = char.appearance?.replace("Etnia: ", "") || ""; 
    setEditingId(id);
    setForm({
      name: char.name,
      role: char.role,
      age: char.age || "Jovem",
      gender: char.gender || "Neutro",
      ethnicity: ethnicity,
      personality: char.personality || "",
      color: char.color || getRandomColor(),
      avatar: (char as any).avatar || ""
    });
  };

  const handleReset = () => {
    setEditingId(null);
    setForm({
      name: "",
      role: "Protagonista",
      age: "Jovem",
      gender: "Neutro",
      ethnicity: "",
      personality: "",
      color: getRandomColor(),
      avatar: ""
    });
  };

  const handleSave = () => {
    if (!form.name) return;
    const charData: KChar = {
      id: editingId || `c_${Date.now()}`,
      name: form.name,
      role: form.role as any,
      personality: form.personality,
      age: form.age,
      gender: form.gender,
      appearance: form.ethnicity ? `Etnia: ${form.ethnicity}` : "", 
      color: form.color,
      // @ts-ignore
      avatar: form.avatar 
    };

    if (editingId) {
      setCharacters(characters.map(c => c.id === editingId ? charData : c));
      pushToast("Personagem atualizado!");
    } else {
      setCharacters([...characters, charData]);
      pushToast("Personagem criado!");
    }
    handleReset();
  };

  const handleDelete = (id: string) => {
    setCharacters(characters.filter(x => x.id !== id));
    if (editingId === id) handleReset();
    pushToast("Personagem removido.");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 font-sans text-white">
      <div className="w-full max-w-5xl bg-[#1e293b] rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row h-[85vh] overflow-hidden">
        
        {/* LADO ESQUERDO: LISTA */}
        <div className="w-full md:w-1/3 border-r border-white/10 flex flex-col bg-[#161b22]">
            <div className="p-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-white mb-3">{t.title} ({characters.length})</h2>
                <div className="relative">
                    <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                    <select 
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-brand-orange appearance-none cursor-pointer"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="Todos">{t.all}</option>
                        <option value="Protagonista">{t.roles.Protagonista}</option>
                        <option value="Antagonista">{t.roles.Antagonista}</option>
                        <option value="Coadjuvante">{t.roles.Coadjuvante}</option>
                        <option value="Figurante">{t.roles.Figurante}</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 custom-scroll">
                {filteredCharacters.map(c => (
                    <div 
                        key={c.id} 
                        onClick={() => handleEdit(c.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl mb-2 cursor-pointer transition-all border ${editingId === c.id ? 'bg-brand-orange/20 border-brand-orange' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                    >
                        {/* --- CORREÇÃO 1: EXIBIR AVATAR NA LISTA --- */}
                        <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold text-white shadow-sm overflow-hidden border border-white/10" style={{ backgroundColor: c.color }}>
                            {(c as any).avatar ? (
                                <img src={(c as any).avatar} alt={c.name} className="w-full h-full object-cover" />
                            ) : (
                                c.name[0].toUpperCase()
                            )}
                        </div>
                        {/* ------------------------------------------ */}
                        
                        <div className="min-w-0 flex-1">
                            <div className="font-bold text-sm text-white truncate">{c.name}</div>
                            <div className="text-[10px] text-white/50 uppercase">{t.roles[c.role] || c.role}</div>
                        </div>
                        {editingId === c.id && <div className="w-2 h-2 rounded-full bg-brand-orange"></div>}
                    </div>
                ))}
            </div>
            
            <div className="p-4 border-t border-white/10">
                <button onClick={handleReset} className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 text-white/50 hover:text-white hover:border-brand-orange hover:bg-brand-orange/10 transition-all text-xs font-bold uppercase">
                    <UserPlus size={16} /> {t.new_btn}
                </button>
            </div>
        </div>

        {/* LADO DIREITO: FICHA */}
        <div className="flex-1 flex flex-col bg-[#0f141f] relative">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        {editingId ? t.edit_title : t.new_title}
                    </h3>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scroll">
                <div className="flex gap-6 mb-6">
                    {/* AVATAR GRANDE NO FORMULÁRIO */}
                    <div className="w-24 h-24 rounded-full border-4 border-white/10 bg-black flex items-center justify-center overflow-hidden shrink-0 relative group shadow-2xl">
                         {form.avatar ? (
                            <img src={form.avatar} className="w-full h-full object-cover" alt="Preview" />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold" style={{ backgroundColor: form.color }}>{form.name?.[0] || "?"}</div>
                         )}
                         {/* O input de cor foi movido para o grid abaixo para ficar mais visível */}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="space-y-1">
                             <label className="text-[10px] font-bold text-brand-orange uppercase">{t.name_lbl}</label>
                             <input name="name" value={form.name} onChange={handleChange} className="w-full bg-transparent border-b border-white/20 py-2 text-2xl font-bold text-white focus:border-brand-orange outline-none placeholder-white/10" placeholder="Ex: Yuki" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><ImageIcon size={10} /> {t.avatar_lbl}</label>
                                <input name="avatar" value={form.avatar} onChange={handleChange} className="w-full bg-[#161b22] rounded-lg px-3 py-2 text-xs text-white border border-white/10 focus:border-brand-orange outline-none" placeholder="https://..." />
                            </div>
                            
                            {/* --- CORREÇÃO 2: SELETOR DE COR VISÍVEL --- */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Palette size={10} /> {t.color_lbl}</label>
                                <div className="flex items-center gap-2 h-[34px] bg-[#161b22] rounded-lg px-2 border border-white/10">
                                    <input 
                                        type="color" 
                                        name="color" 
                                        value={form.color} 
                                        onChange={handleChange} 
                                        className="w-full h-6 cursor-pointer bg-transparent border-none outline-none p-0"
                                    />
                                </div>
                            </div>
                            {/* ------------------------------------------ */}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">{t.role_lbl}</label>
                        <select name="role" value={form.role} onChange={handleChange} className="w-full bg-[#161b22] text-white border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange">
                            <option value="Protagonista">{t.roles.Protagonista}</option>
                            <option value="Antagonista">{t.roles.Antagonista}</option>
                            <option value="Coadjuvante">{t.roles.Coadjuvante}</option>
                            <option value="Figurante">{t.roles.Figurante}</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">{t.age_lbl}</label>
                        <select name="age" value={form.age} onChange={handleChange} className="w-full bg-[#161b22] text-white border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange">
                             <option value="Criança">Criança / Child</option>
                             <option value="Jovem">Jovem / Young</option>
                             <option value="Adulto">Adulto / Adult</option>
                             <option value="Idoso">Idoso / Senior</option>
                             <option value="Imortal">Imortal</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">{t.gender_lbl}</label>
                        <select name="gender" value={form.gender} onChange={handleChange} className="w-full bg-[#161b22] text-white border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange">
                             <option value="Masculino">Masculino / Male</option>
                             <option value="Feminino">Feminino / Female</option>
                             <option value="Neutro">Neutro / Neutral</option>
                             <option value="Fluido">Fluido / Fluid</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">{t.eth_lbl}</label>
                        <input name="ethnicity" value={form.ethnicity} onChange={handleChange} className="w-full bg-[#161b22] text-white border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange" placeholder="..." />
                    </div>
                </div>

                <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase">{t.pers_lbl}</label>
                     <textarea rows={4} name="personality" value={form.personality} onChange={handleChange} className="w-full bg-[#161b22] text-white border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange resize-none" placeholder="..." />
                </div>
            </div>

            <div className="p-6 border-t border-white/10 bg-[#0f141f] flex gap-4">
                {editingId && (
                    <button onClick={() => handleDelete(editingId)} className="px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-colors">
                        <Trash2 size={20} />
                    </button>
                )}
                <button onClick={handleReset} className="px-6 py-3 border border-white/10 text-slate-400 hover:text-white hover:border-white/30 rounded-xl font-bold transition-colors flex items-center gap-2">
                    <RotateCcw size={18} /> {editingId ? t.cancel_btn : t.clear_btn}
                </button>
                <button onClick={handleSave} className="flex-1 bg-gradient-to-r from-brand-orange to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black uppercase tracking-wide rounded-xl py-3 shadow-lg flex items-center justify-center gap-2 transition-all">
                    <Save size={18} /> {editingId ? t.save_btn : t.add_btn}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}