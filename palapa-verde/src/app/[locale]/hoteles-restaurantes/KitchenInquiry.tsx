"use client";

import { useRef, useState, type FormEvent } from "react";
import { CONTACT, GO_VEGGIE_LIFE_HORECA_URL } from "@/content/brand";
import { whatsappShareUrl } from "@/lib/recipe-format";
import styles from "./kitchen-inquiry.module.css";

export const inquiryCopy = {
  es: {
    heading: "Consulta para tu cocina",
    intro: "¿Qué producto buscas y dónde recibirías la entrega? Con eso puedes empezar. Revisarás el mensaje antes de compartirlo.",
    product: "¿Qué producto te interesa?", productPrompt: "Elige una opción",
    products: ["Frutas y vegetales frescos · Go Veggie Life", "Hummus de zanahoria", "Hummus de remolacha", "Pesto de cilantro con semillas de auyama", "Chutney de cilantro", "Salsa de aguacate y jalapeño", "Varios productos o necesito orientación"],
    area: "Zona de entrega", areaHint: "Sector o municipio",
    details: "Añadir detalles para la cotización", optional: "Opcional",
    company: "Nombre de tu negocio", venue: "Tipo de establecimiento", noSelection: "Sin especificar",
    venues: ["Hotel o resort", "Restaurante", "Catering o eventos", "Cafetería o bar", "Otro"],
    pack: "Producto o presentación que buscas", packHint: "Ej. cilantro por caja o hummus en porciones",
    volume: "Consumo semanal estimado", unit: "Unidad", units: ["lb", "kg", "porciones", "cajas"],
    use: "¿Cómo lo usarás?", useHint: "Ej. desayunos, banquetes o servicio a la carta",
    productError: "Elige un producto o la opción de orientación.", areaError: "Escribe el sector o municipio de entrega.",
    volumeError: "Escribe una cantidad mayor que cero, con hasta dos decimales.",
    build: "Revisar mi consulta", preview: "Revisa tu mensaje", edit: "Cambiar mis respuestas", draft: "Mensaje que vas a compartir",
    subject: "Consulta de cocina profesional · Palapa Verde", productLine: "Producto", packLine: "Presentación de interés",
    request: "¿Qué presentaciones se cotizan para esta zona y cómo podemos hacer una prueba en nuestra cocina?",
    how: "Elige en WhatsApp el contacto comercial al que quieres enviarlo, o copia el texto para compartirlo por otro medio.",
    emailHow: "Se abrirá un borrador dirigido a {email}. Pulsa «Enviar» en tu aplicación de correo para hacernos llegar la consulta.",
    verifiedHow: "Revisa el texto y envíalo desde tu aplicación de correo o WhatsApp.",
    choose: "Elegir contacto en WhatsApp", direct: "Abrir WhatsApp de ventas", email: "Abrir correo a ventas",
    copy: "Copiar mensaje", copied: "Mensaje copiado.", fallback: "El texto está seleccionado para que puedas copiarlo.",
    download: "Descargar texto", partner: "Consultar al equipo de Go Veggie Life",
  },
  en: {
    heading: "Ask about your kitchen",
    intro: "What product do you need, and where would you like it delivered? That’s enough to start. You can review your message before sharing it.",
    product: "Which product interests you?", productPrompt: "Choose an option",
    products: ["Fresh fruit & vegetables · Go Veggie Life", "Carrot hummus", "Beet hummus", "Cilantro and pumpkin seed pesto", "Cilantro chutney", "Avocado & jalapeño salsa", "Several products or help choosing"],
    area: "Delivery area", areaHint: "Neighbourhood or municipality",
    details: "Add details for a quote", optional: "Optional",
    company: "Business name", venue: "Type of business", noSelection: "Not specified",
    venues: ["Hotel or resort", "Restaurant", "Catering or events", "Café or bar", "Other"],
    pack: "Product or pack you have in mind", packHint: "e.g. cilantro by the case or single portions of hummus",
    volume: "Estimated weekly use", unit: "Unit", units: ["lb", "kg", "servings", "cases"],
    use: "How will you use it?", useHint: "e.g. breakfast, banquets or à la carte service",
    productError: "Choose a product or select help choosing.", areaError: "Enter the neighbourhood or municipality for delivery.",
    volumeError: "Enter a quantity above zero, with up to two decimal places.",
    build: "Review my enquiry", preview: "Review your message", edit: "Edit my answers", draft: "Message to share",
    subject: "Professional kitchen enquiry · Palapa Verde", productLine: "Product", packLine: "Preferred pack",
    request: "Which packs can you quote for this area, and how could we try them in our kitchen?",
    how: "Choose your sales contact in WhatsApp, or copy the text to share it another way.",
    emailHow: "Your email app will open a draft addressed to {email}. Press Send in your email app to send us the enquiry.",
    verifiedHow: "Review the text and send it from your email app or WhatsApp.",
    choose: "Choose contact in WhatsApp", direct: "Open sales WhatsApp", email: "Open email to sales",
    copy: "Copy message", copied: "Message copied.", fallback: "The text is selected so you can copy it.",
    download: "Download text", partner: "Contact the Go Veggie Life team",
  },
} as const;

