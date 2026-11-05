import Link from "next/link";
import { CartLink } from "@/components/CartLink";
import { LangSwitch } from "@/components/LangSwitch";
import { PalapaLogo } from "@/components/PalapaLogo";
import type { Locale } from "@/lib/commerce/types";
import { getDictionary } from "@/lib/i18n";

export const GO_VEGGIE_URL = "https://goveggie-donpollolococabarete-9718.vercel.app";

export function SiteHeader({ locale, isTestData }: { locale: Locale; isTestData: boolean }) {
  const t = getDictionary(locale);
  return (
    <header className="site-header">
      {isTestData ? (
        <p className="test-banner" role="note">
          {t.banner.testData}
        </p>
      ) : null}
      <div className="wrap">
        <div className="panel nav">
          <Link className="logo" href={`/${locale}`} aria-label="Palapa Verde">
            <PalapaLogo />
            <span className="wordmark">
              Palapa <span className="verde">Verde</span>
            </span>
          </Link>
          <nav className="nav-links" aria-label={t.nav.menu}>
            <Link href={`/${locale}/productos`}>{t.nav.products}</Link>
            <Link href={`/${locale}#proceso`}>{t.nav.process}</Link>
            <Link href={`/${locale}#nosotros`}>{t.nav.about}</Link>
          </nav>
          <CartLink href={`/${locale}/carrito`} label={t.nav.cart} />
          <LangSwitch locale={locale} label={t.lang.label} text={t.lang.switchTo} />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <footer className="wrap">
      <div className="panel footer-bar">
        <Link className="logo logo--inverse" href={`/${locale}`} aria-label="Palapa Verde">
          <PalapaLogo />
          <span className="wordmark">Palapa Verde</span>
        </Link>
        <p className="f-desc">{t.footer.about}</p>
        <a className="flink" href={GO_VEGGIE_URL}>
          goveggie.life
        </a>
      </div>
      <div className="f-meta">
        <span>{t.footer.legal}</span>
        <span>{t.footer.proto}</span>
        <Link href={`/${locale}/admin`}>{t.nav.admin}</Link>
      </div>
    </footer>
  );
}
