import { useCallback, useEffect, useRef } from "react";
import { HTML_IN_CANVAS_SUPPORTED } from "@/lib/htmlInCanvas";

const FFT_SIZE = 256;

export function useAudioAnalyser(audio: HTMLAudioElement | null) {
	const ctxRef = useRef<AudioContext | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

	useEffect(() => {
		// Only wire up Web Audio when html-in-canvas is supported.
		// createMediaElementSource reroutes all audio through the Web Audio
		// graph and requires CORS on the audio source — skip it entirely
		// on browsers that won't use the visual effects.
		if (!HTML_IN_CANVAS_SUPPORTED || !audio || ctxRef.current) return;

		const ctx = new AudioContext();
		const analyser = ctx.createAnalyser();
		analyser.fftSize = FFT_SIZE;
		analyser.smoothingTimeConstant = 0.8;

		ctx.createMediaElementSource(audio).connect(analyser);
		analyser.connect(ctx.destination);

		ctxRef.current = ctx;
		analyserRef.current = analyser;
		dataRef.current = new Uint8Array(analyser.frequencyBinCount);

		const resumeCtx = () => {
			if (ctx.state === "suspended") ctx.resume();
		};
		audio.addEventListener("play", resumeCtx);
		return () => audio.removeEventListener("play", resumeCtx);
	}, [audio]);

	/** Returns byte frequency data (0–255) for the current frame. */
	const getFrequencyData = useCallback((): Uint8Array<ArrayBuffer> | null => {
		const analyser = analyserRef.current;
		const data = dataRef.current;
		if (!analyser || !data) return null;

		if (ctxRef.current?.state === "suspended") {
			ctxRef.current.resume();
		}

		analyser.getByteFrequencyData(data);
		return data;
	}, []);

	return { getFrequencyData };
}
