/** Returns true if the browser supports the html-in-canvas API. */
export function supportsHtmlInCanvas(): boolean {
	if (typeof document === "undefined") return false;
	const c = document.createElement("canvas");
	if (!("layoutSubtree" in c)) return false;
	const ctx = c.getContext("2d");
	return ctx !== null && "drawElementImage" in ctx;
}

/** Cached result — safe to call at module level on the client. */
export const HTML_IN_CANVAS_SUPPORTED =
	typeof window !== "undefined" && supportsHtmlInCanvas();
