"use client";

import { useRef, useState, type FormEvent } from "react";
import { CONTACT } from "@/content/brand";
import { whatsappShareUrl } from "@/lib/recipe-format";
import styles from "./kitchen-inquiry.module.css";

const copy = {
  es: {
    heading: "Prepare su consulta", intro: "Indique qué usa su cocina y en qué zona recibiría la entrega. Podrá revisar el mensaje antes de compartirlo.",
    venue: "Tipo de establecimiento", venues: ["Hotel", "Restaurante"], product: "Producto",
    products: ["Vegetales frescos · Go Veggie Life", "Hummus de zanahoria · Palapa Verde", "Hummus de remolacha · Palapa Verde", "Pesto de cilantro con semillas de auyama · Palapa Verde", "Chutney de cilantro · Palapa Verde", "Salsa de aguacate y jalapeño · Palapa Verde"],
    pack: "Producto y presentación de interés (opcional)", packHint: "Ej. zanahoria, bolsa de 5 lb; hummus, envase de 1 kg", packLine: "Presentación de interés",
    volume: "Consumo semanal estimado (opcional)", unit: "Unidad", units: ["lb", "kg", "porciones"],
    area: "Zona de entrega", areaHint: "Sector o municipio", use: "Uso en cocina (opcional)", useHint: "Por ejemplo, buffet, banquetes o servicio a la carta",
    build: "Preparar mensaje", preview: "Su mensaje", pending: "Por definir", subject: "Consulta para cocina profesional",
    request: "¿Podrían indicar qué presentaciones podríamos probar, cómo se cotizan y si pueden entregar en nuestra zona?",
    prefix: "Consumo semanal", useLine: "Uso en cocina", copy: "Copiar mensaje", copied: "Mensaje copiado.",
    fallback: "El texto está seleccionado. Puede copiarlo manualmente o descargarlo.", download: "Descargar texto",
    choose: "Elegir contacto en WhatsApp", direct: "Abrir WhatsApp de ventas", email: "Abrir correo a ventas", how: "Elija a su representante en WhatsApp o comparta el texto por su canal habitual.",
    verifiedHow: "Revise el mensaje y elija cómo compartirlo con el equipo comercial.",
  },
  en: {
    heading: "Prepare your enquiry", intro: "Tell us what your kitchen uses and where you would need delivery. You can review your message before sharing it.",
    venue: "Type of business", venues: ["Hotel", "Restaurant"], product: "Product",
    products: ["Fresh produce · Go Veggie Life", "Carrot hummus · Palapa Verde", "Beet hummus · Palapa Verde", "Cilantro and pumpkin seed pesto · Palapa Verde", "Cilantro chutney · Palapa Verde", "Avocado and jalapeño salsa · Palapa Verde"],
    pack: "Produce or pack size of interest (optional)", packHint: "e.g. carrots, 5 lb bag, or hummus, 1 kg tub", packLine: "Preferred pack",
    volume: "Estimated weekly use (optional)", unit: "Unit", units: ["lb", "kg", "servings"],
    area: "Delivery area", areaHint: "Neighbourhood or municipality", use: "Kitchen use (optional)", useHint: "For example, buffet, banquets or à la carte service",
    build: "Prepare message", preview: "Your message", pending: "To be confirmed", subject: "Professional kitchen enquiry",
    request: "Which pack sizes could we test, how are they priced, and could you deliver to our area?",
    prefix: "Weekly use", useLine: "Kitchen use", copy: "Copy message", copied: "Message copied.",
    fallback: "The text is selected. Copy it manually or download it below.", download: "Download text",
    choose: "Choose contact in WhatsApp", direct: "Open sales WhatsApp", email: "Email sales", how: "Choose your sales representative in WhatsApp or send them the text through your usual channel.",
    verifiedHow: "Review the message and choose how you would like to share it with sales.",
  },
} as const;

type Props = { locale: keyof typeof copy };

export function KitchenInquiry({ locale }: Props) {
  const t = copy[locale];
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const preview = useRef<HTMLTextAreaElement>(null);
  const salesNumber = CONTACT.whatsappNumber?.replace(/\D/g, "");

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) ?? "").trim();
    const amount = value("volume");
    const weekly = amount
      ? new Intl.NumberFormat(locale === "es" ? "es-DO" : "en-US", { maximumFractionDigits: 2 }).format(Number(amount)) + " " + value("unit")
      : t.pending;
    const lines = [
      t.subject, "",
      t.venue + ": " + value("venue"), t.product + ": " + value("product"),
      t.area + ": " + value("area"), t.prefix + ": " + weekly,
    ];
    if (value("pack")) lines.push(t.packLine + ": " + value("pack"));
    if (value("use")) lines.push(t.useLine + ": " + value("use"));
    lines.push("", t.request);
    setStatus("");
    setMessage(lines.join("\n"));
    requestAnimationFrame(() => preview.current?.focus());
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setStatus(t.copied);
    } catch {
      preview.current?.focus();
      preview.current?.select();
      setStatus(t.fallback);
    }
  }

  return (
    <section id="consulta" className={styles.section} aria-labelledby="consulta-heading">
      <header className={styles.heading}>
        <h2 id="consulta-heading" className="h-md">{t.heading}</h2>
        <p>{t.intro}</p>
      </header>
      <form className={styles.form} onSubmit={prepare} onChange={() => { setMessage(""); setStatus(""); }}>
        <label>{t.venue}<select name="venue">{t.venues.map(item => <option key={item}>{item}</option>)}</select></label>
        <label>{t.product}<select name="product">{t.products.map(item => <option key={item}>{item}</option>)}</select></label>
        <label className={styles.full}>{t.pack}<input name="pack" maxLength={160} placeholder={t.packHint} /></label>
        <div className={styles.quantity}>
          <label>{t.volume}<input name="volume" inputMode="decimal" type="number" min="0.01" max="999999" step="0.01" /></label>
          <label>{t.unit}<select name="unit">{t.units.map(unit => <option key={unit}>{unit}</option>)}</select></label>
        </div>
        <label>{t.area}<input name="area" required pattern=".*\S.*" maxLength={120} placeholder={t.areaHint} /></label>
        <label className={styles.full}>{t.use}<input name="use" maxLength={180} placeholder={t.useHint} /></label>
        <div className={styles.full}><button className="btn" type="submit">{t.build}</button></div>
      </form>
      {message && (
        <div className={styles.result}>
          <label htmlFor="chef-message">{t.preview}</label>
          <textarea id="chef-message" ref={preview} value={message} rows={9} readOnly />
          <p>{salesNumber || CONTACT.salesEmail ? t.verifiedHow : t.how}</p>
          <div className={styles.actions}>
            <button type="button" className="btn btn--ghost" onClick={copyMessage}>{t.copy}</button>
            <a className="btn" target="_blank" rel="noopener noreferrer"
              href={salesNumber ? `https://wa.me/${salesNumber}?text=${encodeURIComponent(message)}` : whatsappShareUrl(message)}>
              {salesNumber ? t.direct : t.choose}
            </a>
            {CONTACT.salesEmail && (
              <a href={`mailto:${CONTACT.salesEmail}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(message)}`}>{t.email}</a>
            )}
            <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(message)}`} download="consulta-cocina.txt">{t.download}</a>
          </div>
        </div>
      )}
      <p role="status" className={styles.status}>{status}</p>
    </section>
  );
}

export default KitchenInquiry;
