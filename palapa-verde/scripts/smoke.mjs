#!/usr/bin/env node
/**
 * Prueba de humo de un despliegue (local, preview o producción).
 *   pnpm smoke https://palapa-verde-git-palapa-verde-shop-….vercel.app
 *   pnpm smoke http://localhost:3000
 * Comprueba rutas, redirecciones (QR, carrito), API de pedidos desactivada y que no
 * reaparezcan textos prohibidos (stock ficticio, carrito, placeholders, afirmaciones
 * no verificadas). Sale con código 1 si algo falla. Sin dependencias.
 */
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/+$/, "");

const PAGES = [
  "/es", "/en", "/es/productos", "/en/productos", "/es/recetas", "/en/recetas",
  "/es/donde-comprar", "/es/nosotros", "/es/preguntas", "/es/negocios", "/es/admin",
  "/es/productos/chutney-de-cilantro", "/es/productos/pesto-de-cilantro-con-semillas-de-auyama",
  "/es/productos/hummus-de-zanahoria", "/es/productos/hummus-de-remolacha",
  "/es/productos/salsa-de-aguacate-y-jalapeno", "/robots.txt", "/sitemap.xml",
];

const REDIRECTS = [
  ["/", "/es"],
  ["/p/chutney-cilantro", "/es/productos/chutney-de-cilantro?utm_source=qr"],
  ["/p/pesto-cilantro-auyama", "/es/productos/pesto-de-cilantro-con-semillas-de-auyama?utm_source=qr"],
  ["/p/hummus-zanahoria", "/es/productos/hummus-de-zanahoria?utm_source=qr"],
  ["/p/hummus-remolacha", "/es/productos/hummus-de-remolacha?utm_source=qr"],
  ["/p/salsa-aguacate-jalapeno", "/es/productos/salsa-de-aguacate-y-jalapeno?utm_source=qr"],
  ["/p/codigo-inexistente", "/es/productos?utm_source=qr"],
  ["/es/carrito", "/es/donde-comprar"],
];

/** Textos que no deben aparecer en páginas públicas mientras nada esté a la venta. */
const BANNED = [
  /últimas unidades/i, /last units/i, />\s*disponible\s*</i, />\s*in stock\s*</i, /agotado/i,
  /añadir al carrito/i, /add to cart/i, /precio por confirmar/i, /\[datos/i, /\[company/i,
  /refrigerad/i, /a base de vegetales/i, /orgánic/i, /organic/i, /sin conservantes/i,
];
const PUBLIC_FOR_BANNED = ["/es", "/en", "/es/productos", "/es/productos/hummus-de-remolacha", "/es/negocios", "/es/preguntas"];

/** Páginas de clientes: no enlazan el panel interno /admin (la ruta sigue existiendo para el equipo). */
const PUBLIC_WITHOUT_ADMIN_LINK = [
  "/es", "/en", "/es/negocios", "/en/negocios", "/es/hoteles-restaurantes", "/en/hoteles-restaurantes",
  "/es/recetas", "/en/productos/hummus-de-zanahoria",
];

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`✗ ${msg}`);
};
const ok = (msg) => console.log(`✓ ${msg}`);

async function get(path, init) {
  return fetch(base + path, { redirect: "manual", ...init });
}

for (const path of PAGES) {
  const res = await get(path);
  res.status === 200 ? ok(`${path} 200`) : fail(`${path} → ${res.status}`);
}

{
  const res = await get("/es/pagina-que-no-existe");
  res.status === 404 ? ok("unknown page 404") : fail(`unknown page → ${res.status}`);
}

for (const [from, expected] of REDIRECTS) {
  const res = await get(from);
  const location = res.headers.get("location") ?? "";
  const target = location.replace(/^https?:\/\/[^/]+/, "");
  [307, 308].includes(res.status) && target.startsWith(expected)
    ? ok(`${from} → ${target.split("&")[0]}`)
    : fail(`${from} → ${res.status} ${target || "(no location)"} (expected ${expected})`);
}

{
  const res = await get("/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  res.status === 503 ? ok("/api/orders disabled (503)") : fail(`/api/orders → ${res.status} (expected 503)`);
}

for (const path of PUBLIC_FOR_BANNED) {
  const html = await (await get(path)).text();
  const hits = BANNED.filter((re) => re.test(html)).map(String);
  hits.length === 0 ? ok(`${path} no banned text`) : fail(`${path} contains ${hits.join(", ")}`);
}

for (const path of PUBLIC_WITHOUT_ADMIN_LINK) {
  const res = await get(path);
  const html = await res.text();
  res.status === 200 && !/\/(?:es|en)\/admin\b/.test(html)
    ? ok(`${path} no link to /admin`)
    : fail(res.status === 200 ? `${path} links to /admin` : `${path} → ${res.status}`);
}

{
  const html = await (await get("/es")).text();
  /noindex/.test(html) ? ok("noindex present (prelaunch)") : console.log("! noindex absent — expected only after launch (SITE_INDEXABLE=true)");
}

console.log(failures === 0 ? `\nAll checks passed for ${base}` : `\n${failures} check(s) failed for ${base}`);
process.exit(failures === 0 ? 0 : 1);
