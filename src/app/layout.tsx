import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import GlobalSearchModal from "@/components/GlobalSearchModal";
import PwaRegister from "@/components/PwaRegister";
import OfflineStatusIndicator from "@/components/OfflineStatusIndicator";

export const metadata: Metadata = {
  title: "Polímata OS",
  description: "Sistema Operativo Personal de Aprendizaje Interdisciplinario (10 Años + Fase 0)",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Polímata OS",
  },
};

export const viewport: Viewport = {
  themeColor: "#0284c7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        <OfflineStatusIndicator />
        <div className="max-w-2xl mx-auto min-h-screen pb-20 px-4 pt-4">
          {children}
        </div>
        <GlobalSearchModal />
        <PwaRegister />
        <BottomNav />
      </body>
    </html>
  );
}

