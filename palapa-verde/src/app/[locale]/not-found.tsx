import Link from "next/link";

/** Next.js no pasa `params` a not-found: se muestra en los dos idiomas. */
export default function NotFound() {
  return (
    <section className="panel pad">
      <h1 className="h-md">Página no encontrada · Page not found</h1>
      <p className="lead">
        <Link href="/es">Volver al inicio</Link> · <Link href="/en">Back to home</Link>
      </p>
    </section>
  );
}
