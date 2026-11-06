import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductThumb } from "@/components/ProductThumb";
import { BRAND_RELATIONSHIP, CONTACT, MANUFACTURER } from "@/content/brand";
import { RECIPES } from "@/content/recipes";
import { STOCKISTS } from "@/content/stockists";
import { auditCatalog, AUDITED_FIELDS } from "@/lib/commerce/completeness";
import { fill, getDictionary, isLocale, pick } from "@/lib/i18n";
import { OPEN_BUSINESS_ITEMS } from "@/lib/open-items";
import { loadCatalog } from "@/lib/shop";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).admin.title, robots: { index: false, follow: false } } : {};
}

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const a = t.admin;
  const { products, inventory, providerId, isTestData } = await loadCatalog();
  const audits = auditCatalog(products);
  const totalMissing = audits.reduce((n, x) => n + x.missing, 0);
  const tested = RECIPES.filter((r) => r.status === "tested").length;
  const analyticsProvider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? null;

  const checklist: [string, boolean, string?][] = [
    [a.checklist.relationship, BRAND_RELATIONSHIP !== "unconfirmed", BRAND_RELATIONSHIP],
    [a.checklist.manufacturer, MANUFACTURER !== null],
    [a.checklist.range, products.some((p) => p.launch !== "concept")],
    [a.checklist.recipes, tested === RECIPES.length, fill(a.recipesCount, { tested, draft: RECIPES.length - tested })],
    [a.checklist.stockists, STOCKISTS.length > 0, String(STOCKISTS.length)],
    [a.checklist.contact, CONTACT.salesEmail !== null || CONTACT.whatsappNumber !== null],
    [a.checklist.analytics, analyticsProvider !== null, analyticsProvider ?? undefined],
    [a.checklist.domain, Boolean(process.env.SITE_URL), process.env.SITE_URL],
  ];

  return (
    <>
      <div className="page-head">
        <h1>{a.title}</h1>
        <p className="lead">{a.intro}</p>
        <p className="note">{a.readOnly}</p>
      </div>

      <section className="panel pad admin-summary">
        <dl>
          <div>
            <dt>{a.source}</dt>
            <dd>{providerId === "mock" ? a.sourceMock : a.sourceGoveggie}</dd>
          </div>
          <div>
            <dt>{a.productsHeading}</dt>
            <dd>{products.length}</dd>
          </div>
          <div>
            <dt>{a.state.missing}</dt>
            <dd className="pending">{fill(a.missingTotal, { n: totalMissing })}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="h-admin-check">
        <div className="section-head">
          <h2 id="h-admin-check">{a.checklistHeading}</h2>
        </div>
        <div className="panel">
          <table className="spec-table">
            <tbody>
              {checklist.map(([label, done, detail]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>
                    <span className={done ? "state state--ok" : "state state--missing"}>
                      {done ? a.checklistState.done : a.checklistState.pending}
                    </span>
                    {detail ? <span className="note"> {detail}</span> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="h-admin-products">
        <div className="section-head">
          <h2 id="h-admin-products">{a.productsHeading}</h2>
        </div>
        <div className="panel table-scroll">
          <table className="spec-table admin-table">
            <thead>
              <tr>
                <th scope="col">{a.product}</th>
                <th scope="col">{a.launch}</th>
                {AUDITED_FIELDS.map((f) => (
                  <th scope="col" key={f}>
                    {a.fields[f]}
                  </th>
                ))}
                <th scope="col">{a.stock}</th>
              </tr>
            </thead>
            <tbody>
              {audits.map(({ product, fields, missing, complete }) => {
                const level = inventory.get(product.id);
                return (
                  <tr key={product.id}>
                    <th scope="row">
                      <div className="admin-product">
                        <ProductThumb product={product} />
                        <span>
                          <Link href={`/${locale}/productos/${product.slug}`}>{pick(product.name, locale)}</Link>
                          <span className={complete ? "state state--ok" : "state state--missing"}>
                            {complete ? a.ready : fill(a.notReady, { n: missing })}
                          </span>
                          {product.qrId ? <code className="note">/p/{product.qrId}</code> : null}
                        </span>
                      </div>
                    </th>
                    <td>{t.launch[product.launch]}</td>
                    {fields.map(({ field, state }) => (
                      <td key={field}>
                        <span className={`state state--${state}`}>{a.state[state]}</span>
                      </td>
                    ))}
                    <td>
                      {level ? level.available : "—"}
                      {isTestData ? <span className="note"> ({a.stockTest})</span> : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="h-admin-integrations">
        <div className="section-head">
          <h2 id="h-admin-integrations">{a.integrationHeading}</h2>
        </div>
        <div className="panel">
          <table className="spec-table">
            <tbody>
              <tr>
                <th scope="row">{a.integrations.goveggie}</th>
                <td>
                  <span className={providerId === "goveggie" ? "state state--ok" : "state state--missing"}>
                    {providerId === "goveggie" ? a.integrations.goveggieConfigured : a.integrations.goveggieState}
                  </span>
                </td>
              </tr>
              <tr>
                <th scope="row">{a.integrations.orders}</th>
                <td>
                  <span className="state state--missing">{a.integrations.ordersState}</span>
                </td>
              </tr>
              <tr>
                <th scope="row">{a.integrations.payments}</th>
                <td>
                  <span className="state state--missing">{a.integrations.paymentsState}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="h-admin-business">
        <div className="section-head">
          <h2 id="h-admin-business">{a.businessHeading}</h2>
        </div>
        <ol className="panel pad open-items">
          {OPEN_BUSINESS_ITEMS.map((item) => (
            <li key={item.id}>{pick(item.text, locale)}</li>
          ))}
        </ol>
      </section>
    </>
  );
}
