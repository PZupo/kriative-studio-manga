import { Balloon, PanelGeom, VisualStyle, ColorMode } from "./types";

// Helper para carregar imagens com segurança (CORS)
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Vital para baixar imagens externas
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn(`Falha ao carregar: ${src}`);
      // Retorna uma imagem vazia/placeholder em caso de erro para não quebrar o PDF
      resolve(new Image()); 
    };
    img.src = src;
  });
};

// Helper para quebrar texto dentro do balão (Word Wrap)
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  const lines = [];

  for(let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  // Desenha as linhas centralizadas
  let startY = y - ((lines.length - 1) * lineHeight) / 2;
  for (let k = 0; k < lines.length; k++) {
    ctx.fillText(lines[k], x, startY + (k * lineHeight));
  }
}

// Função para desenhar um balão específico no Canvas
function drawBalloon(ctx: CanvasRenderingContext2D, b: Balloon, panelW: number, panelH: number, panelX: number, panelY: number) {
    if (!b.text) return;

    // Converter porcentagem para pixels reais dentro do painel
    const bx = panelX + (b.x / 100) * panelW;
    const by = panelY + (b.y / 100) * panelH;
    const bw = (b.w / 100) * panelW;
    // Estima altura baseada na largura (padrão 2:3 ou ajustável)
    const bh = Math.max(bw * 0.6, 40); 

    ctx.save();
    
    // 1. Desenha a Cauda (Tail) se existir
    if (b.tail?.on) {
        const tx = panelX + (b.tail.tx / 100) * panelW;
        const ty = panelY + (b.tail.ty / 100) * panelH;
        
        ctx.beginPath();
        ctx.moveTo(bx + bw/2, by + bh/2); // Centro do balão
        // Curva quadrática simples para a cauda
        ctx.quadraticCurveTo(bx + bw/2, ty, tx, ty);
        
        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";
        ctx.stroke();
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
    }

    // 2. Desenha o Balão (Elipse branca com borda preta)
    ctx.beginPath();
    // Um retângulo arredondado ou elipse
    ctx.ellipse(bx + bw/2, by + bh/2, bw/2, bh/2, 0, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();

    // 3. Desenha o Texto
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Ajusta tamanho da fonte baseado no tamanho do balão
    const fontSize = Math.max(10, bw / 8); 
    ctx.font = `bold ${fontSize}px sans-serif`;
    
    wrapText(ctx, b.text, bx + bw/2, by + bh/2, bw * 0.8, fontSize * 1.2);

    ctx.restore();
}

// --- FUNÇÃO PRINCIPAL: Renderiza a página completa ---
export async function renderToCanvas(
  aspect: string,
  layout: PanelGeom[],
  images: string[],
  balloons: Record<string, Balloon>,
  style: VisualStyle,
  mode: ColorMode
) {
  // 1. Configura Dimensões (Alta Resolução para Impressão)
  const [wRatio, hRatio] = aspect.split(":").map(Number);
  const W = 1240; // ~A4 @ 150dpi width
  const H = Math.floor(W * (hRatio / wRatio));
  
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Contexto 2D não disponível");

  // 2. Fundo Branco
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, W, H);

  // 3. Desenha os Painéis e Imagens
  for (let i = 0; i < layout.length; i++) {
    const geom = layout[i];
    const url = images[i];
    
    // Coordenadas em Pixels
    const x = (geom.x / 100) * W;
    const y = (geom.y / 100) * H;
    const w = (geom.w / 100) * W;
    const h = (geom.h / 100) * H;

    // Margem interna (Gutter) para não colar
    const gutter = 4; 
    const drawX = x + gutter;
    const drawY = y + gutter;
    const drawW = w - (gutter * 2);
    const drawH = h - (gutter * 2);

    if (url) {
        try {
            const img = await loadImage(url);
            
            ctx.save();
            // Área de Recorte (Clip) do Painel
            ctx.beginPath();
            ctx.rect(drawX, drawY, drawW, drawH);
            ctx.clip();

            // Filtros (P&B)
            if (mode === 'bw') {
                ctx.filter = 'grayscale(100%) contrast(1.2)';
            }

            // Desenha imagem (Object Cover Simulation)
            // Simples: estica para preencher. Para "cover" real precisa de mais matemática, 
            // mas isso garante que a imagem preencha o quadro.
            ctx.drawImage(img, drawX, drawY, drawW, drawH);
            
            ctx.restore();

            // Borda do Painel
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#000";
            ctx.strokeRect(drawX, drawY, drawW, drawH);

        } catch (e) {
            console.error("Erro ao desenhar imagem", e);
        }
    }

    // 4. Desenha o Balão deste painel (se houver)
    const b = balloons[geom.id];
    if (b) {
        // Passamos as coordenadas do painel para o balão se posicionar relativamente
        drawBalloon(ctx, b, drawW, drawH, drawX, drawY);
    }
  }

  return { canvas, W, H };
}

// --- FUNÇÃO NOVA: Renderiza APENAS UM PAINEL para download individual ---
export async function renderSinglePanel(
    imageUrl: string,
    balloon: Balloon | undefined,
    mode: ColorMode
): Promise<string> {
    const W = 1024;
    const H = 1024; // Quadrado ou proporcional
    
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // Fundo
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, W, H);

    if (imageUrl) {
        const img = await loadImage(imageUrl);
        if (mode === 'bw') ctx.filter = 'grayscale(100%)';
        ctx.drawImage(img, 0, 0, W, H);
        ctx.filter = 'none';
    }

    // Borda
    ctx.lineWidth = 10;
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, W, H);

    if (balloon) {
        drawBalloon(ctx, balloon, W, H, 0, 0);
    }

    return canvas.toDataURL("image/jpeg", 0.9);
}