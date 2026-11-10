// @vitest-environment jsdom
/**
 * The enquiry form as a customer uses it. Changing the language replaces the page with the other
 * locale's page, so the form is unmounted and mounted again: open() does the same.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { EmailInquiry } from "../src/components/EmailInquiry";
import type { Locale } from "../src/lib/commerce/types";

// React runs effects and state updates inside act() only when this is set.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

type Page = { locale: Locale; draftId: string; source?: "business" | "kitchen"; suggested?: string };

let host: HTMLDivElement;
let root: Root | null = null;

function close() {
  if (root) act(() => root!.unmount());
  root = null;
}

function open({ locale, draftId, source = "business", suggested }: Page): HTMLTextAreaElement {
  close();
  root = createRoot(host);
  act(() => root!.render(createElement(EmailInquiry, {
    locale, email: "ventas@example.test", ready: true, source, draftId, initialMessage: suggested,
  })));
  return host.querySelector("textarea")!;
}

function write(field: HTMLTextAreaElement, text: string) {
  // React hears the native input event and reads the value through the element's own setter.
  const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")!.set!;
  act(() => {
    setValue.call(field, text);
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

beforeEach(() => {
  window.sessionStorage.clear();
  window.localStorage.clear();
  host = document.createElement("div");
  document.body.append(host);
});

afterEach(() => {
  close();
  host.remove();
});

describe("enquiry form across a language change", () => {
  const draft = "Necesito 20 frascos para mi café.\nSegunda línea: ñ, á, &.";
  const kitchen = { draftId: "pack:portion", source: "kitchen" } as const;

  it("keeps what the customer wrote", () => {
    write(open({ locale: "es", draftId: "general" }), draft);

    const field = open({ locale: "en", draftId: "general" });

    expect(field.value).toBe(draft);
    expect(host.querySelector("label")!.textContent).toContain("Your message");
  });

  it("puts the kept text into the email draft", () => {
    write(open({ locale: "es", draftId: "general" }), draft);

    open({ locale: "en", draftId: "general" });

    const link = host.querySelector('a[href^="mailto:"]')!.getAttribute("href")!;
    expect(decodeURIComponent(link.split("&body=")[1] ?? "")).toBe(draft);
  });

  it("shows the suggested text in the new language while nothing was written", () => {
    open({ locale: "es", ...kitchen, suggested: "Quisiera probar este formato." });

    const field = open({ locale: "en", ...kitchen, suggested: "I would like to try this format." });

    expect(field.value).toBe("I would like to try this format.");
  });

  it("keeps a field the customer emptied empty", () => {
    write(open({ locale: "es", ...kitchen, suggested: "Quisiera probar este formato." }), "");

    const field = open({ locale: "en", ...kitchen, suggested: "I would like to try this format." });

    expect(field.value).toBe("");
  });

  it("keeps each product's enquiry apart", () => {
    write(open({ locale: "es", draftId: "hummus-de-zanahoria" }), draft);

    expect(open({ locale: "es", draftId: "hummus-de-remolacha" }).value).toBe("");
    expect(open({ locale: "en", draftId: "general" }).value).toBe("");
    expect(open({ locale: "en", draftId: "hummus-de-zanahoria" }).value).toBe(draft);
  });

  it("keeps the business form apart from the hotels and restaurants form", () => {
    write(open({ locale: "es", draftId: "general", source: "business" }), draft);

    expect(open({ locale: "es", draftId: "general", source: "kitchen" }).value).toBe("");
    expect(open({ locale: "en", draftId: "general", source: "business" }).value).toBe(draft);
  });

  it("keeps the text out of the address and out of storage that outlives the tab", () => {
    const before = window.location.href;

    write(open({ locale: "es", draftId: "general" }), draft);
    open({ locale: "en", draftId: "general" });

    expect(window.location.href).toBe(before);
    expect(window.localStorage.length).toBe(0);
  });
});
