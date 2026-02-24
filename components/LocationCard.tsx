"use client";

import { useState } from "react";
import { PhotoZone } from "./PhotoZone";
import { cn } from "@/lib/utils";
import type { Location, LocationStatus } from "@/lib/types";

type LocationCardProps = {
  location: Location;
  onAddPhotos: (locId: string, mode: "before" | "after", files: File[]) => void;
  onRemovePhoto: (locId: string, mode: "before" | "after", index: number) => void;
  onDelete: (locId: string) => void;
};

function getStatus(loc: Location): LocationStatus {
  if (loc.before.length === 0) return "empty";
  if (loc.after.length === 0) return "before-only";
  return "complete";
}

const STATUS_LABEL: Record<LocationStatus, string> = {
  empty: "未撮影",
  "before-only": "Before済",
  complete: "完了",
};

const STATUS_COLOR: Record<LocationStatus, string> = {
  empty: "text-[#666]",
  "before-only": "text-[#4a9eff]",
  complete: "text-[#3ddc84]",
};

export function LocationCard({
  location,
  onAddPhotos,
  onRemovePhoto,
  onDelete,
}: LocationCardProps) {
  const [expanded, setExpanded] = useState(true);
  const status = getStatus(location);

  return (
    <div className="bg-[#171717] border border-[#2a2a2a] rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div>
          <p className="text-sm font-medium">{location.name}</p>
          <p className="text-xs text-[#666] mt-0.5">
            Before {location.before.length}枚 · After {location.after.length}枚
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={cn("text-xs uppercase tracking-wider", STATUS_COLOR[status])}>
            {STATUS_LABEL[status]}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`「${location.name}」を削除しますか？`)) {
                onDelete(location.id);
              }
            }}
            className="text-xs text-red-500 border border-red-500/40 rounded-md px-2 py-1 hover:bg-red-500/10 transition-colors"
          >
            削除
          </button>
          <span className="text-[#666] text-sm">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#2a2a2a]">
          <div className="pt-3">
            <PhotoZone
              mode="before"
              photos={location.before}
              onAdd={(files) => onAddPhotos(location.id, "before", files)}
              onRemove={(i) => onRemovePhoto(location.id, "before", i)}
            />
          </div>
          <PhotoZone
            mode="after"
            photos={location.after}
            onAdd={(files) => onAddPhotos(location.id, "after", files)}
            onRemove={(i) => onRemovePhoto(location.id, "after", i)}
          />
        </div>
      )}
    </div>
  );
}
