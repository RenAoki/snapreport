import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SnapReport — Before/After 報告ツール";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadSyneFont() {
  const css = await fetch(
    "https://fonts.googleapis.com/css2?family=Syne:wght@700&display=swap",
    { headers: { "User-Agent": "Mozilla/5.0" } }
  ).then((r) => r.text());

  const url = css.match(/src: url\((.+?)\) format\('woff2'\)/)?.[1];
  if (!url) throw new Error("Syne font URL not found");
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function OgImage() {
  const syneFont = await loadSyneFont();

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
          gap: 20,
        }}
      >
        {/* ロゴ */}
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            fontFamily: "Syne",
            letterSpacing: "-2px",
          }}
        >
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
            fontFamily: "sans-serif",
          }}
        >
          Before / After 報告ツール
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Syne",
          data: syneFont,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
