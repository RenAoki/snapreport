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
          position: "relative",
        }}
      >
        {/* Before / After パネル装飾 */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 60,
            right: 60,
            bottom: 160,
            display: "flex",
            borderRadius: 16,
            overflow: "hidden",
            border: "2px solid #2a2a2a",
          }}
        >
          {/* Before */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#363636",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              padding: 24,
            }}
          >
            <span style={{ color: "#ffffff", fontSize: 32, fontWeight: 700, opacity: 0.9 }}>
              Before
            </span>
          </div>
          {/* Divider */}
          <div style={{ width: 2, backgroundColor: "#000000" }} />
          {/* After */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#2a2a2a",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-end",
              padding: 24,
            }}
          >
            <span style={{ color: "#e8ff5a", fontSize: 32, fontWeight: 700, opacity: 0.9 }}>
              After
            </span>
          </div>
        </div>

        {/* テキスト */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 140,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "#ffffff", fontSize: 56, fontWeight: 700, letterSpacing: "-1px" }}>
            SnapReport
          </span>
          <span style={{ color: "#666666", fontSize: 22 }}>
            Before / After 報告ツール
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
