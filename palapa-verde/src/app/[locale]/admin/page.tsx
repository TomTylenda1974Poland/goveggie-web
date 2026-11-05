import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductThumb } from "@/components/ProductThumb";
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
  const goveggieConfigured = providerId === "goveggie";

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

      <section aria-labelledby="h-admin-products">
        <div className="section-head">
          <h2 id="h-admin-products">{a.productsHeading}</h2>
        </div>
        <div className="panel table-scroll">
          <table className="spec-table admin-table">
            <thead>
              <tr>
                <th scope="col">{a.product}</th>
                {AUDITED_FIELDS.map((f) => (
                  <th scope="col" key={f}>
                    {a.fields[f]}
                  </th>
                ))}
                <th scope="col">{a.stock}</th>
              </tr>
            </thead>
            <tbody>
              {audits.map(({ product, fields, missing, readyToSell }) => {
                const level = inventory.get(product.id);
                return (
                  <tr key={product.id}>
                    <th scope="row">
                      <div className="admin-product">
                        <ProductThumb product={product} />
                        <span>
                          <Link href={`/${locale}/productos/${product.slug}`}>{pick(product.name, locale)}</Link>
                          <span className={readyToSell ? "state state--ok" : "state state--missing"}>
                            {readyToSell ? a.ready : fill(a.notReady, { n: missing })}
                          </span>
                        </span>
                      </div>
                    </th>
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
                  <span className={goveggieConfigured ? "state state--ok" : "state state--missing"}>
                    {goveggieConfigured ? a.integrations.goveggieConfigured : a.integrations.goveggieState}
                  </span>
                </td>
              </tr>
              <tr>
                <th scope="row">{a.integrations.orders}</th>
                <td>
                  <span className={isTestData ? "state state--missing" : "state state--ok"}>
                    {isTestData ? a.integrations.ordersState : a.integrations.goveggieConfigured}
                  </span>
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
