/** Private enquiry text stays in this tab's session, not a URL or analytics. */
const prefix = "pv:enquiry-draft:v1:";
const unavailableStorageDrafts = new Map<string, string>();

export function inquiryDraftKey(source: "business" | "kitchen", draftId: string): string {
  return `${prefix}${source}:${draftId}`;
}

export function readInquiryDraft(key: string): string | null {
  if (typeof window === "undefined") return null;
  // A failed write is newer than any stale value still in sessionStorage.
  const fallback = unavailableStorageDrafts.get(key);
  if (fallback !== undefined) return fallback;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeInquiryDraft(key: string, message: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, message);
    unavailableStorageDrafts.delete(key);
  } catch {
    // Keep SPA language switches working even when browser storage is blocked.
    unavailableStorageDrafts.set(key, message);
  }
}
