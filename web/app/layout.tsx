import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./styles/base.css";
import "./styles/hero.css";
import "./styles/notebook.css";
import "./styles/sections.css";
import "./styles/cursor.css";
import "./styles/experience.css";

const aroliSans = localFont({
  src: [
    { path: "./fonts/AroliSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/AroliSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/AroliSans-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/AroliSans-Bold.woff2", weight: "700", style: "normal" },
  ],
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
  authors: [{ name: "Aroli", url: "https://github.com/eduardoaugustolb/aroli" }],
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
  url: "https://github.com/eduardoaugustolb/aroli",
  inLanguage: "pt-BR",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={aroliSans.variable}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
