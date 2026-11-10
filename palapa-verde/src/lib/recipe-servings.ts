/** The number of servings a visitor chose for a recipe, kept for this browser tab only. */
const prefix = "pv:recipe-servings:v1:";

/** `null` when nothing usable was kept: nothing chosen yet, storage blocked, or a number the control does not offer. */
export function readServings(slug: string, min: number, max: number): number | null {
  if (typeof window === "undefined") return null;
  try {
    const kept = window.sessionStorage.getItem(prefix + slug);
    const count = kept === null ? NaN : Number(kept);
    return Number.isInteger(count) && count >= min && count <= max ? count : null;
  } catch {
    return null;
  }
}

export function writeServings(slug: string, count: number): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(prefix + slug, String(count));
  } catch {
    // Storage is blocked: the choice then lasts only until the page changes.
  }
}
