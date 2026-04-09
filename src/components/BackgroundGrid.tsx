"use client";

import { useRef, useEffect } from "react";

function noise(x: number, y: number, t: number): number {
	return (
		Math.sin(x * 0.002 + t * 0.35) * Math.cos(y * 0.0025 + t * 0.28) * 0.5 +
		Math.sin(x * 0.004 + y * 0.003 + t * 0.45) * 0.3 +
		Math.cos(x * 0.003 - y * 0.002 + t * 0.38) * 0.2
	);
}

const GRID_SPACING = 12;
const MAX_SIZE = 4;
const MIN_SIZE = 0.5;

export default function BackgroundGrid() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const rafRef = useRef<number>(0);
	const timeRef = useRef(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const draw = () => {
			const w = canvas.width;
			const h = canvas.height;

			timeRef.current += 0.008;
			const t = timeRef.current;

			ctx.clearRect(0, 0, w, h);

			const cols = Math.ceil(w / GRID_SPACING) + 1;
			const rows = Math.ceil(h / GRID_SPACING) + 1;

			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					const x = col * GRID_SPACING;
					const y = row * GRID_SPACING;

					const n1 = noise(x, y, t);
					const n2 = noise(x * 1.5, y * 1.5, t * 0.7) * 0.5;
					const n = (n1 + n2) * 0.67;

					const normalized = (n + 1) * 0.5;
					const size = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * normalized;

					const lightness = 82 - normalized * 20;
					ctx.fillStyle = `hsl(0, 0%, ${lightness}%)`;

					const half = size / 2;
					ctx.fillRect(x - half, y - half, size, size);
				}
			}

			rafRef.current = requestAnimationFrame(draw);
		};

		rafRef.current = requestAnimationFrame(draw);
		return () => cancelAnimationFrame(rafRef.current);
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const resize = () => {
			const dpr = window.devicePixelRatio || 1;
			canvas.width = window.innerWidth * dpr;
			canvas.height = window.innerHeight * dpr;
			canvas.style.width = `${window.innerWidth}px`;
			canvas.style.height = `${window.innerHeight}px`;
		};

		resize();
		window.addEventListener("resize", resize);
		return () => window.removeEventListener("resize", resize);
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 -z-10 pointer-events-none opacity-40"
		/>
	);
}
