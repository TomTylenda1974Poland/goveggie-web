"use client";

import { useRef, useState, type FormEvent } from "react";
import { CONTACT } from "@/content/brand";
import type { Locale } from "@/lib/commerce/types";
import { whatsappShareUrl } from "@/lib/recipe-format";
import styles from "./business-inquiry.module.css";

const copy = {
  es: {
    heading: "Consulta para tu negocio", audience: "¿Qué tipo de negocio tienes?", choose: "Elige tu tipo de negocio",
    audiences: ["Supermercado o colmado", "Hotel o restaurante", "Distribuidor", "Otro negocio"],
    intent: "¿Qué necesitas?", topics: ["Ver el catálogo", "Probar formatos", "Consultar distribución", "Hacer una pregunta"],
    requests: [
      "Me gustaría conocer el catálogo de Palapa Verde para mi negocio.",
      "¿Qué formatos podríamos probar y cómo se coordina una prueba?",
      "¿Con quién puedo conversar sobre la distribución de Palapa Verde en mi zona?",
    ],
    question: "Tu pregunta", optional: "Añadir datos de mi negocio (opcional)", company: "Nombre del negocio",
    area: "Zona o municipio", more: "¿Algo más que debamos saber?", moreHint: "Por ejemplo, un producto que te interesa",
    noAudience: "Elige un tipo de negocio.", noIntent: "Elige el motivo de tu consulta.", noQuestion: "Escribe la pregunta que quieres compartir.",
    review: "Revisar mi consulta", subject: "Consulta comercial · Palapa Verde", audienceLine: "Tipo de negocio", intentLine: "Motivo",
    extraLine: "Detalles", draft: "Tu mensaje", edit: "Cambiar respuestas",
    intro: "Puedes revisar el mensaje antes de compartirlo.", salesContact: "Correo comercial",
    emailHelp: "Se abrirá un borrador dirigido a {email}. Pulsa «Enviar» en tu aplicación de correo para hacernos llegar tu consulta.", directHelp: "Abre WhatsApp para revisar y enviar el mensaje a ventas.",
    shareHelp: "Elige tu contacto comercial en WhatsApp o copia el mensaje para compartirlo por otro medio.",
    whatsapp: "Elegir contacto en WhatsApp", salesWhatsApp: "Abrir WhatsApp de ventas", email: "Abrir borrador de correo",
    copy: "Copiar mensaje", copied: "Mensaje copiado.", manual: "El texto está seleccionado para que puedas copiarlo.",
  },
  en: {
    heading: "Ask about your business", audience: "What kind of business do you run?", choose: "Choose your business type",
    audiences: ["Supermarket or grocery shop", "Hotel or restaurant", "Distributor", "Other business"],
    intent: "What do you need?", topics: ["See the catalogue", "Try a pack format", "Ask about distribution", "Ask a question"],
    requests: [
      "I’d like to see the Palapa Verde catalogue for my business.",
      "Which packs could we try, and how can we arrange a trial?",
      "Who can I speak with about distributing Palapa Verde in my area?",
    ],
    question: "Your question", optional: "Add business details (optional)", company: "Business name",
    area: "Area or municipality", more: "Anything else we should know?", moreHint: "For example, a product you’re interested in",
    noAudience: "Choose a business type.", noIntent: "Choose the reason for your enquiry.", noQuestion: "Write the question you’d like to share.",
    review: "Review my enquiry", subject: "Business enquiry · Palapa Verde", audienceLine: "Business type", intentLine: "Reason",
    extraLine: "Details", draft: "Your message", edit: "Edit answers",
    intro: "You can review the message before sharing it.", salesContact: "Sales email",
    emailHelp: "Your email app will open a draft addressed to {email}. Press Send in your email app to send us your enquiry.", directHelp: "Open WhatsApp to review and send your message to sales.",
    shareHelp: "Choose your sales contact in WhatsApp or copy the message to share it another way.",
    whatsapp: "Choose contact in WhatsApp", salesWhatsApp: "Open sales WhatsApp", email: "Open email draft",
    copy: "Copy message", copied: "Message copied.", manual: "The text is selected so you can copy it.",
  },
} as const;

const topics = ["catalogue", "trial", "distribution", "question"] as const;
type Topic = (typeof topics)[number];
type Errors = Partial<Record<"audience" | "topic" | "question", string>>;

