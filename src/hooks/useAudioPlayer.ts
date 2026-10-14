"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Album } from "@/types";
import { HTML_IN_CANVAS_SUPPORTED } from "@/lib/htmlInCanvas";

/** Cache signed URLs in-memory so we don't re-fetch on seek/pause/resume */
const signedUrlCache = new Map<string, { url: string; expiresAt: number }>();
const CACHE_TTL_MS = 4 * 60 * 1000; // 4 min (URLs expire after 5 min)

async function getSignedUrl(trackId: string): Promise<string> {
	const cached = signedUrlCache.get(trackId);
	if (cached && Date.now() < cached.expiresAt) {
		return cached.url;
	}

	const res = await fetch(`/api/audio?trackId=${encodeURIComponent(trackId)}`);
	if (!res.ok) throw new Error("Failed to get audio URL");
	const { url } = await res.json();

	signedUrlCache.set(trackId, { url, expiresAt: Date.now() + CACHE_TTL_MS });
	return url;
}

export function useAudioPlayer(albums: [Album, Album]) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [hasPlayed, setHasPlayed] = useState(false);
	const [playingAlbumIndex, setPlayingAlbumIndex] = useState(0);
	const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [trackDurations, setTrackDurations] = useState<Record<string, number>>(
		{},
	);
	// Track which src is currently loaded to avoid redundant fetches
	const loadedTrackIdRef = useRef<string | null>(null);

	// Create audio element once
	if (!audioRef.current && typeof window !== "undefined") {
		audioRef.current = new Audio();
		if (HTML_IN_CANVAS_SUPPORTED) audioRef.current.crossOrigin = "anonymous";
		audioRef.current.volume = 0.8;
	}

	// Preload metadata for all tracks to get real durations
	useEffect(() => {
		let cancelled = false;
		const audioElements: HTMLAudioElement[] = [];

		async function preload() {
			const allTracks = [...albums[0].tracks, ...albums[1].tracks];
			for (const track of allTracks) {
				if (cancelled) return;
				try {
					const url = await getSignedUrl(track.id);
					if (cancelled) return;
					const audio = new Audio();
					if (HTML_IN_CANVAS_SUPPORTED) audio.crossOrigin = "anonymous";
					audio.preload = "metadata";
					audio.src = url;
					audio.addEventListener("loadedmetadata", () => {
						if (audio.duration && isFinite(audio.duration)) {
							setTrackDurations((prev) => ({
								...prev,
								[track.id]: audio.duration,
							}));
						}
					});
					audioElements.push(audio);
				} catch {
					// Silently skip — we'll fall back to durationSeconds
				}
			}
		}

		preload();

		return () => {
			cancelled = true;
			audioElements.forEach((a) => {
				a.src = "";
			});
		};
	}, [albums]);

	// Sync audio source when track or playing album changes
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const track = albums[playingAlbumIndex].tracks[currentTrackIndex];
		if (!track) return;

		// Skip if this track is already loaded
		if (loadedTrackIdRef.current === track.id) return;

		let cancelled = false;

		async function loadTrack() {
			try {
				const url = await getSignedUrl(track.id);
				if (cancelled) return;
				loadedTrackIdRef.current = track.id;
				audio!.src = url;
				audio!.load();
				if (isPlaying) {
					audio!.play().catch(() => {});
				}
			} catch {
				// Failed to get signed URL
			}
		}

		loadTrack();

		return () => {
			cancelled = true;
		};
	}, [currentTrackIndex, playingAlbumIndex, albums, isPlaying]);

	// Audio event listeners
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const playingTracks = albums[playingAlbumIndex].tracks;

		const onTimeUpdate = () => setCurrentTime(audio.currentTime);
		const onDurationChange = () => setDuration(audio.duration || 0);
		const onEnded = () => {
			if (currentTrackIndex < playingTracks.length - 1) {
				setCurrentTrackIndex((i) => i + 1);
			} else {
				setIsPlaying(false);
				setCurrentTime(0);
			}
		};
		const onPlay = () => {
			setIsPlaying(true);
			setHasPlayed(true);
		};
		const onPause = () => { if (!audio.ended) setIsPlaying(false); };

		audio.addEventListener("timeupdate", onTimeUpdate);
		audio.addEventListener("durationchange", onDurationChange);
		audio.addEventListener("ended", onEnded);
		audio.addEventListener("play", onPlay);
		audio.addEventListener("pause", onPause);

		return () => {
			audio.removeEventListener("timeupdate", onTimeUpdate);
			audio.removeEventListener("durationchange", onDurationChange);
			audio.removeEventListener("ended", onEnded);
			audio.removeEventListener("play", onPlay);
			audio.removeEventListener("pause", onPause);
		};
	}, [currentTrackIndex, playingAlbumIndex, albums]);

	const togglePlay = useCallback(() => {
		const audio = audioRef.current;
		if (!audio) return;
		if (audio.paused) {
			audio.play().catch(() => {});
		} else {
			audio.pause();
		}
	}, []);

	const nextTrack = useCallback(() => {
		const playingTracks = albums[playingAlbumIndex].tracks;
		setCurrentTrackIndex((i) =>
			i < playingTracks.length - 1 ? i + 1 : i,
		);
	}, [albums, playingAlbumIndex]);

	const prevTrack = useCallback(() => {
		const audio = audioRef.current;
		if (audio && audio.currentTime > 3) {
			audio.currentTime = 0;
		} else {
			setCurrentTrackIndex((i) => (i > 0 ? i - 1 : i));
		}
	}, []);

	const seekTo = useCallback((time: number) => {
		const audio = audioRef.current;
		if (audio) {
			audio.currentTime = time;
			setCurrentTime(time);
		}
	}, []);

	const selectTrack = useCallback(
		(albumIndex: number, trackIndex: number) => {
			const track = albums[albumIndex].tracks[trackIndex];
			if (!track) return;

			setPlayingAlbumIndex(albumIndex);
			setCurrentTrackIndex(trackIndex);
			setCurrentTime(0);

			const audio = audioRef.current;
			if (!audio) return;

			async function load() {
				try {
					const url = await getSignedUrl(track.id);
					loadedTrackIdRef.current = track.id;
					audio!.src = url;
					audio!.load();
					audio!.play().catch(() => {});
				} catch {
					// Failed to get signed URL
				}
			}

			load();
		},
		[albums],
	);

	/** Queue an album's first track without starting playback */
	const cueAlbum = useCallback((albumIndex: number) => {
		setPlayingAlbumIndex(albumIndex);
		setCurrentTrackIndex(0);
		setCurrentTime(0);
	}, []);

	return {
		isPlaying,
		hasPlayed,
		playingAlbumIndex,
		currentTrackIndex,
		currentTime,
		duration,
		trackDurations,
		togglePlay,
		nextTrack,
		prevTrack,
		seekTo,
		selectTrack,
		cueAlbum,
		audioRef,
	};
}
