"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { ShootMode } from "@/lib/types";

type PhotoZoneProps = {
  mode: ShootMode;
  photos: string[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
};

export function PhotoZone({ mode, photos, onAdd, onRemove }: PhotoZoneProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const isBefore = mode === "before";
  const color = isBefore ? "text-[#4a9eff]" : "text-[#3ddc84]";
  const borderActive = isBefore
    ? "border-[#4a9eff]/40 hover:border-[#4a9eff]"
    : "border-[#3ddc84]/40 hover:border-[#3ddc84]";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onAdd(files);
    e.target.value = "";
  };

  return (
    <div>
      {/* Zone tap area: 2ボタン */}
      <div className={cn("w-full border-2 border-dashed rounded-xl p-4 transition-all", borderActive)}>
        <p className={cn("text-xs uppercase tracking-widest font-medium mb-3 text-center", color)}>
          {isBefore ? "Before" : "After"}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="flex-1 bg-[#1f1f1f] rounded-lg py-2 text-xs text-[#aaa] hover:text-white transition-colors"
          >
            カメラ
          </button>
          <button
            type="button"
            onClick={() => galleryRef.current?.click()}
            className="flex-1 bg-[#1f1f1f] rounded-lg py-2 text-xs text-[#aaa] hover:text-white transition-colors"
          >
            ライブラリ
          </button>
        </div>
        {photos.length > 0 && (
          <p className="text-xs text-[#555] text-center mt-2">{photos.length}枚 — 追加する</p>
        )}
      </div>

      {/* カメラ専用 input */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      {/* ライブラリ専用 input */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleChange}
      />

      {/* Thumbnails */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {photos.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-[#1f1f1f] group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="
                  absolute top-1 right-1 w-6 h-6 rounded-full
                  bg-black/70 text-white text-xs
                  flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-opacity
                "
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Count */}
      {photos.length > 0 && (
        <p className="text-xs text-[#666] text-right mt-1">{photos.length}枚</p>
      )}
    </div>
  );
}
