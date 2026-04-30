// src/pages/MangaEditor.tsx - Kriative Studio Mangá

import React, { useState, useEffect, useRef } from "react";
import { PDFDocument } from "pdf-lib";

import { useAuth } from "../contexts/AuthContext";
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";

import UniversalHeader from "../components/UniversalHeader";
import CharactersModal from "../components/modals/CharactersModal";
import MagazineModal from "../components/modals/MagazineModal";
import GalleryModal from "../components/modals/GalleryModal";
import ProjectsModal from "../components/modals/ProjectsModal";
import PlannerModal from "../components/modals/PlannerModal";

import useLocalStorage from "../hooks/useLocalStorage";
import {
  Balloon, KChar, PageData, PanelGeom, Project,
  VisualStyle, ColorMode
} from "../lib/types";
import { clamp, clampInt, sample, timestamp, filterForStyle } from "../lib/utils";
import { renderToCanvas } from "../lib/canvas";
import { LAYOUT_PRESETS } from "../lib/layoutPresets";
import i18n, { useI18n } from "../i18n";

const db = getFirestore();

// ─── TailOverlay ─────────────────────────────────────────────
const TailOverlay = ({ b }: { pRef: HTMLDivElement | null; bRef: HTMLDivElement | null; b: Balloon }) => {
  if (!b.tail?.on) return null;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d={`M ${b.x + b.w / 2} ${b.y + 10} Q ${b.x + b.w / 2} ${b.tail.ty} ${b.tail.tx} ${b.tail.ty}`} fill="none" stroke="white" strokeWidth="1.5" />
      <path d={`M ${b.x + b.w / 2} ${b.y + 10} Q ${b.x + b.w / 2} ${b.tail.ty} ${b.tail.tx} ${b.tail.ty}`} fill="none" stroke="black" strokeWidth="0.5" />
      <circle cx={b.tail.tx} cy={b.tail.ty} r="0.8" fill="white" stroke="black" strokeWidth="0.2" />
    </svg>
  );
};