export function BusinessInquiry({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [topic, setTopic] = useState<Topic | null>(null);
  const [review, setReview] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const lastGenerated = useRef("");
  const audienceInput = useRef<HTMLSelectElement>(null);
  const firstTopic = useRef<HTMLInputElement>(null);
  const questionInput = useRef<HTMLTextAreaElement>(null);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const message = useRef<HTMLTextAreaElement>(null);
  const number = CONTACT.whatsappNumber?.replace(/\D/g, "");
  const email = CONTACT.salesEmail;
  const contactHref = email ? `mailto:${email}?subject=${encodeURIComponent(t.subject)}` : undefined;
  const mailto = contactHref ? contactHref + "&body=" + encodeURIComponent(draft) : undefined;

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const answers = new FormData(event.currentTarget);
    const get = (key: string) => String(answers.get(key) ?? "").trim();
    const audience = get("audience");
    const question = get("question");
    const invalid: Errors = {};
    if (!audience) invalid.audience = t.noAudience;
    if (!topic) invalid.topic = t.noIntent;
    if (topic === "question" && !question) invalid.question = t.noQuestion;
    setErrors(invalid);
    if (!topic || Object.keys(invalid).length) {
      const field = invalid.audience ? audienceInput : invalid.topic ? firstTopic : questionInput;
      requestAnimationFrame(() => field.current?.focus());
      return;
    }
    const chosen = topics.indexOf(topic);
    const fields = [
      [t.audienceLine, audience], [t.intentLine, t.topics[chosen]], [t.company, get("company")], [t.area, get("area")],
      [t.extraLine, get("note")],
    ];
    const generated = [
      t.subject, "", ...fields.filter(([, value]) => value).map(([label, value]) => label + ": " + value),
      "", topic === "question" ? question : t.requests[chosen],
    ].join("\n");
    if (lastGenerated.current !== generated || !draft.trim()) setDraft(generated);
    lastGenerated.current = generated;
    setStatus("");
    setReview(true);
    requestAnimationFrame(() => previewHeading.current?.focus());
  }

  function editAnswers() {
    setStatus("");
    setReview(false);
    requestAnimationFrame(() => audienceInput.current?.focus());
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(draft);
      setStatus(t.copied);
    } catch {
      message.current?.focus();
      message.current?.select();
      setStatus(t.manual);
    }
  }

  return (
    <section id="contacto" className={`panel pad ${styles.section}`} aria-labelledby="h-contact">
      <h2 id="h-contact" className="h-md">{t.heading}</h2>
      {email && !review && <p className={styles.contact}>{t.salesContact} · <a href={contactHref}>{email}</a></p>}
      <form className={styles.form} hidden={review} onSubmit={prepare} noValidate>
        <div className={styles.audience}>
          <label htmlFor="business-audience">{t.audience}</label>
          <select ref={audienceInput} id="business-audience" name="audience" defaultValue="" required
            aria-invalid={Boolean(errors.audience)} aria-describedby={errors.audience ? "business-audience-error" : undefined}
            onChange={() => setErrors(current => ({ ...current, audience: undefined }))}>
            <option value="" disabled>{t.choose}</option>
            {t.audiences.map(item => <option key={item}>{item}</option>)}
          </select>
          {errors.audience && <p id="business-audience-error" className={styles.error}>{errors.audience}</p>}
        </div>
        <fieldset className={styles.topic} aria-describedby={errors.topic ? "business-topic-error" : undefined}>
          <legend>{t.intent}</legend>
          <div className={styles.choices}>
            {topics.map((key, index) => (
              <label key={key} className={styles.choice}>
                <input ref={index === 0 ? firstTopic : undefined} type="radio" name="topic" value={key}
                  required checked={topic === key} aria-invalid={Boolean(errors.topic)}
                  aria-describedby={errors.topic ? "business-topic-error" : undefined}
                  onChange={() => { setTopic(key); setErrors(current => ({ ...current, topic: undefined, question: undefined })); }} />
                <span>{t.topics[index]}</span>
              </label>
            ))}
          </div>
          {errors.topic && <p id="business-topic-error" className={styles.error}>{errors.topic}</p>}
        </fieldset>
        <div className={styles.field} hidden={topic !== "question"}>
          <label htmlFor="business-question">{t.question}</label>
          <textarea ref={questionInput} id="business-question" name="question" disabled={topic !== "question"}
            required={topic === "question"} maxLength={400} rows={2} aria-invalid={Boolean(errors.question)}
            aria-describedby={errors.question ? "business-question-error" : undefined}
            onChange={() => setErrors(current => ({ ...current, question: undefined }))} />
          {errors.question && <p id="business-question-error" className={styles.error}>{errors.question}</p>}
        </div>
        <details className={styles.details}>
          <summary>{t.optional}</summary>
          <div className={styles.optionalGrid}>
            <label>{t.company}<input name="company" autoComplete="organization" maxLength={100} /></label>
            <label>{t.area}<input name="area" maxLength={120} /></label>
            <label className={styles.full}>{t.more}<input name="note" placeholder={t.moreHint} maxLength={220} /></label>
          </div>
        </details>
        <div className={styles.next}>
          <button type="submit" className="btn">{t.review}</button>
          <p>{t.intro}</p>
        </div>
      </form>
      {review && (
        <div className={styles.review}>
          <div className={styles.reviewTop}>
            <h3 ref={previewHeading} id="business-draft-heading" tabIndex={-1}>{t.draft}</h3>
            <button type="button" className={styles.textButton} onClick={editAnswers}>{t.edit}</button>
          </div>
          <textarea ref={message} rows={8} aria-labelledby="business-draft-heading" value={draft}
            onChange={event => { setDraft(event.target.value); setStatus(""); }} />
          <p>{email ? t.emailHelp.replace("{email}", email) : number ? t.directHelp : t.shareHelp}</p>
          {draft.trim() && (
            <div className={styles.actions}>
              {email &&
                <a className="btn" href={mailto} data-track="wholesale_contact_click" data-track-channel="email">{t.email}</a>}
              {(number || !email) &&
                <a className={email ? "btn btn--ghost" : "btn"} target="_blank" rel="noopener noreferrer"
                  data-track={number ? "wholesale_contact_click" : undefined} data-track-channel={number ? "whatsapp" : undefined}
                  href={number ? `https://wa.me/${number}?text=${encodeURIComponent(draft)}` : whatsappShareUrl(draft)}>
                  {number ? t.salesWhatsApp : t.whatsapp}
                </a>}
              <button type="button" className="btn btn--ghost" onClick={copyMessage}>{t.copy}</button>
            </div>
          )}
        </div>
      )}
      <p className={styles.status} role="status">{status}</p>
    </section>
  );
}
