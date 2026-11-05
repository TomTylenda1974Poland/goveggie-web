import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CartView } from "@/components/CartView";
import { getDictionary, isLocale } from "@/lib/i18n";
import { loadCatalog } from "@/lib/shop";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).cart.title } : {};
}

export default async function CartPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { products, inventory, isTestData } = await loadCatalog();
  const stock = Object.fromEntries([...inventory].map(([id, level]) => [id, level.available]));

  return (
    <>
      <div className="page-head">
        <h1>{t.cart.title}</h1>
      </div>
      <CartView
        locale={locale}
        products={products.map(({ id, slug, name, price, images, art }) => ({ id, slug, name, price, images, art }))}
        stock={stock}
        isTestData={isTestData}
        t={t.cart}
      />
    </>
  );
}
