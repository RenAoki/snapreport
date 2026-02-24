/**
 * iPhoneカメラ写真（3〜8MB）を報告書用にリサイズ・圧縮する
 * 短辺1920px以内・JPEG品質95%
 */
export function resizeImage(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const MAX = 1920;
      let w = img.width;
      let h = img.height;

      const shorter = Math.min(w, h);
      if (shorter > MAX) {
        const ratio = MAX / shorter;
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}

/**
 * FileオブジェクトをdataURLに変換してからリサイズ
 */
export function readAndResizeFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const dataUrl = e.target?.result as string;
        const resized = await resizeImage(dataUrl);
        resolve(resized);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
