"use client";

import { useRef, useState } from "react";
import type { Locale } from "@/lib/commerce/types";
import styles from "./business-inquiry.module.css";

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

export function BusinessInquiry({ locale, email }: { locale: Locale; email: string }) {
  const t = copy[locale];
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const address = useRef<HTMLSpanElement>(null);
  const href = `mailto:${email}?subject=${encodeURIComponent(t.subject)}` +
    (message.trim() ? `&body=${encodeURIComponent(message)}` : "");

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
      <label htmlFor="business-message">{t.message} <span>{t.optional}</span></label>
      <textarea id="business-message" name="message" rows={2} placeholder={t.example}
        value={message} onChange={event => setMessage(event.target.value)} />
      <a className={`btn ${styles.open}`} href={href} aria-describedby="business-mail-help">{t.open} <span aria-hidden="true">↗</span></a>
      <small id="business-mail-help" className={styles.help}>{t.help}</small>
      <div className={styles.address}>
        <span ref={address}>{email}</span>
        <button type="button" onClick={copyAddress}>{t.copy}</button>
      </div>
      <span role="status" className={styles.status}>{feedback}</span>
    </div>
  );
}
