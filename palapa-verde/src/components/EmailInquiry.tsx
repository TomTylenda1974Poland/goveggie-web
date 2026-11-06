"use client";

import { useId, useRef, useState } from "react";
import type { Locale } from "@/lib/commerce/types";
import { enquiryEmailHref } from "@/lib/enquiry-email";
import styles from "./EmailInquiry.module.css";

const copy = {
  es: {
    message: "Tu mensaje", optional: "(opcional)", example: "Por ejemplo: Me interesa el catálogo para mi restaurante.",
    open: "Abrir mi correo", help: "Puedes completar y enviar el mensaje en tu app de correo.",
    subject: "Consulta comercial · Palapa Verde", copy: "Copiar dirección", copied: "Dirección copiada.",
    manual: "Dirección seleccionada. Puedes copiarla.",
  },
  en: {
    message: "Your message", optional: "(optional)", example: "For example: I’d like a catalogue for my restaurant.",
    open: "Open my email app", help: "You can finish and send the message in your email app.",
    subject: "Business enquiry · Palapa Verde", copy: "Copy email address", copied: "Email address copied.",
    manual: "Email address selected. You can copy it.",
  },
} as const;

type Props = { locale: Locale; email: string; example?: string; subject?: string };

export function EmailInquiry({ locale, email, example, subject }: Props) {
  const t = copy[locale];
  const messageId = useId();
  const helpId = useId();
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const address = useRef<HTMLSpanElement>(null);
  const href = enquiryEmailHref(email, subject ?? t.subject, message);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(email);
      setFeedback(t.copied);
    } catch {
      const selection = window.getSelection();
      if (address.current && selection) {
        const range = document.createRange();
        range.selectNodeContents(address.current);
        selection.removeAllRanges();
        selection.addRange(range);
        setFeedback(t.manual);
      }
    }
  }

  return (
    <div className={styles.inquiry}>
      <label htmlFor={messageId}>{t.message} <span>{t.optional}</span></label>
      <textarea id={messageId} name="message" rows={2} placeholder={example ?? t.example}
        value={message} onChange={event => setMessage(event.target.value)} />
      <a className={`btn ${styles.open}`} href={href} aria-describedby={helpId}>{t.open} <span aria-hidden="true">↗</span></a>
      <small id={helpId} className={styles.help}>{t.help}</small>
      <div className={styles.address}>
        <span ref={address}>{email}</span>
        <button type="button" onClick={copyAddress}>{t.copy}</button>
      </div>
      <span role="status" className={styles.status}>{feedback}</span>
    </div>
  );
}
