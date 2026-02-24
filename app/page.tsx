"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { LocationCard } from "@/components/LocationCard";
import { ReportTab } from "@/components/ReportTab";
import { Toast } from "@/components/Toast";
import { readAndResizeFile } from "@/lib/resize";
import { saveSession, loadSession } from "@/lib/storage";
import type { Location } from "@/lib/types";

type Tab = "shoot" | "report";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("shoot");
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocName, setNewLocName] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // ── IndexedDB: 起動時に前回セッションを復元 ──
  useEffect(() => {
    loadSession().then((saved) => {
      if (saved && saved.length > 0) {
        setLocations(saved);
        showToast("前回の続きを復元しました");
      }
      setLoaded(true);
    });
  }, []);

  // ── IndexedDB: 変更があれば500ms後に保存（debounce）──
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveSession(locations);
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [locations, loaded]);

  // ── 場所を追加 ──
  const addLocation = () => {
    const name = newLocName.trim();
    if (!name) return;
    const loc: Location = {
      id: generateId(),
      name,
      before: [],
      after: [],
      createdAt: Date.now(),
    };
    setLocations((prev) => [...prev, loc]);
    setNewLocName("");
  };

  // ── 写真追加（リサイズ処理込み）──
  const handleAddPhotos = useCallback(
    async (locId: string, mode: "before" | "after", files: File[]) => {
      const resized = await Promise.all(files.map(readAndResizeFile));
      setLocations((prev) =>
        prev.map((loc) =>
          loc.id === locId
            ? { ...loc, [mode]: [...loc[mode], ...resized] }
            : loc
        )
      );
    },
    []
  );

  // ── 写真削除 ──
  const handleRemovePhoto = useCallback(
    (locId: string, mode: "before" | "after", index: number) => {
      setLocations((prev) =>
        prev.map((loc) => {
          if (loc.id !== locId) return loc;
          const arr = [...loc[mode]];
          arr.splice(index, 1);
          return { ...loc, [mode]: arr };
        })
      );
    },
    []
  );

  // ── 場所削除 ──
  const handleDeleteLocation = useCallback((locId: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== locId));
  }, []);

  const completedCount = locations.filter(
    (l) => l.before.length > 0 && l.after.length > 0
  ).length;

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#666] text-sm font-mono">読み込み中…</p>
      </div>
    );
  }

  return (
    <main className="max-w-[480px] mx-auto px-4 pt-6 pb-28">
      {/* Header */}
      <header className="mb-8">
        <h1 className="font-display text-[22px] font-black tracking-tight">
          Snap<span className="text-[#e8ff5a]">Report</span>
        </h1>
        <p className="text-xs text-[#666] mt-1 uppercase tracking-widest">
          Before / After 報告ツール
        </p>
      </header>

      {/* Add location form */}
      {tab === "shoot" && (
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newLocName}
            onChange={(e) => setNewLocName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addLocation()}
            placeholder="場所名（例：トイレ）"
            className="
              flex-1 bg-[#1f1f1f] border border-[#2a2a2a]
              rounded-lg px-4 py-3 text-sm font-mono text-[#f0f0f0]
              placeholder-[#666] outline-none
              focus:border-[#e8ff5a] transition-colors
            "
          />
          <button
            type="button"
            onClick={addLocation}
            disabled={!newLocName.trim()}
            className="
              bg-[#e8ff5a] text-black font-medium text-sm
              px-5 rounded-lg
              disabled:bg-[#2a2a2a] disabled:text-[#666]
              hover:bg-[#d4eb3e] transition-colors
            "
          >
            追加
          </button>
        </div>
      )}

      {/* Location list (shoot tab): 未完了のみ表示、完了はレポートタブで確認 */}
      {tab === "shoot" && (() => {
        const incomplete = locations.filter(
          (l) => !(l.before.length > 0 && l.after.length > 0)
        );
        return (
          <div className="space-y-3">
            {incomplete.length === 0 ? (
              <div className="text-center py-16 text-[#666] text-sm">
                {locations.length === 0 ? (
                  <p>場所を追加して撮影を始めてください</p>
                ) : (
                  <>
                    <p>撮影中の場所はありません</p>
                    <p className="mt-1 text-xs">完了したものはレポートタブにあります</p>
                  </>
                )}
              </div>
            ) : (
              incomplete.map((loc) => (
                <LocationCard
                  key={loc.id}
                  location={loc}
                  onAddPhotos={handleAddPhotos}
                  onRemovePhoto={handleRemovePhoto}
                  onDelete={handleDeleteLocation}
                />
              ))
            )}
          </div>
        );
      })()}

      {/* Report tab */}
      {tab === "report" && (
        <ReportTab
          locations={locations}
          onDelete={handleDeleteLocation}
        />
      )}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0e0e0e]/95 backdrop-blur border-t border-[#1f1f1f]">
        <div className="max-w-[480px] mx-auto flex">
          <button
            type="button"
            onClick={() => setTab("shoot")}
            className={`
              flex-1 py-4 text-xs uppercase tracking-widest font-medium transition-colors
              ${tab === "shoot" ? "text-[#e8ff5a]" : "text-[#666] hover:text-[#f0f0f0]"}
            `}
          >
            撮影
          </button>
          <button
            type="button"
            onClick={() => setTab("report")}
            className={`
              flex-1 py-4 text-xs uppercase tracking-widest font-medium transition-colors relative
              ${tab === "report" ? "text-[#e8ff5a]" : "text-[#666] hover:text-[#f0f0f0]"}
            `}
          >
            レポート
            {completedCount > 0 && (
              <span className="absolute top-3 right-[calc(50%-20px)] bg-[#3ddc84] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {completedCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <Toast message={toast} />
    </main>
  );
}
