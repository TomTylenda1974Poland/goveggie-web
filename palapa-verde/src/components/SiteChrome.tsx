import Link from "next/link";
import { PageStartLink } from "@/components/PageStartLink";
import { MobileNavigation } from "@/components/MobileNavigation";
import { LangSwitch } from "@/components/LangSwitch";
import { PalapaLogo } from "@/components/PalapaLogo";
import { partnerUrl, relationship } from "@/content/brand";
import type { Locale } from "@/lib/commerce/types";
import { getDictionary, pick } from "@/lib/i18n";

function brandName(locale: Locale) {
  return relationship.endorsement ? `Palapa Verde — ${pick(relationship.endorsement, locale)}` : "Palapa Verde";
}

export function SiteHeader({ locale, prelaunch }: { locale: Locale; prelaunch: boolean }) {
  const t = getDictionary(locale);
  const links: [string, string][] = [
    [`/${locale}/productos`, t.nav.products],
    [`/${locale}/recetas`, t.nav.recipes],
    [`/${locale}/donde-comprar`, t.nav.whereToBuy],
    [`/${locale}/nosotros`, t.nav.about],
    [`/${locale}/negocios`, t.nav.business],
    [`/${locale}/hoteles-restaurantes`, t.nav.hospitality],
  ];
  return (
    <>
      {prelaunch ? (
        <p className="test-banner" role="note">
          {t.banner.prelaunch}
        </p>
      ) : null}
      <header className="site-header">
        <div className="wrap">
          <div className="panel nav">
            <PageStartLink className="logo" href={`/${locale}`} aria-label={`${brandName(locale)} — ${t.nav.home}`}>
              <PalapaLogo locale={locale} />
            </PageStartLink>
            <nav className="nav-links" aria-label={t.nav.menu}>
              {links.map(([href, label]) => href === `/${locale}/hoteles-restaurantes` ? (
                <PageStartLink key={href} href={href}>{label}</PageStartLink>
              ) : (
                <Link key={href} href={href}>{label}</Link>
              ))}
            </nav>
            <LangSwitch locale={locale} label={t.lang.label} text={t.lang.switchTo} />
            <MobileNavigation locale={locale} links={links} label={t.nav.menu} />
          </div>
        </div>
      </header>
    </>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <footer className="wrap">
      <div className="panel footer-bar">
        <Link className="logo logo--inverse" href={`/${locale}`} aria-label={brandName(locale)}>
          <PalapaLogo locale={locale} inverse />
        </Link>
        <p className="f-desc">{t.footer.about}</p>
        <nav className="f-links" aria-label={t.footer.navigationLabel}>
          <Link href={`/${locale}/recetas`}>{t.nav.recipes}</Link>
          <Link href={`/${locale}/preguntas`}>{t.nav.faq}</Link>
          <Link href={`/${locale}/negocios`}>{t.nav.business}</Link>
          <PageStartLink href={`/${locale}/hoteles-restaurantes`}>{t.nav.hospitality}</PageStartLink>
          <a href={partnerUrl(locale)} rel="noopener">
            Go Veggie Life
          </a>
        </nav>
      </div>
      <div className="f-meta">
        <span>{t.footer.legal}</span>
        <span>{t.footer.proto}</span>
      </div>
    </footer>
  );
}