// ─── MangaEditor ─────────────────────────────────────────────
export default function MangaEditor({ lang, setLang }: { lang: string; setLang: (value: string) => void }) {
  const { userData } = useAuth();
  const { t } = useI18n();

  // Força re-render quando o i18next muda de idioma
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1);
    i18n.on('languageChanged', handler);
    return () => i18n.off('languageChanged', handler);
  }, []);

  const pageRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const balloonRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [aspect, setAspect] = useLocalStorage("k_aspect", "7:10");
  const [panels, setPanels] = useLocalStorage("k_panels", 4);
  const [theme, setTheme] = useLocalStorage("k_theme", "Batalha épica em Neo-Tóquio sob a chuva");
  const [layout, setLayout] = useState<PanelGeom[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [balloons, setBalloons] = useLocalStorage<Record<string, Balloon>>("k_balloons", {});
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [activeBalloon, setActiveBalloon] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [charOpen, setCharOpen] = useState(false);
  const [magOpen, setMagOpen] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [editingCharId, setEditingCharId] = useState<string | null>(null);
  const [pages, setPages] = useLocalStorage<PageData[]>("k_pages", [{ aspect: "7:10", panels: 4, theme: "", images: [], balloons: {}, layout: [] }]);
  const [currentPage, setCurrentPage] = useState(0);
  const [projects, setProjects] = useLocalStorage<Project[]>("k_projects", []);
  const [projectTitle, setProjectTitle] = useState("");
  const [savingProject, setSavingProject] = useState(false);
  const [characters, setCharacters] = useLocalStorage<KChar[]>("k_characters", []);
  const [visualStyle, setVisualStyle] = useLocalStorage<VisualStyle>("k_visual_style", "Padrao");
  const [colorMode, setColorMode] = useLocalStorage<ColorMode>("k_color_mode", "color");
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);

  const pushToast = (msg: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 2200);
  };

  async function consumeImageCredit(cost = 5) {
    if (!userData?.uid) return;
    try {
      await updateDoc(doc(db, "users", userData.uid), { credits: increment(-cost) });
    } catch {
      pushToast("Erro ao processar créditos.");
    }
  }

  async function onGenerateImages() {
    if (isGeneratingImages || !userData || (userData.credits || 0) < 5) {
      pushToast("Créditos insuficientes (5 por página).");
      return;
    }
    setIsGeneratingImages(true);
    try {
      const response = await fetch('/api/processMangaGeneration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: userData.uid,
          prompt: theme,
          style: visualStyle,
          panelsCount: panels,
          ratio: aspect,
          image_ref: characters[0]?.avatar || null
        })
      });
      const result = await response.json();
      if (result.success && result.url) {
        setImages(Array.from({ length: panels }, () => result.url));
        await consumeImageCredit(5);
        pushToast("Página de Mangá gerada com sucesso!");
      } else {
        pushToast(result.error || "Erro na geração.");
      }
    } catch (err) {
      pushToast("Erro ao conectar com o engine.");
      console.error(err);
    } finally {
      setIsGeneratingImages(false);
    }
  }

  function makeLayout() {
    const n = clampInt(panels, 1, 5);
    const chosen = sample(LAYOUT_PRESETS[n] || LAYOUT_PRESETS[1]);
    setLayout(chosen);
    setBalloons((prev: any) => {
      const updated: Record<string, Balloon> = {};
      chosen.forEach((g: any) => {
        updated[g.id] = prev[g.id] ?? { x: 10, y: 10, w: 50, text: "", style: "retangular", tail: { on: false, tx: 50, ty: 100 } };
      });
      return updated;
    });
  }

  useEffect(() => { makeLayout(); }, [panels, aspect]);

  async function onGenerateScript() {
    if (isGeneratingScript) return;
    setIsGeneratingScript(true);
    try {
      setBalloons((prev: any) => {
        const next = { ...prev };
        layout.forEach((g: any, i: number) => {
          next[g.id] = { ...next[g.id], text: `Ação sugerida para o painel ${i + 1}...` };
        });
        return next;
      });
      pushToast(t('km_btn_script'));
    } finally {
      setIsGeneratingScript(false);
    }
  }

  async function regeneratePanelImage(idx: number) {
    if (!userData || (userData.credits || 0) < 5) { pushToast("Créditos insuficientes."); return; }
    setImages(prev => { const next = [...prev]; next[idx] = `https://picsum.photos/seed/manga_${Date.now()}_${idx}/1024/1440`; return next; });
    await consumeImageCredit(5);
  }

  async function onDownloadPDF() {
    pushToast(t('km_btn_save_pdf'));
    try {
      const { canvas, W, H } = await renderToCanvas(aspect, layout, images, balloons, visualStyle, colorMode);
      const pdf = await PDFDocument.create();
      const bytes = await fetch(canvas.toDataURL("image/png")).then(r => r.arrayBuffer());
      const png = await pdf.embedPng(bytes);
      const page = pdf.addPage([W, H]);
      page.drawImage(png, { x: 0, y: 0, width: W, height: H });
      const blob = new Blob([await pdf.save() as any], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `ks_manga_${timestamp()}.pdf`;
      a.click();
      setMagOpen(false);
    } catch {
      pushToast("Erro ao gerar PDF.");
    }
  }

  async function saveCurrentProject() {
    if (!projectTitle.trim()) { pushToast("Dê um nome ao projeto!"); return; }
    setSavingProject(true);
    try {
      const { canvas } = await renderToCanvas(aspect, layout, images, balloons, visualStyle, colorMode);
      const item: Project = {
        id: `pr_${Date.now()}`,
        title: projectTitle.trim(),
        pages: JSON.parse(JSON.stringify(pages)),
        currentIndex: currentPage,
        cover: canvas.toDataURL("image/jpeg", 0.5),
        createdAt: Date.now()
      };
      setProjects(prev => [item, ...prev]);
      setProjectTitle("");
      pushToast(t('km_btn_save_project'));
    } catch {
      pushToast("Erro ao salvar projeto.");
    } finally {
      setSavingProject(false);
    }
  }

  function loadProject(id: string) {
    const pr = projects.find((p: Project) => p.id === id);
    if (!pr) return;
    setPages(pr.pages);
    setCurrentPage(pr.currentIndex);
    const p = pr.pages[pr.currentIndex];
    setAspect(p.aspect); setPanels(p.panels); setTheme(p.theme);
    setImages(p.images || []); setBalloons(p.balloons || {}); setLayout(p.layout || []);
    setShowProjects(false);
  }

  function goToPage(idx: number) {
    setCurrentPage(idx);
    const p = pages[idx];
    if (p) {
      setAspect(p.aspect); setPanels(p.panels); setTheme(p.theme);
      setImages(p.images || []); setBalloons(p.balloons || {}); setLayout(p.layout || []);
    }
  }

  function addPage() {
    setPages(prev => [...prev, { aspect, panels, theme, images: [], balloons: {}, layout: [] }]);
    pushToast(t('km_add_page'));
    setTimeout(() => goToPage(pages.length), 50);
  }

  function deletePage() {
    if (pages.length <= 1) { pushToast("Mínimo de uma página."); return; }
    const next = [...pages];
    next.splice(currentPage, 1);
    setPages(next);
    goToPage(Math.max(0, currentPage - 1));
  }

  function onBalloonMouseDown(e: React.MouseEvent, id: string) {
    setActiveBalloon(id); e.stopPropagation();
    const b = balloons[id]; if (!b) return;
    const sx = e.clientX, sy = e.clientY, px = b.x, py = b.y;
    const move = (ev: MouseEvent) => {
      const rect = pageRef.current?.getBoundingClientRect(); if (!rect) return;
      setBalloons(prev => ({ ...prev, [id]: { ...prev[id], x: clamp(px + ((ev.clientX - sx) / rect.width) * 100, 0, 95), y: clamp(py + ((ev.clientY - sy) / rect.height) * 100, 0, 95) } }));
    };
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
  }

  function onResizeStart(e: React.MouseEvent, id: string) {
    e.stopPropagation(); e.preventDefault();
    const b = balloons[id]; if (!b) return;
    const sx = e.clientX, sw = b.w;
    const move = (ev: MouseEvent) => {
      const rect = pageRef.current?.getBoundingClientRect(); if (!rect) return;
      setBalloons(prev => ({ ...prev, [id]: { ...prev[id], w: clamp(sw + ((ev.clientX - sx) / rect.width) * 100, 10, 90) } }));
    };
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
  }

  function onTailStart(e: React.MouseEvent, id: string) {
    e.stopPropagation(); e.preventDefault();
    const move = (ev: MouseEvent) => {
      const rect = pageRef.current?.getBoundingClientRect(); if (!rect) return;
      setBalloons(prev => ({ ...prev, [id]: { ...prev[id], tail: { ...prev[id].tail!, tx: ((ev.clientX - rect.left) / rect.width) * 100, ty: ((ev.clientY - rect.top) / rect.height) * 100 } } }));
    };
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
  }

  const setPanelRef = (id: string) => (el: HTMLDivElement | null) => { panelRefs.current[id] = el; };
  const setBalloonRef = (id: string) => (el: HTMLDivElement | null) => { balloonRefs.current[id] = el; };

  return (
    <div className="flex-1 w-full flex flex-col gap-6 min-h-screen bg-[#020617] text-white">
      <UniversalHeader />

      <main className="flex flex-col xl:flex-row items-start gap-6 p-6">

        {/* ── SIDEBAR ESQUERDA ── */}
        <aside className="w-full xl:w-[280px] shrink-0 space-y-6 lg:sticky lg:top-6">

          <div className="bg-white/5 p-5 rounded-[2rem] border border-white/10 space-y-5">
            <h2 className="text-sm font-black uppercase tracking-widest opacity-40">{t('km_config_title')}</h2>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase opacity-60 ml-1">{t('km_style_label')}</label>
              <select value={visualStyle} onChange={(e) => setVisualStyle(e.target.value as VisualStyle)} className="w-full bg-zinc-900 border-none rounded-2xl p-3 text-xs font-bold outline-none">
                {["Padrao", "Cyberpunk", "Noir", "Ghibli", "Disney", "Pixar"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="bg-zinc-900 p-1 rounded-xl flex">
              <button onClick={() => setColorMode('color')} className={`flex-1 py-2 rounded-lg text-xs font-black ${colorMode === 'color' ? 'bg-white text-black' : 'text-slate-400'}`}>{t('km_color_color')}</button>
              <button onClick={() => setColorMode('bw')} className={`flex-1 py-2 rounded-lg text-xs font-black ${colorMode === 'bw' ? 'bg-white text-black' : 'text-slate-400'}`}>{t('km_color_bw')}</button>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase opacity-60 ml-1">{t('km_ratio_label')}</label>
              <select value={aspect} onChange={(e) => setAspect(e.target.value)} className="w-full bg-zinc-900 border-none rounded-2xl p-3 text-xs font-bold outline-none">
                <option value="7:10">Mangá (7:10)</option>
                <option value="9:16">Webtoon (9:16)</option>
                <option value="16:9">Cinemático (16:9)</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold uppercase opacity-60">{t('km_panels_label')}</label>
                <span className="text-xs font-black text-teal-400">{panels}</span>
              </div>
              <input type="range" min={1} max={5} value={panels} onChange={(e) => setPanels(parseInt(e.target.value))} className="w-full h-1.5 accent-teal-500" />
              <button onClick={makeLayout} className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-black uppercase">{t('km_btn_layout')}</button>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase opacity-60 ml-1">{t('km_theme_label')}</label>
              <textarea value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full bg-zinc-900 border-none rounded-2xl p-4 text-xs h-28 focus:ring-2 ring-orange-500 outline-none resize-none" placeholder={t('km_theme_placeholder')} />
            </div>

            <div className="grid grid-cols-1 gap-3 pt-1">
              <button onClick={onGenerateScript} disabled={isGeneratingScript} className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-2xl font-black text-xs shadow-lg disabled:opacity-50">
                {isGeneratingScript ? t('km_btn_script_loading') : t('km_btn_script')}
              </button>
              <button onClick={onGenerateImages} disabled={isGeneratingImages} className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-black text-xs shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                {isGeneratingImages ? t('km_btn_images_loading') : <>{t('km_btn_images')} <span className="bg-black/30 px-1.5 py-0.5 rounded text-[9px]">-5</span></>}
              </button>
              <button onClick={() => setMagOpen(true)} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black text-xs shadow-lg">{t('km_btn_save_pdf')}</button>
            </div>
          </div>

          {/* ── SALVAR PROJETO ── */}
          <div className="bg-white/5 p-5 rounded-[2rem] border border-white/10 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('km_save_project_title')}</h3>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase opacity-60 ml-1">{t('km_save_project_title')}</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveCurrentProject(); }}
                placeholder={t('km_save_project_placeholder')}
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-xs outline-none focus:ring-2 ring-teal-500 placeholder:opacity-30 transition-all"
              />
            </div>
            <button
              onClick={saveCurrentProject}
              disabled={savingProject || !projectTitle.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl font-black text-xs shadow-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {savingProject ? t('km_btn_saving') : t('km_btn_save_project')}
            </button>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button onClick={() => setShowProjects(true)} className="py-2.5 bg-zinc-900 rounded-xl text-[9px] font-black uppercase text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors border border-white/5">{t('km_btn_projects')}</button>
              <button onClick={() => setShowGallery(true)} className="py-2.5 bg-zinc-900 rounded-xl text-[9px] font-black uppercase text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors border border-white/5">{t('km_modal_gal_title')}</button>
              <button onClick={() => setPlannerOpen(true)} className="py-2.5 bg-zinc-900 rounded-xl text-[9px] font-black uppercase text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors border border-white/5">{t('km_planner_btn')}</button>
            </div>
          </div>

        </aside>

        {/* ── CANVAS CENTRAL ── */}
        <section className="flex-1 min-w-0 flex flex-col gap-6">
          <div className="flex items-center justify-between bg-white/5 p-2 rounded-full border border-white/10">
            <div className="flex items-center gap-2 overflow-x-auto px-2">
              {pages.map((_, idx) => (
                <button key={idx} onClick={() => goToPage(idx)} className={`px-5 py-2.5 rounded-full text-xs font-black ${idx === currentPage ? 'bg-teal-500 text-black' : 'bg-zinc-800 text-slate-400'}`}>
                  {t('km_page_number')} {idx + 1}
                </button>
              ))}
              <button onClick={addPage} className="w-9 h-9 flex items-center justify-center rounded-full bg-teal-500/20 text-teal-400 text-xl font-bold" title={t('km_add_page')}>+</button>
            </div>
            <button onClick={deletePage} className="p-2.5 text-red-400 hover:text-red-500" title={t('km_remove_page')}>🗑️</button>
          </div>

          <div ref={pageRef} className="relative bg-white rounded-[2.5rem] shadow-2xl border-[12px] border-zinc-950 overflow-hidden mx-auto w-full" style={{ aspectRatio: aspect.replace(":", " / "), maxWidth: '800px', minHeight: '600px' }}>
            {layout.slice(0, panels).map((g, i) => {
              const url = images[i];
              const b = balloons[g.id];
              return (
                <div key={g.id} ref={setPanelRef(g.id)} className="absolute overflow-hidden group/panel" style={{ left: `${g.x}%`, top: `${g.y}%`, width: `${g.w}%`, height: `${g.h}%` }}>
                  {url
                    ? <img src={url} className="w-full h-full object-cover transition-transform duration-700 group-hover/panel:scale-105" style={{ filter: filterForStyle(visualStyle, colorMode) }} />
                    : <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-xs text-zinc-500">{t('km_waiting_ai')}</div>
                  }
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/panel:opacity-100 transition-opacity flex items-end justify-center p-4 gap-2">
                    <button onClick={() => regeneratePanelImage(i)} className="p-2 bg-orange-500 text-white rounded-xl hover:scale-110">🔄</button>
                    <button onClick={() => { if (url) { const a = document.createElement("a"); a.href = url; a.download = `painel_${i + 1}.jpg`; a.click(); } }} className="p-2 bg-white text-zinc-900 rounded-xl hover:scale-110">💾</button>
                  </div>
                  {b && (
                    <div
                      ref={setBalloonRef(g.id)}
                      onMouseDown={(e) => onBalloonMouseDown(e, g.id)}
                      className={`absolute cursor-move select-none p-3 rounded-2xl border-2 z-10 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-[11px] font-bold leading-tight min-w-[60px] ${activeBalloon === g.id ? 'border-teal-500 shadow-2xl ring-4 ring-teal-500/20' : 'border-zinc-300 shadow-lg'}`}
                      style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%` }}
                    >
                      {b.text || "..."}
                      <div onMouseDown={(e) => onResizeStart(e, g.id)} className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full border-2 border-white cursor-se-resize" />
                      {b.tail?.on && (
                        <div onMouseDown={(e) => onTailStart(e, g.id)} className="absolute w-6 h-6 bg-orange-500 rounded-full border-2 border-white cursor-crosshair flex items-center justify-center z-50 hover:scale-125 transition-transform" style={{ left: `${b.tail.tx}%`, top: `${b.tail.ty}%`, transform: 'translate(-50%, -50%)' }}>
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  )}
                  {b?.tail?.on && <TailOverlay pRef={panelRefs.current[g.id]} bRef={balloonRefs.current[g.id]} b={b} />}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SIDEBAR DIREITA ── */}
        <aside className="w-full xl:w-[280px] shrink-0 space-y-6 lg:sticky lg:top-6">
          <div className="bg-white/5 p-5 rounded-[2rem] border border-white/10">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-6">{t('km_cast_title')}</h3>
            <div className="flex gap-3 flex-wrap">
              {characters.map((char) => (
                <div key={char.id} onClick={() => { setEditingCharId(char.id); setCharOpen(true); }} className="w-12 h-12 rounded-full flex items-center justify-center text-xl cursor-pointer border border-white/30" style={{ backgroundColor: char.color }}>
                  {char.name?.[0] || "?"}
                </div>
              ))}
              <button onClick={() => { setEditingCharId(null); setCharOpen(true); }} className="w-12 h-12 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center text-2xl">+</button>
            </div>
          </div>

          <div className="bg-white/5 p-5 rounded-[2rem] border border-white/10">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-6">{t('km_dialog_title')}</h3>
            <div className="space-y-5 max-h-[650px] overflow-y-auto pr-3">
              {layout.slice(0, panels).map((g, i) => (
                <div key={g.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-teal-400">{t('km_panel_label')} {i + 1}</span>
                    <button
                      onClick={() => setBalloons(prev => ({ ...prev, [g.id]: { ...prev[g.id], tail: { ...prev[g.id]?.tail, on: !prev[g.id]?.tail?.on } } }))}
                      className={`text-[9px] px-3 py-1 rounded-full border font-black ${balloons[g.id]?.tail?.on ? 'bg-orange-500 text-white border-orange-500' : 'border-zinc-600 text-zinc-400'}`}
                    >
                      {t('km_btn_tail')}
                    </button>
                  </div>
                  <textarea
                    value={balloons[g.id]?.text || ""}
                    onChange={(e) => setBalloons(prev => ({ ...prev, [g.id]: { ...prev[g.id], text: e.target.value } }))}
                    className="w-full bg-zinc-900 rounded-2xl p-4 text-xs h-24 resize-none outline-none focus:ring-2 ring-teal-500"
                    placeholder={t('km_dialog_placeholder')}
                  />
                </div>
              ))}
            </div>
          </div>
        </aside>

      </main>

      {/* ── MODAIS ── */}
      {charOpen && <CharactersModal characters={characters} setCharacters={setCharacters} onClose={() => { setCharOpen(false); setEditingCharId(null); }} pushToast={pushToast} initialCharId={editingCharId} lang={lang} />}
      {magOpen && <MagazineModal isOpen={magOpen} onClose={() => setMagOpen(false)} onExport={onDownloadPDF} lang={lang} />}
      {showProjects && <ProjectsModal projects={projects} onClose={() => setShowProjects(false)} onLoad={loadProject} deleteProject={(id) => setProjects(prev => prev.filter((p: Project) => p.id !== id))} onSchedule={() => { setShowProjects(false); setPlannerOpen(true); }} />}
      {plannerOpen && <PlannerModal onClose={() => setPlannerOpen(false)} />}
      {showGallery && <GalleryModal onClose={() => setShowGallery(false)} />}

      {/* ── TOASTS ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-[9999]">
        {toasts.map((tItem) => (
          <div key={tItem.id} className="bg-zinc-900 text-white px-8 py-4 rounded-3xl text-xs font-black shadow-2xl">{tItem.msg}</div>
        ))}
      </div>
    </div>
  );
}