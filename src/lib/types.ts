
export type AiMode = "mock" | "gemini";
export type VisualStyle = "Padrao" | "Cyberpunk" | "Noir" | "Comedia" | "Ficcao" | "Fantasia" | "Terror" | "Romance" | "Ghibli" | "Disney" | "Pixar";
export type ColorMode = "color" | "bw";
export type BalloonStyle = "retangular" | "nuvem" | "sussurro";

export interface Balloon {
  x: number;
  y: number;
  w: number;
  text: string;
  style: BalloonStyle;
  tail: {
    on: boolean;
    tx: number;
    ty: number;
  };
}

// src/lib/types.ts

export interface PanelGeom {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  // ADICIONE ESTA LINHA (O '?' torna ela opcional, não quebra os antigos)
  clipPath?: string; 
}

// ... resto do arquivo

export interface PageData {
  aspect: string;
  panels: number;
  theme: string;
  images: string[];
  balloons: Record<string, Balloon>;
  layout: PanelGeom[];
}

export interface PageSnapshot {
  aspect: string;
  layout: PanelGeom[];
  images: string[];
  balloons: Record<string, Balloon>;
}

export interface KChar {
  id: string;
  name: string;
  role: string;
  age: string;
  gender: string;
  personality: string;
  appearance: string;
  color: string;
  avatar?: string;
}

export interface Creation {
  id: string;
  title: string;
  aspect: string;
  panels: number;
  theme: string;
  images: string[];
  balloons: Record<string, Balloon>;
  layout: PanelGeom[];
  thumb: string;
  createdAt: number;
  characters?: KChar[];
  visualStyle?: VisualStyle;
  colorMode?: ColorMode;
}

export interface Project {
  id: string;
  title: string;
  pages: PageData[];
  currentIndex: number;
  cover: string;
  createdAt: number;
}
