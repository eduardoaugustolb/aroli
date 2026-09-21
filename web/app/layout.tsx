import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./styles/base.css";
import "./styles/hero.css";
import "./styles/notebook.css";
import "./styles/sections.css";
import "./styles/cursor.css";
import "./styles/experience.css";

const switzer = localFont({
  src: "./fonts/Switzer-Variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-brand",
});

const title = "Temas escuros e coerentes para VS Code, Zed, Kitty e Starship | Aroli";
const description =
  "Aroli é um sistema visual com temas escuros para o seu fluxo de trabalho: temas para VS Code, Zed e Kitty, prompt para Starship e wallpapers. Mesmas superfícies, mesmo contraste, cor com função.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["aroli", "tema escuro", "dark theme", "zed", "kitty", "starship", "terminal", "wallpapers", "sistema visual"],
  authors: [{ name: "Aroli", url: "https://github.com/eduardoaugustolb/umbra" }],
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "pt_BR",
    siteName: "Aroli",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/aroli-avatar-512.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Aroli",
  description,
  url: "https://github.com/eduardoaugustolb/umbra",
  inLanguage: "pt-BR",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={switzer.variable}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
