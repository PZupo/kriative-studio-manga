import React from "react";
import { FileDown, X } from "lucide-react";

interface MagazineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  lang: string; // RECEBE O IDIOMA
}

const texts: Record<string, any> = {
  'pt-BR': { title: "Salvar como Revista (PDF)", desc: "Configure a saída para impressão.", title_lbl: "Título da Obra", size_lbl: "Tamanho & Formato", margin_lbl: "Margem (mm)", bleed_lbl: "Sangria (mm)", preview: "Preview", all_pages: "Todas as páginas", cancel_btn: "Cancelar", download_btn: "BAIXAR ARQUIVO PDF" },
  'en-US': { title: "Save as Magazine (PDF)", desc: "Configure output for print.", title_lbl: "Work Title", size_lbl: "Size & Format", margin_lbl: "Margin (mm)", bleed_lbl: "Bleed (mm)", preview: "Preview", all_pages: "All pages", cancel_btn: "Cancel", download_btn: "DOWNLOAD PDF" },
  'es': { title: "Guardar como Revista (PDF)", desc: "Configurar salida para impresión.", title_lbl: "Título de la Obra", size_lbl: "Tamaño y Formato", margin_lbl: "Margen (mm)", bleed_lbl: "Sangrado (mm)", preview: "Vista Previa", all_pages: "Todas las páginas", cancel_btn: "Cancelar", download_btn: "DESCARGAR PDF" },
  'it': { title: "Salva come Rivista (PDF)", desc: "Configura uscita per la stampa.", title_lbl: "Titolo dell'Opera", size_lbl: "Dimensioni e Formato", margin_lbl: "Margine (mm)", bleed_lbl: "Abbondanza (mm)", preview: "Anteprima", all_pages: "Tutte le pagine", cancel_btn: "Annulla", download_btn: "SCARICA PDF" },
  'de': { title: "Als Magazin Speichern (PDF)", desc: "Ausgabe für Druck konfigurieren.", title_lbl: "Titel des Werkes", size_lbl: "Größe & Format", margin_lbl: "Rand (mm)", bleed_lbl: "Beschnitt (mm)", preview: "Vorschau", all_pages: "Alle Seiten", cancel_btn: "Abbrechen", download_btn: "PDF HERUNTERLADEN" },
  'fr': { title: "Enregistrer en Magazine (PDF)", desc: "Configurer la sortie pour l'impression.", title_lbl: "Titre de l'Œuvre", size_lbl: "Taille et Format", margin_lbl: "Marge (mm)", bleed_lbl: "Fond perdu (mm)", preview: "Aperçu", all_pages: "Toutes les pages", cancel_btn: "Annuler", download_btn: "TÉLÉCHARGER PDF" },
  'ko': { title: "잡지로 저장 (PDF)", desc: "인쇄용 출력을 구성합니다.", title_lbl: "작품 제목", size_lbl: "크기 및 형식", margin_lbl: "여백 (mm)", bleed_lbl: "도련 (mm)", preview: "미리보기", all_pages: "모든 페이지", cancel_btn: "취소", download_btn: "PDF 다운로드" }
};

export default function MagazineModal({ isOpen, onClose, onExport, lang }: MagazineModalProps) {
  if (!isOpen) return null;
  const t = texts[lang] || texts['pt-BR'];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 font-sans text-white">
      <div className="w-full max-w-3xl bg-[#1e293b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Cabeçalho */}
        <div className="p-6 pb-4 border-b border-white/10 flex justify-between items-start">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-1">
                    <span className="w-2 h-6 bg-brand-orange rounded-full"></span>
                    {t.title}
                </h2>
                <p className="text-white/50 text-sm ml-5">{t.desc}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white">
                <X size={20} />
            </button>
        </div>

        {/* Corpo */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
                <div>
                    <label className="text-[10px] text-white/40 uppercase font-bold block mb-1.5 ml-1">{t.title_lbl}</label>
                    <input type="text" defaultValue="Minha Revista" className="w-full bg-[#0f141f] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-brand-orange outline-none placeholder-white/30 transition-colors font-medium" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-white/40 uppercase font-bold block ml-1">{t.size_lbl}</label>
                    <select className="w-full bg-[#0f141f] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none cursor-pointer hover:bg-white/5 transition-colors font-medium appearance-none">
                        <option>A4 (210x297mm) - Padrão</option>
                        <option>B5 (JIS) - Mangá Clássico</option>
                        <option>Digital (Webtoon/Tablet)</option>
                    </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                      <label className="text-[10px] text-white/40 uppercase font-bold block mb-1.5 ml-1 text-center">{t.margin_lbl}</label>
                      <input type="number" defaultValue="12" className="w-full bg-[#0f141f] border border-white/10 rounded-lg px-3 py-3 text-white font-bold text-center focus:border-brand-orange outline-none transition-colors" />
                  </div>
                  <div className="flex-1">
                      <label className="text-[10px] text-white/40 uppercase font-bold block mb-1.5 ml-1 text-center">{t.bleed_lbl}</label>
                      <input type="number" defaultValue="3" className="w-full bg-[#0f141f] border border-white/10 rounded-lg px-3 py-3 text-white font-bold text-center focus:border-brand-orange outline-none transition-colors" />
                  </div>
                </div>
            </div>

            {/* Preview */}
            <div className="flex flex-col h-full rounded-xl overflow-hidden border border-white/10 bg-black/20">
                <div className="flex justify-between items-center p-3 border-b border-white/10 bg-black/20">
                    <span className="font-bold text-white text-xs uppercase tracking-wider">{t.preview}</span>
                    <span className="text-[10px] text-white/70 font-bold bg-white/10 px-2 py-1 rounded-full">{t.all_pages}</span>
                </div>
                <div className="flex-1 p-6 flex flex-col items-center justify-center text-white/30 text-xs italic gap-3 bg-[url('/grid-pattern.png')] bg-repeat opacity-80">
                    <div className="w-20 h-28 bg-white/5 border-2 border-dashed border-white/20 shadow-2xl rotate-3 transform transition-transform hover:rotate-0 flex items-center justify-center">
                        <span className="text-2xl opacity-20 font-black">A4</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Rodapé */}
        <div className="p-6 pt-4 border-t border-white/10 flex gap-3 bg-black/20">
            <button onClick={onClose} className="px-6 py-3.5 border border-white/10 hover:bg-white/5 text-white/70 hover:text-white font-bold rounded-xl transition-colors text-xs uppercase tracking-wide">
                {t.cancel_btn}
            </button>
            <button onClick={onExport} className="flex-1 bg-gradient-to-r from-brand-orange to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wide hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-2">
               <FileDown size={16} />
               {t.download_btn}
            </button>
        </div>
      </div>
    </div>
  );
}