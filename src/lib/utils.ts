
export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
export const clampInt = (v: number, min: number, max: number) => Math.round(clamp(v, min, max));
export const sample = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const timestamp = () => Date.now().toString();
export const isoToday = () => new Date().toISOString().split('T')[0];

export const tokenizeTheme = (theme: string) => {
  const parts = theme.split(',').map(p => p.trim());
  return {
    keywords: parts,
    place: parts[1] || "",
    threat: parts[2] || "",
    goal: parts[3] || ""
  };
};

export const filterForStyle = (style: string, mode: string) => {
  let f = "";
  if (mode === "bw") f += "grayscale(1) contrast(1.2) ";
  if (style === "Noir") f += "contrast(1.5) brightness(0.8) ";
  if (style === "Cyberpunk") f += "saturate(2) hue-rotate(10deg) ";
  return f.trim();
};
