import type { Metadata, Viewport } from "next";
import { Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = "https://snapreport-psi.vercel.app";

export const metadata: Metadata = {
  title: "SnapReport",
  description: "Before/After 報告ツール",
  manifest: "/manifest.json",
  openGraph: {
    title: "SnapReport",
    description: "Before/After 報告ツール",
    url: baseUrl,
    siteName: "SnapReport",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapReport",
    description: "Before/After 報告ツール",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0e0e0e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={syne.className}>
      <body>{children}</body>
    </html>
  );
}
