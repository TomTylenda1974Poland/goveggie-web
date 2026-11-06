import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { BRAND_CONTENT } from "./src/lib/commerce/brand-content";

/**
 * Códigos QR del envase: la ruta impresa /p/{qrId} es PERMANENTE; el destino puede
 * cambiar, por eso la redirección es temporal (307). Ver docs/strategy/08-qr-and-analytics.md.
 */
const qrRedirects = Object.entries(BRAND_CONTENT)
  .filter(([, c]) => c.qrId)
  .map(([slug, c]) => ({
    source: `/p/${c.qrId}`,
    destination: `/es/productos/${slug}?utm_source=qr&utm_medium=packaging&utm_campaign=${c.qrId}`,
    permanent: false,
  }));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: { root: fileURLToPath(new URL(".", import.meta.url)) },
  async headers() {
    return [{
      source: "/equipo/:path*",
      headers: [
        { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'; worker-src 'self'; img-src 'self' blob: data:; style-src 'self'; connect-src 'self'; form-action 'none'; frame-ancestors 'none'; base-uri 'self'" },
      ],
    }];
  },
  async redirects() {
    return [
      { source: "/", destination: "/es", permanent: false },
      ...qrRedirects,
      // QR desconocido: catálogo en lugar de un 404 (un envase impreso no se puede corregir).
      { source: "/p/:code", destination: "/es/productos?utm_source=qr&utm_medium=packaging&utm_campaign=unknown", permanent: false },
      // El carrito de prueba se retiró: la web no acepta pedidos.
      { source: "/:locale(es|en)/carrito", destination: "/:locale/donde-comprar", permanent: false },
    ];
  },
};

export default nextConfig;
