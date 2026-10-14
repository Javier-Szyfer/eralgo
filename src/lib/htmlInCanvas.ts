function supportsHtmlInCanvas(): boolean {
	const canvas = document.createElement("canvas");
	if (!("layoutSubtree" in canvas)) return false;
	const ctx = canvas.getContext("2d");
	return ctx !== null && "drawElementImage" in ctx;
}

/** Whether the browser supports the html-in-canvas API. Always false on the server. */
export const HTML_IN_CANVAS_SUPPORTED =
	typeof window !== "undefined" && supportsHtmlInCanvas();
