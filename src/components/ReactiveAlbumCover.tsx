import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { HTML_IN_CANVAS_SUPPORTED } from "@/lib/htmlInCanvas";

interface ReactiveAlbumCoverProps {
	src: string;
	alt: string;
	getFrequencyData: () => Uint8Array | null;
	isPlaying: boolean;
}

const subscribe = () => () => {};

/** Draws the cover element into the canvas and syncs its hit-testing transform. */
function drawCover(ctx: CanvasRenderingContext2D, cover: HTMLElement) {
	const transform = ctx.drawElementImage?.(cover, 0, 0);
	if (transform) cover.style.transform = transform.toString();
}

function drawStatic(canvas: HTMLCanvasElement, cover: HTMLElement) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawCover(ctx, cover);
}

export default function ReactiveAlbumCover({
	src,
	alt,
	getFrequencyData,
	isPlaying,
}: ReactiveAlbumCoverProps) {
	const supported = useSyncExternalStore(
		subscribe,
		() => HTML_IN_CANVAS_SUPPORTED,
		() => false,
	);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const coverRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef(0);
	const paintReadyRef = useRef(false);
	const isPlayingRef = useRef(isPlaying);
	// Previous frames, composited back in for the echo effect
	const trailCanvasRef = useRef<HTMLCanvasElement | null>(null);

	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		const cover = coverRef.current;
		if (!canvas || !cover || !paintReadyRef.current) {
			rafRef.current = requestAnimationFrame(draw);
			return;
		}

		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;

		const w = canvas.width;
		const h = canvas.height;

		let bass = 0;
		let mid = 0;
		let high = 0;
		const freq = getFrequencyData();
		if (freq) {
			const len = freq.length;
			const bassEnd = Math.floor(len * 0.15);
			const midEnd = Math.floor(len * 0.5);
			for (let i = 0; i < bassEnd; i++) bass += freq[i];
			for (let i = bassEnd; i < midEnd; i++) mid += freq[i];
			for (let i = midEnd; i < len; i++) high += freq[i];
			bass /= bassEnd * 255;
			mid /= (midEnd - bassEnd) * 255;
			high /= (len - midEnd) * 255;
		}

		const energy = bass * 0.6 + mid * 0.3 + high * 0.1;

		trailCanvasRef.current ??= document.createElement("canvas");
		const trail = trailCanvasRef.current;
		if (trail.width !== w || trail.height !== h) {
			trail.width = w;
			trail.height = h;
		}

		// 1. Base cover with a bass-driven scale pulse and subtle filter
		ctx.save();
		ctx.clearRect(0, 0, w, h);
		const scale = 1 + bass * 0.05;
		ctx.translate((w * (1 - scale)) / 2, (h * (1 - scale)) / 2);
		ctx.scale(scale, scale);
		ctx.filter = `brightness(${1 + bass * 0.08}) saturate(${1 + mid * 0.25})`;
		drawCover(ctx, cover);
		ctx.restore();

		// 2. RGB channel split (chromatic aberration)
		const rgbIntensity = mid * 0.08 + high * 0.05;
		if (rgbIntensity > 0.02 && w > 0 && h > 0) {
			const shift = Math.max(1, Math.round(rgbIntensity * 8));
			const pixels = ctx.getImageData(0, 0, w, h);
			const data = pixels.data;
			const copy = new Uint8ClampedArray(data);

			for (let y = 0; y < h; y++) {
				for (let x = 0; x < w; x++) {
					const idx = (y * w + x) * 4;
					// Red shifts left, blue shifts right
					data[idx] = copy[(y * w + Math.min(x + shift, w - 1)) * 4];
					data[idx + 2] = copy[(y * w + Math.max(x - shift, 0)) * 4 + 2];
				}
			}
			ctx.putImageData(pixels, 0, 0);
		}

		// 3. Echo / ghost trails
		const trailCtx = trail.getContext("2d");
		if (trailCtx) {
			// Fade the previous trail, then stamp the current frame with a slight offset
			trailCtx.globalAlpha = 0.82 + (1 - energy) * 0.12;
			trailCtx.drawImage(trail, 0, 0);
			const trailOffset = energy * 4;
			trailCtx.globalAlpha = 0.3 + energy * 0.2;
			trailCtx.drawImage(canvas, trailOffset, trailOffset);
			trailCtx.globalAlpha = 1;

			ctx.save();
			ctx.globalAlpha = 0.25 + energy * 0.2;
			ctx.globalCompositeOperation = "screen";
			ctx.drawImage(trail, -2, -2);
			ctx.restore();
		}

		rafRef.current = requestAnimationFrame(draw);
	}, [getFrequencyData]);

	// Draw the static cover on first paint and whenever the subtree repaints while paused
	useEffect(() => {
		const canvas = canvasRef.current;
		const cover = coverRef.current;
		if (!canvas || !cover || !supported) return;

		canvas.onpaint = () => {
			paintReadyRef.current = true;
			if (!isPlayingRef.current) drawStatic(canvas, cover);
		};
		canvas.requestPaint?.();

		return () => {
			canvas.onpaint = null;
		};
	}, [supported]);

	// Animation loop while playing; static cover while paused
	useEffect(() => {
		isPlayingRef.current = isPlaying;
		if (!supported) return;

		if (isPlaying) {
			rafRef.current = requestAnimationFrame(draw);
			return () => cancelAnimationFrame(rafRef.current);
		}

		const canvas = canvasRef.current;
		const cover = coverRef.current;
		if (canvas && cover && paintReadyRef.current) drawStatic(canvas, cover);
	}, [supported, isPlaying, draw]);

	// Match the canvas backing store to device pixels
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !supported) return;

		const observer = new ResizeObserver(([entry]) => {
			const box = entry.devicePixelContentBoxSize?.[0];
			if (box) {
				canvas.width = box.inlineSize;
				canvas.height = box.blockSize;
			} else {
				const ratio = window.devicePixelRatio || 1;
				canvas.width = entry.contentRect.width * ratio;
				canvas.height = entry.contentRect.height * ratio;
			}
			canvas.requestPaint?.();
		});
		observer.observe(canvas, { box: "device-pixel-content-box" });
		return () => observer.disconnect();
	}, [supported]);

	const image = (
		// biome-ignore lint/performance/noImgElement: drawn into a canvas, needs a plain <img>
		<img
			src={src}
			alt={alt}
			crossOrigin="anonymous"
			className="h-full w-full rounded-lg border border-white/50 object-cover"
		/>
	);

	if (!supported) {
		return (
			<div className="aspect-square w-2/5 shrink-0 sm:w-full">{image}</div>
		);
	}

	return (
		<canvas
			ref={canvasRef}
			layoutsubtree="true"
			className="aspect-square w-2/5 shrink-0 rounded-lg sm:w-full"
		>
			<div ref={coverRef}>{image}</div>
		</canvas>
	);
}
