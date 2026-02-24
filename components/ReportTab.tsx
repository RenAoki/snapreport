"use client";

import { useState } from "react";
import { generateAndDownload } from "@/lib/report";
import type { Location } from "@/lib/types";

type ReportTabProps = {
  locations: Location[];
  onDelete: (locId: string) => void;
};

export function ReportTab({ locations, onDelete }: ReportTabProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const completed = locations.filter(
    (l) => l.before.length > 0 && l.after.length > 0
  );

  const handleDownload = async (loc: Location) => {
    setLoading(loc.id);
    try {
      await generateAndDownload(loc);
    } finally {
      setLoading(null);
    }
  };

  if (completed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-[#666] text-sm">Before・After が揃った場所が</p>
        <p className="text-[#666] text-sm">まだありません</p>
        <p className="text-xs text-[#444] mt-3">撮影タブで撮影してください</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {completed.map((loc) => (
        <div
          key={loc.id}
          className="bg-[#171717] border border-[#2a2a2a] rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium">{loc.name}</p>
              <p className="text-xs text-[#666] mt-0.5">
                {Math.max(loc.before.length, loc.after.length)}ペア
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`「${loc.name}」のレポートを削除しますか？\n撮影データ（Before/After写真）も一緒に削除されます。`)) {
                    onDelete(loc.id);
                  }
                }}
                className="
                  text-red-500 border border-red-500/40 text-xs
                  px-3 py-2 rounded-lg
                  hover:bg-red-500/10 transition-colors
                "
              >
                削除
              </button>
              <button
                type="button"
                onClick={() => handleDownload(loc)}
                disabled={loading === loc.id}
                className="
                  bg-[#e8ff5a] text-black text-xs font-medium
                  px-4 py-2 rounded-lg
                  disabled:bg-[#2a2a2a] disabled:text-[#666]
                  hover:bg-[#d4eb3e] transition-colors
                "
              >
                {loading === loc.id ? "生成中…" : "PNG保存"}
              </button>
            </div>
          </div>

          {/* Preview strip */}
          <div className="px-4 pb-4 grid grid-cols-2 gap-2">
            {Array.from({ length: Math.max(loc.before.length, loc.after.length) }).map(
              (_, i) => (
                <div key={i} className="col-span-2 grid grid-cols-2 gap-1">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1f1f1f]">
                    {loc.before[i] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={loc.before[i]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#444] text-xs flex items-center justify-center h-full">なし</span>
                    )}
                    <span className="absolute bottom-1 left-1 bg-[#4a9eff] text-white text-[10px] px-1.5 py-0.5 rounded">
                      BEFORE
                    </span>
                  </div>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1f1f1f]">
                    {loc.after[i] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={loc.after[i]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#444] text-xs flex items-center justify-center h-full">なし</span>
                    )}
                    <span className="absolute bottom-1 left-1 bg-[#3ddc84] text-black text-[10px] px-1.5 py-0.5 rounded">
                      AFTER
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
