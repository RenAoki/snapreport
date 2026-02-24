import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SnapReport — Before/After 報告ツール";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0e0e0e",
          fontFamily: "sans-serif",
          gap: 20,
        }}
      >
        {/* ロゴ */}
        <div style={{ display: "flex", fontSize: 96, fontWeight: 900, letterSpacing: "-2px" }}>
          <span style={{ color: "#ffffff" }}>Snap</span>
          <span style={{ color: "#e8ff5a" }}>Report</span>
        </div>

        {/* サブテキスト */}
        <div
          style={{
            color: "#666666",
            fontSize: 28,
            letterSpacing: "6px",
            textTransform: "uppercase",
          }}
        >
          Before / After 報告ツール
        </div>
      </div>
    ),
    { ...size }
  );
}
