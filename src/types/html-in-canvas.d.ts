// Experimental html-in-canvas API (https://github.com/WICG/html-in-canvas)

import "react";

declare global {
	interface HTMLCanvasElement {
		layoutSubtree?: boolean;
		onpaint?: ((this: HTMLCanvasElement, ev: Event) => void) | null;
		requestPaint?(): void;
	}

	interface CanvasRenderingContext2D {
		drawElementImage?(element: Element, x: number, y: number): DOMMatrix;
	}
}

declare module "react" {
	interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
		layoutsubtree?: "true";
	}
}
