"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/lib/commerce/types";
import { enquiryEmailHref } from "@/lib/enquiry-email";
import { inquiryDraftKey, readInquiryDraft, writeInquiryDraft } from "@/lib/enquiry-draft";
import styles from "./EmailInquiry.module.css";

const copy = {
  es: {
    message: "Tu mensaje", optional: "(opcional)", example: "Por ejemplo: Me interesa el catálogo para mi restaurante.",
    open: "Abrir mi correo", help: "Puedes completar y enviar el mensaje en tu app de correo.",
    paused: "La recepción de correo está temporalmente interrumpida. Puedes guardar tu consulta y enviarla más adelante.",
    save: "Guardar consulta", draft: "Abrir borrador de correo", about: "Consulta sobre",
    subject: "Consulta comercial · Palapa Verde", copy: "Copiar dirección", copied: "Dirección copiada.",
    manual: "Dirección seleccionada. Puedes copiarla.",
  },
  en: {
    message: "Your message", optional: "(optional)", example: "For example: I’d like a catalogue for my restaurant.",
    open: "Open my email app", help: "You can finish and send the message in your email app.",
    paused: "Incoming email is temporarily unavailable. You can save your enquiry and send it later.",
    save: "Save enquiry", draft: "Open email draft", about: "Enquiry about",
    subject: "Business enquiry · Palapa Verde", copy: "Copy email address", copied: "Email address copied.",
    manual: "Email address selected. You can copy it.",
  },
} as const;

type Props = {
  locale: Locale;
  email: string;
  ready: boolean;
  source: "business" | "kitchen";
  /** Stable product/pack ID; never a translated title or the private message. */
  draftId: string;
  example?: string;
  subject?: string;
  context?: string;
  initialMessage?: string;
};

export function EmailInquiry({ locale, email, ready, source, draftId, example, subject, context, initialMessage = "" }: Props) {
  const t = copy[locale];
  const messageId = useId();
  const helpId = useId();
  const [editedMessage, setMessage] = useState<string | null>(null);
  const message = editedMessage ?? initialMessage;
  const [feedback, setFeedback] = useState<"copied" | "manual" | null>(null);
  const draftStorageKey = inquiryDraftKey(source, draftId);
  const address = useRef<HTMLSpanElement>(null);
  const emailSubject = [subject ?? t.subject, context].filter(Boolean).join(" · ");
  const href = enquiryEmailHref(email, emailSubject, message);
  const savedText = [email, emailSubject, "", message].join("\n");

  // Restore only in the browser, so personal text never enters server rendering.
  // Callers key this component by its stable draft ID when the scope changes.
  useEffect(() => {
    const saved = readInquiryDraft(draftStorageKey);
    if (saved !== null) setMessage(saved);
  }, [draftStorageKey]);

  function updateMessage(value: string) {
    setMessage(value);
    // Save synchronously before navigation; retain intentional empty drafts too.
    writeInquiryDraft(draftStorageKey, value);
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(email);
      setFeedback("copied");
    } catch {
      const selection = window.getSelection();
      if (address.current && selection) {
        const range = document.createRange();
        range.selectNodeContents(address.current);
        selection.removeAllRanges();
        selection.addRange(range);
        setFeedback("manual");
      }
    }
  }

  return (
    <div className={styles.inquiry}>
      {context && <p className={styles.context}><span>{t.about}</span> {context}</p>}
      <label htmlFor={messageId}>{t.message} <span>{t.optional}</span></label>
      <textarea id={messageId} name="message" rows={2} placeholder={example ?? t.example}
        value={message} onChange={event => updateMessage(event.target.value)} />
      {ready ? (
        <a className={`btn ${styles.open}`} href={href} aria-describedby={helpId}
          data-track="email_draft_open" data-track-from={source}>{t.open} <span aria-hidden="true">↗</span></a>
      ) : (
        <a className={`btn ${styles.open}`} href={`data:text/plain;charset=utf-8,${encodeURIComponent(savedText)}`}
          download="palapa-verde.txt" aria-describedby={helpId}>{t.save} <span aria-hidden="true">↓</span></a>
      )}
      <small id={helpId} className={styles.help}>{ready ? t.help : t.paused}</small>
      {!ready && <a className={styles.draftLink} href={href} data-track="email_draft_open" data-track-from={source}>{t.draft}</a>}
      <div className={styles.address}>
        <span ref={address}>{email}</span>
        <button type="button" onClick={copyAddress}>{t.copy}</button>
      </div>
      <span role="status" className={styles.status}>{feedback ? t[feedback] : ""}</span>
    </div>
  );
}
