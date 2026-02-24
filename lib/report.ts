import type { Location } from "./types";

const W = 1200;
/** 黒線の太さ（外枠・Before/After間・フッター上）（添付画像参考） */
const LINE_W = 2;
const SLOT_W = (W - LINE_W) / 2;
const SLOT_H = 560;
const GAP = LINE_W;
const FOOTER_H = 56;
const LABEL_PADDING = 20;
/** Before/After を添付画像の比率で大きく表示 */
const LABEL_FONT_SIZE = 72;
const LABEL_FONT = `bold ${LABEL_FONT_SIZE}px 'Syne', sans-serif`;
const FOOTER_FONT = "14px 'Helvetica Neue', sans-serif";
/** フッター内のテキスト外側余白（小さめに） */
const FOOTER_PADDING = 10;

/** Before/After ラベル用ドロップシャドウ（黒50%・blur 20・オフセット0） */
const LABEL_SHADOW = {
  color: "rgba(0, 0, 0, 0.5)",
  blur: 20,
  offsetX: 0,
  offsetY: 0,
};

const PANEL_BG = "#363636";
const DIVIDER_BG = "#000000";
const FOOTER_BG = "#000000";
const TEXT_WHITE = "#ffffff";

/** 出力解像度の倍率（2で元の約2倍の画質、スマホ写真の劣化を軽減） */
const OUTPUT_SCALE = 2;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawPanelLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  label: string,
  align: "left" | "right"
) {
  ctx.font = LABEL_FONT;
  ctx.fillStyle = TEXT_WHITE;
  ctx.textBaseline = "top";
  ctx.textAlign = align;
  ctx.shadowColor = LABEL_SHADOW.color;
  ctx.shadowBlur = LABEL_SHADOW.blur;
  ctx.shadowOffsetX = LABEL_SHADOW.offsetX;
  ctx.shadowOffsetY = LABEL_SHADOW.offsetY;

  const labelY = y + LABEL_PADDING;
  if (align === "left") {
    ctx.fillText(label, x + LABEL_PADDING, labelY);
  } else {
    ctx.fillText(label, x + w - LABEL_PADDING, labelY);
  }

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.textAlign = "left";
}

async function drawSlot(
  ctx: CanvasRenderingContext2D,
  src: string | null,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = PANEL_BG;
  ctx.fillRect(x, y, w, h);

  if (src) {
    const img = await loadImage(src);
    if (img) {
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      const scale = Math.max(w / img.width, h / img.height);
      const sw = img.width * scale;
      const sh = img.height * scale;
      ctx.drawImage(img, x + (w - sw) / 2, y + (h - sh) / 2, sw, sh);
      ctx.restore();
    }
  } else {
    ctx.fillStyle = "#555";
    ctx.font = "14px 'Helvetica Neue', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("写真なし", x + w / 2, y + h / 2);
    ctx.textAlign = "left";
  }
}

/**
 * 場所の Before/After ペアを1枚のPNG画像として生成しダウンロード
 * スタイル: ダークグレー2パネル / 白ラベル / 下部黒フッター（場所名・日付）
 */
export async function generateAndDownload(loc: Location): Promise<void> {
  const pairs = Math.max(loc.before.length, loc.after.length);
  if (pairs === 0) return;

  const contentH = pairs * SLOT_H + (pairs - 1) * GAP;
  const H = contentH + LINE_W + FOOTER_H;

  const canvas = document.createElement("canvas");
  canvas.width = W * OUTPUT_SCALE;
  canvas.height = H * OUTPUT_SCALE;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  ctx.scale(OUTPUT_SCALE, OUTPUT_SCALE);

  // ── コンテンツ領域（Before | After パネル）────────────────────
  for (let i = 0; i < pairs; i++) {
    const y = i * (SLOT_H + GAP);

    // Before（左パネル）
    await drawSlot(ctx, loc.before[i] ?? null, 0, y, SLOT_W, SLOT_H);
    drawPanelLabel(ctx, 0, y, SLOT_W, "Before", "left");

    // 中央の黒縦線（Before と After の間）
    ctx.fillStyle = DIVIDER_BG;
    ctx.fillRect(SLOT_W, y, LINE_W, SLOT_H);

    // After（右パネル）
    await drawSlot(
      ctx,
      loc.after[i] ?? null,
      SLOT_W + LINE_W,
      y,
      SLOT_W,
      SLOT_H
    );
    drawPanelLabel(ctx, SLOT_W + LINE_W, y, SLOT_W, "After", "right");
  }

  // ── コンテンツとフッターの間の黒横線 ────────────────────────
  ctx.fillStyle = DIVIDER_BG;
  ctx.fillRect(0, contentH, W, LINE_W);

  // ── フッター（黒背景・左に場所名・右に日付 YYYY.MM.DD）────────
  ctx.fillStyle = FOOTER_BG;
  ctx.fillRect(0, contentH + LINE_W, W, FOOTER_H);

  ctx.fillStyle = TEXT_WHITE;
  ctx.font = FOOTER_FONT;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(loc.name, FOOTER_PADDING, contentH + LINE_W + FOOTER_H / 2);

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, ".");
  ctx.textAlign = "right";
  ctx.fillText(dateStr, W - FOOTER_PADDING, contentH + LINE_W + FOOTER_H / 2);
  ctx.textAlign = "left";

  // ── 外枠の黒線 ─────────────────────────────────────────────
  ctx.strokeStyle = DIVIDER_BG;
  ctx.lineWidth = LINE_W;
  ctx.strokeRect(LINE_W / 2, LINE_W / 2, W - LINE_W, H - LINE_W);

  // ── ダウンロード ─────────────────────────────────────────────
  const dateForFile = new Date().toISOString().slice(0, 10);
  const filename = `${loc.name}_report_${dateForFile}.jpg`;

  canvas.toBlob(async (blob) => {
    if (!blob) return;
    const file = new File([blob], filename, { type: "image/jpeg" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: filename });
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }, "image/jpeg", 0.90);
}