type Props = { locale: keyof typeof inquiryCopy };
type ValidatedField = "product" | "area" | "volume";

export function KitchenInquiry({ locale }: Props) {
  const t = inquiryCopy[locale];
  const [review, setReview] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<Partial<Record<ValidatedField, string>>>({});
  const previousDraft = useRef("");
  const fields = useRef<HTMLFormElement>(null);
  const details = useRef<HTMLDetailsElement>(null);
  const reviewTitle = useRef<HTMLHeadingElement>(null);
  const preview = useRef<HTMLTextAreaElement>(null);
  const salesNumber = CONTACT.whatsappNumber?.replace(/\D/g, "");
  const email = CONTACT.salesEmail;
  const ready = Boolean(message.trim());
  const emailHref = email ? `mailto:${email}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(message)}` : undefined;

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "").trim();
    const product = value("product");
    const area = value("area");
    const volume = value("volume");
    const numericVolume = Number(volume.replace(",", "."));
    const invalid: Partial<Record<ValidatedField, string>> = {};
    if (!product) invalid.product = t.productError;
    if (!area) invalid.area = t.areaError;
    if (volume && (!/^\d{1,6}(?:[.,]\d{1,2})?$/.test(volume) || numericVolume <= 0)) invalid.volume = t.volumeError;
    setErrors(invalid);
    const first = Object.keys(invalid)[0];
    if (first) {
      if (invalid.volume && details.current) details.current.open = true;
      requestAnimationFrame(() => (form.elements.namedItem(first) as HTMLElement | null)?.focus());
      return;
    }

    const quantity = volume ? new Intl.NumberFormat(locale === "es" ? "es-DO" : "en-US")
      .format(numericVolume) + " " + value("unit") : "";
    const fieldsToShare = [
      [t.company, value("company")], [t.venue, value("venue")], [t.productLine, product], [t.area, area],
      [t.packLine, value("pack")], [t.volume, quantity], [t.use, value("use")],
    ];
    const generated = [
      t.subject, "", ...fieldsToShare.filter(([, answer]) => answer).map(([label, answer]) => label + ": " + answer),
      "", t.request,
    ].join("\n");
    if (generated !== previousDraft.current || !message.trim()) setMessage(generated);
    previousDraft.current = generated;
    setStatus("");
    setReview(true);
    requestAnimationFrame(() => reviewTitle.current?.focus());
  }

  function editAnswers() {
    setReview(false);
    setStatus("");
    requestAnimationFrame(() => (fields.current?.elements.namedItem("product") as HTMLElement | null)?.focus());
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

  function clearError(name: ValidatedField) {
    if (errors[name]) setErrors(current => ({ ...current, [name]: undefined }));
  }

  return (
    <section id="consulta" className={styles.section} aria-labelledby="consulta-heading">
      <header className={styles.heading}>
        <h2 id="consulta-heading" className="h-md">{t.heading}</h2>
        {!review && <p>{t.intro}</p>}
      </header>
      <form ref={fields} className={styles.form} onSubmit={prepare} hidden={review} noValidate>
        <div className={styles.field}>
          <label htmlFor="chef-product">{t.product}</label>
          <select id="chef-product" name="product" defaultValue="" required onChange={() => clearError("product")} aria-invalid={Boolean(errors.product)}
            aria-describedby={errors.product ? "chef-product-error" : undefined}>
            <option value="" disabled>{t.productPrompt}</option>
            {t.products.map(item => <option key={item}>{item}</option>)}
          </select>
          {errors.product && <p id="chef-product-error" className={styles.error}>{errors.product}</p>}
        </div>
        <div className={styles.field}>
          <label htmlFor="chef-area">{t.area}</label>
          <input id="chef-area" name="area" required maxLength={120} onChange={() => clearError("area")} placeholder={t.areaHint}
            aria-invalid={Boolean(errors.area)} aria-describedby={errors.area ? "chef-area-error" : undefined} />
          {errors.area && <p id="chef-area-error" className={styles.error}>{errors.area}</p>}
        </div>
        <details className={styles.optional} ref={details}>
          <summary>{t.details}<span className={styles.optionalHint}>{t.optional}</span></summary>
          <div className={styles.detailsGrid}>
            <label>{t.company}<input name="company" autoComplete="organization" maxLength={100} /></label>
            <label>{t.venue}<select name="venue" defaultValue=""><option value="">{t.noSelection}</option>
              {t.venues.map(item => <option key={item}>{item}</option>)}
            </select></label>
            <label className={styles.full}>{t.pack}<input name="pack" maxLength={160} placeholder={t.packHint} /></label>
            <div className={styles.quantity}>
              <label>{t.volume}<input name="volume" inputMode="decimal" maxLength={9} onChange={() => clearError("volume")} aria-invalid={Boolean(errors.volume)}
                aria-describedby={errors.volume ? "chef-volume-error" : undefined} /></label>
              <label>{t.unit}<select name="unit">{t.units.map(unit => <option key={unit}>{unit}</option>)}</select></label>
              {errors.volume && <p id="chef-volume-error" className={styles.error}>{errors.volume}</p>}
            </div>
            <label>{t.use}<input name="use" maxLength={180} placeholder={t.useHint} /></label>
          </div>
        </details>
        <div className={styles.full}><button className="btn" type="submit">{t.build}</button></div>
      </form>
      {review && (
        <div className={styles.result}>
          <div className={styles.reviewHeading}>
            <h3 ref={reviewTitle} tabIndex={-1}>{t.preview}</h3>
            <button className={styles.textButton} type="button" onClick={editAnswers}>{t.edit}</button>
          </div>
          <label htmlFor="chef-message">{t.draft}</label>
          <textarea id="chef-message" ref={preview} value={message} rows={8} onChange={event => {
            setMessage(event.target.value);
            setStatus("");
          }} />
          <p>{email && !salesNumber ? t.emailHow.replace("{email}", email) : salesNumber ? t.verifiedHow : t.how}</p>
          {ready && (
            <div className={styles.actions}>
              {salesNumber || !email ? (
                <a className="btn" target="_blank" rel="noopener noreferrer"
                  href={salesNumber ? `https://wa.me/${salesNumber}?text=${encodeURIComponent(message)}` : whatsappShareUrl(message)}>
                  {salesNumber ? t.direct : t.choose}
                </a>
              ) : <a className="btn" href={emailHref}>{t.email}</a>}
              <button type="button" className="btn btn--ghost" onClick={copyMessage}>{t.copy}</button>
              {salesNumber && email && <a href={emailHref}>{t.email}</a>}
              <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(message)}`} download="palapa-verde.txt">{t.download}</a>
            </div>
          )}
          {!salesNumber && !email &&
            <a className={styles.partner} href={GO_VEGGIE_LIFE_HORECA_URL + "#consulta"} target="_blank" rel="noopener noreferrer">{t.partner}</a>}
        </div>
      )}
      <p role="status" className={styles.status}>{status}</p>
    </section>
  );
}

export default KitchenInquiry;
