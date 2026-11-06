import type { Metadata, Viewport } from "next";
import { Archivo_Black, Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AnalyticsListener } from "@/components/AnalyticsListener";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { visibleRecipes } from "@/content/recipes";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { BRAND_CONTENT } from "@/lib/commerce/brand-content";
import { LOCALES } from "@/lib/commerce/types";
import { getDictionary, isLocale } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";
import "../globals.css";

const display = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const botanical = Cormorant_Garamond({
  weight: ["500"],
  style: ["italic"],
  subsets: ["latin"],
  variable: "--font-botanical",
  display: "swap",
});

const label = Playfair_Display({ weight: ["800", "900"], subsets: ["latin"], variable: "--font-label", display: "swap" });

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
    metadataBase: new URL(siteUrl()),
    referrer: "origin",
    title: { default: t.meta.title, template: "%s · Palapa Verde" },
    description: t.meta.description,
    robots: indexable ? undefined : { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: "Palapa Verde",
      locale: locale === "es" ? "es_DO" : "en_US",
      title: t.meta.title,
      description: t.meta.description,
      images: [{ url: "/media/hero-linea.jpg", width: 1536, height: 1024 }],
    },
  };
}

export const viewport: Viewport = { themeColor: "#ffffff" };

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  // Aviso de prelanzamiento mientras ningún producto esté a la venta.
  const prelaunch = !Object.values(BRAND_CONTENT).some((c) => c.launch === "available");

  const publicPaths = [
    "", "/productos", "/recetas", "/nosotros", "/preguntas", "/negocios", "/hoteles-restaurantes", "/donde-comprar",
    ...Object.keys(BRAND_CONTENT).map(slug => `/productos/${slug}`),
    ...visibleRecipes().map(recipe => `/recetas/${recipe.slug}`),
  ].map(path => `/${locale}${path}`);

  return (
    <html lang={locale} className={`${display.variable} ${body.variable} ${botanical.variable} ${label.variable}`}>
      <body>
        <a className="skip" href="#contenido">
          {locale === "es" ? "Saltar al contenido" : "Skip to content"}
        </a>
        <SiteHeader locale={locale} prelaunch={prelaunch} />
        <main id="contenido" className="wrap">
          {children}
        </main>
        <SiteFooter locale={locale} />
        <AnalyticsListener />
        {process.env.VERCEL_ENV === "production" && <SiteAnalytics paths={publicPaths} />}
      </body>
    </html>
  );
}
