import { FileDown, X } from "lucide-react";
import { useI18n } from "../../i18n";

interface MagazineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  lang: string;
}

export default function MagazineModal({ isOpen, onClose, onExport }: MagazineModalProps) {
  const { t } = useI18n();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 font-sans text-white">
      <div className="w-full max-w-3xl bg-[#1e293b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

        {/* Cabeçalho */}
        <div className="p-6 pb-4 border-b border-white/10 flex justify-between items-start">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-1">
                    <span className="w-2 h-6 bg-brand-orange rounded-full"></span>
                    {t('km_mag_title')}
                </h2>
                <p className="text-white/50 text-sm ml-5">{t('km_mag_desc')}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white">
                <X size={20} />
            </button>
        </div>

        {/* Corpo */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
                <div>
                    <label className="text-[10px] text-white/40 uppercase font-bold block mb-1.5 ml-1">{t('km_mag_title_lbl')}</label>
                    <input type="text" defaultValue="Minha Revista" className="w-full bg-[#0f141f] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-brand-orange outline-none placeholder-white/30 transition-colors font-medium" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-white/40 uppercase font-bold block ml-1">{t('km_mag_size_lbl')}</label>
                    <select className="w-full bg-[#0f141f] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none cursor-pointer hover:bg-white/5 transition-colors font-medium appearance-none">
                        <option>A4 (210x297mm) - Padrão</option>
                        <option>B5 (JIS) - Mangá Clássico</option>
                        <option>Digital (Webtoon/Tablet)</option>
                    </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                      <label className="text-[10px] text-white/40 uppercase font-bold block mb-1.5 ml-1 text-center">{t('km_mag_margin_lbl')}</label>
                      <input type="number" defaultValue="12" className="w-full bg-[#0f141f] border border-white/10 rounded-lg px-3 py-3 text-white font-bold text-center focus:border-brand-orange outline-none transition-colors" />
                  </div>
                  <div className="flex-1">
                      <label className="text-[10px] text-white/40 uppercase font-bold block mb-1.5 ml-1 text-center">{t('km_mag_bleed_lbl')}</label>
                      <input type="number" defaultValue="3" className="w-full bg-[#0f141f] border border-white/10 rounded-lg px-3 py-3 text-white font-bold text-center focus:border-brand-orange outline-none transition-colors" />
                  </div>
                </div>
            </div>

            {/* Preview */}
            <div className="flex flex-col h-full rounded-xl overflow-hidden border border-white/10 bg-black/20">
                <div className="flex justify-between items-center p-3 border-b border-white/10 bg-black/20">
                    <span className="font-bold text-white text-xs uppercase tracking-wider">{t('km_mag_preview')}</span>
                    <span className="text-[10px] text-white/70 font-bold bg-white/10 px-2 py-1 rounded-full">{t('km_mag_all_pages')}</span>
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
                {t('km_mag_cancel_btn')}
            </button>
            <button onClick={onExport} className="flex-1 bg-gradient-to-r from-brand-orange to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wide hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-2">
               <FileDown size={16} />
               {t('km_mag_download_btn')}
            </button>
        </div>
      </div>
    </div>
  );
}
