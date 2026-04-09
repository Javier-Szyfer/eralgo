"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { supportsHtmlInCanvas } from "@/lib/htmlInCanvas";

interface Props {
	src: string;
	alt: string;
	getFrequencyData: () => Uint8Array | null;
	isPlaying: boolean;
}

export default function ReactiveAlbumCover({
	src,
	alt,
	getFrequencyData,
	isPlaying,
}: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const coverRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef<number>(0);
	const paintReadyRef = useRef(false);
	const [supported, setSupported] = useState(false);

	// Ghost trail buffer — stores previous frames for the echo effect
	const trailCanvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		setSupported(supportsHtmlInCanvas());
	}, []);

	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		const cover = coverRef.current;
		if (!canvas || !cover || !paintReadyRef.current) {
			rafRef.current = requestAnimationFrame(draw);
			return;
		}

		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx || !("drawElementImage" in ctx)) return;

		const w = canvas.width;
		const h = canvas.height;

		const freq = getFrequencyData();

		let bass = 0;
		let mid = 0;
		let high = 0;
		if (freq) {
			const len = freq.length;
			const bassEnd = Math.floor(len * 0.15);
			const midEnd = Math.floor(len * 0.5);
			for (let i = 0; i < bassEnd; i++) bass += freq[i];
			for (let i = bassEnd; i < midEnd; i++) mid += freq[i];
			for (let i = midEnd; i < len; i++) high += freq[i];
			bass = bass / (bassEnd * 255);
			mid = mid / ((midEnd - bassEnd) * 255);
			high = high / ((len - midEnd) * 255);
		}

		const energy = bass * 0.6 + mid * 0.3 + high * 0.1;

		// --- Lazy-init trail offscreen canvas ---
		if (!trailCanvasRef.current) {
			trailCanvasRef.current = document.createElement("canvas");
		}
		const trail = trailCanvasRef.current;
		if (trail.width !== w || trail.height !== h) {
			trail.width = w;
			trail.height = h;
		}

		// --- 1. Draw the base cover into a temp snapshot ---
		// We draw the element first, then layer effects on top
		ctx.save();
		ctx.clearRect(0, 0, w, h);

		// Scale pulse
		const scale = 1 + bass * 0.05;
		const ox = (w * (1 - scale)) / 2;
		const oy = (h * (1 - scale)) / 2;
		ctx.translate(ox, oy);
		ctx.scale(scale, scale);

		// Subtle filter
		const brightness = 1 + bass * 0.08;
		const saturate = 1 + mid * 0.25;
		ctx.filter = `brightness(${brightness}) saturate(${saturate})`;

		const drawFn = (ctx as any).drawElementImage.bind(ctx);
		const transform = drawFn(cover, 0, 0);
		cover.style.transform = transform.toString();
		ctx.restore();

		// --- 2. RGB channel split (chromatic aberration via pixel manipulation) ---
		const rgbIntensity = mid * 0.08 + high * 0.05;
		if (rgbIntensity > 0.02 && w > 0 && h > 0) {
			const shift = Math.max(1, Math.round(rgbIntensity * 8));
			const pixels = ctx.getImageData(0, 0, w, h);
			const data = pixels.data;
			const copy = new Uint8ClampedArray(data);

			for (let y = 0; y < h; y++) {
				for (let x = 0; x < w; x++) {
					const idx = (y * w + x) * 4;
					// Shift red channel left
					const rSrc = (y * w + Math.min(x + shift, w - 1)) * 4;
					data[idx] = copy[rSrc]; // R
					// Shift blue channel right
					const bSrc = (y * w + Math.max(x - shift, 0)) * 4;
					data[idx + 2] = copy[bSrc + 2]; // B
				}
			}
			ctx.putImageData(pixels, 0, 0);
		}

		// --- 3. Echo / ghost trails ---
		const trailCtx = trail.getContext("2d");
		if (trailCtx) {
			// Fade the trail canvas (persistence)
			const fadeAmount = 0.82 + (1 - energy) * 0.12;
			trailCtx.globalAlpha = fadeAmount;
			trailCtx.globalCompositeOperation = "source-over";
			trailCtx.drawImage(trail, 0, 0);

			// Stamp current frame onto trail with slight offset
			const trailOffset = energy * 4;
			trailCtx.globalAlpha = 0.3 + energy * 0.2;
			trailCtx.drawImage(canvas, trailOffset, trailOffset);
			trailCtx.globalAlpha = 1;

			// Composite trail behind the main image
			ctx.save();
			ctx.globalAlpha = 0.25 + energy * 0.2;
			ctx.globalCompositeOperation = "screen";
			ctx.drawImage(trail, -2, -2);
			ctx.restore();
		}

		rafRef.current = requestAnimationFrame(draw);
	}, [getFrequencyData]);

	// Set up the paint event — draws the cover immediately on first paint,
	// then keeps it updated via onpaint whenever children change.
	useEffect(() => {
		const canvas = canvasRef.current;
		const cover = coverRef.current;
		if (!canvas || !cover || !supported) return;

		const drawStatic = () => {
			const ctx = canvas.getContext("2d");
			if (!ctx || !("drawElementImage" in ctx)) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const drawFn = (ctx as any).drawElementImage.bind(ctx);
			const transform = drawFn(cover, 0, 0);
			cover.style.transform = transform.toString();
		};

		(canvas as any).onpaint = () => {
			paintReadyRef.current = true;
			// If not playing, redraw the static cover on any paint change
			if (!isPlayingRef.current) {
				drawStatic();
			}
		};
		(canvas as any).requestPaint?.();

		return () => {
			(canvas as any).onpaint = null;
		};
	}, [supported]);

	// Animation loop — only runs when playing
	const isPlayingRef = useRef(isPlaying);
	isPlayingRef.current = isPlaying;

	useEffect(() => {
		if (!supported) return;

		if (!isPlaying) {
			cancelAnimationFrame(rafRef.current);
			// Redraw static cover when pausing
			const canvas = canvasRef.current;
			const cover = coverRef.current;
			if (canvas && cover && paintReadyRef.current) {
				const ctx = canvas.getContext("2d");
				if (ctx && "drawElementImage" in ctx) {
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					const drawFn = (ctx as any).drawElementImage.bind(ctx);
					const transform = drawFn(cover, 0, 0);
					cover.style.transform = transform.toString();
				}
			}
			return;
		}

		rafRef.current = requestAnimationFrame(draw);
		return () => cancelAnimationFrame(rafRef.current);
	}, [supported, isPlaying, draw]);

	// Resize canvas to match device pixels
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !supported) return;

		const observer = new ResizeObserver(([entry]) => {
			const dpr = entry.devicePixelContentBoxSize;
			if (dpr) {
				canvas.width = dpr[0].inlineSize;
				canvas.height = dpr[0].blockSize;
			} else {
				const rect = entry.contentRect;
				const ratio = window.devicePixelRatio || 1;
				canvas.width = rect.width * ratio;
				canvas.height = rect.height * ratio;
			}
			(canvas as any).requestPaint?.();
		});
		observer.observe(canvas, { box: "device-pixel-content-box" });
		return () => observer.disconnect();
	}, [supported]);

	if (!supported) {
		return (
			<div className="w-2/5 sm:w-full aspect-square flex-shrink-0">
				<img
					src={src}
					alt={alt}
					crossOrigin="anonymous"
					className="w-full h-full object-cover rounded-lg border border-white/50"
				/>
			</div>
		);
	}

	return (
		<canvas
			ref={canvasRef}
			className="w-2/5 sm:w-full aspect-square flex-shrink-0 rounded-lg"
			{...({ layoutsubtree: "true" } as any)}
		>
			<div ref={coverRef}>
				<img
					src={src}
					alt={alt}
					crossOrigin="anonymous"
					className="w-full h-full object-cover rounded-lg border border-white/50"
				/>
			</div>
		</canvas>
	);
}
