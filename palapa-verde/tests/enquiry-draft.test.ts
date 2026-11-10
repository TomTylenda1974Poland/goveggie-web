import { afterEach, describe, expect, it, vi } from "vitest";
import { inquiryDraftKey, readInquiryDraft, writeInquiryDraft } from "../src/lib/enquiry-draft";

afterEach(() => vi.unstubAllGlobals());

function session() {
  const values = new Map<string, string>();
  vi.stubGlobal("window", { sessionStorage: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  } });
  return values;
}

describe("private enquiry drafts", () => {
  it("restores the exact message after remount, including accents and newlines", () => {
    session();
    const beforeSwitch = inquiryDraftKey("business", "hummus-de-zanahoria");
    const message = "Necesito información.\nMy restaurant: café & cocina.";
    writeInquiryDraft(beforeSwitch, message);
    expect(readInquiryDraft(inquiryDraftKey("business", "hummus-de-zanahoria"))).toBe(message);
  });

  it("keeps an intentionally cleared field blank instead of restoring template text", () => {
    session();
    const key = inquiryDraftKey("kitchen", "pack:portion");
    writeInquiryDraft(key, "");
    expect(readInquiryDraft(key)).toBe("");
    expect(readInquiryDraft(inquiryDraftKey("kitchen", "pack:bottle"))).toBeNull();
  });

  it("isolates business, kitchen, packs and product groups", () => {
    session();
    const keys = [
      inquiryDraftKey("business", "general"), inquiryDraftKey("kitchen", "general"),
      inquiryDraftKey("kitchen", "pack:kitchen"), inquiryDraftKey("kitchen", "product:hummus"),
    ];
    expect(new Set(keys).size).toBe(4);
    keys.forEach((key, index) => writeInquiryDraft(key, `message ${index}`));
    expect(keys.map(readInquiryDraft)).toEqual(["message 0", "message 1", "message 2", "message 3"]);
  });

  it("keeps the newest edit in memory when storage rejects writes", () => {
    const key = inquiryDraftKey("kitchen", "blocked-storage");
    vi.stubGlobal("window", { sessionStorage: {
      getItem: () => "old value", setItem: () => { throw new Error("blocked"); },
    } });
    expect(() => writeInquiryDraft(key, "latest edit")).not.toThrow();
    expect(readInquiryDraft(key)).toBe("latest edit");
    writeInquiryDraft(key, "");
    expect(readInquiryDraft(key)).toBe("");
  });

  it("does not read or retain private messages during server rendering", () => {
    vi.stubGlobal("window", undefined);
    const key = inquiryDraftKey("business", "server-only");
    writeInquiryDraft(key, "private text");
    expect(readInquiryDraft(key)).toBeNull();
    session();
    expect(readInquiryDraft(key)).toBeNull();
  });
});
