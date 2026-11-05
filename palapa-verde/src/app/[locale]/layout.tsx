import type { Metadata, Viewport } from "next";
import { Archivo_Black, Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { getCommerce } from "@/lib/commerce";
import { LOCALES } from "@/lib/commerce/types";
import { getDictionary, isLocale } from "@/lib/i18n";
import "../globals.css";

const display = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const botanical = Cormorant_Garamond({
  weight: ["500", "600"],
  style: ["italic"],
  subsets: ["latin"],
  variable: "--font-botanical",
  display: "swap",
});

const label = Playfair_Display({ weight: ["700", "800", "900"], subsets: ["latin"], variable: "--font-label", display: "swap" });

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

type LayoutProps = { children: ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Omit<LayoutProps, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  const indexable = process.env.SITE_INDEXABLE === "true";
  return {
    title: { default: t.meta.title, template: "%s · Palapa Verde" },
    description: t.meta.description,
    robots: indexable ? undefined : { index: false, follow: false },
    alternates: { languages: { es: "/es", en: "/en" } },
  };
}

export const viewport: Viewport = { themeColor: "#ffffff" };

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { isTestData } = getCommerce();

  return (
    <html lang={locale} className={`${display.variable} ${body.variable} ${botanical.variable} ${label.variable}`}>
      <body>
        <a className="skip" href="#contenido">
          {locale === "es" ? "Saltar al contenido" : "Skip to content"}
        </a>
        <SiteHeader locale={locale} isTestData={isTestData} />
        <main id="contenido" className="wrap">
          {children}
        </main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
