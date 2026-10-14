import { useCallback, useEffect, useRef, useState } from "react";
import { HTML_IN_CANVAS_SUPPORTED } from "@/lib/htmlInCanvas";
import type { Album } from "@/types";

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

function createAudio(): HTMLAudioElement {
	const audio = new Audio();
	// The Web Audio analyser needs CORS-enabled audio
	if (HTML_IN_CANVAS_SUPPORTED) audio.crossOrigin = "anonymous";
	return audio;
}

export function useAudioPlayer(albums: Album[]) {
	const [audio] = useState(() => {
		if (typeof window === "undefined") return null;
		const audio = createAudio();
		audio.volume = 0.8;
		return audio;
	});
	const [isPlaying, setIsPlaying] = useState(false);
	const [hasPlayed, setHasPlayed] = useState(false);
	const [playingAlbumIndex, setPlayingAlbumIndex] = useState(0);
	const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	// Track which src is currently loaded to avoid redundant fetches
	const loadedTrackIdRef = useRef<string | null>(null);
	// Set when the user picks a track, so it starts playing once loaded
	const autoplayRef = useRef(false);

	// Load the current track whenever it changes
	useEffect(() => {
		if (!audio) return;

		const track = albums[playingAlbumIndex].tracks[currentTrackIndex];
		if (!track || loadedTrackIdRef.current === track.id) return;

		let cancelled = false;

		const loadTrack = async () => {
			try {
				const url = await getSignedUrl(track.id);
				if (cancelled) return;
				loadedTrackIdRef.current = track.id;
				audio.src = url;
				audio.load();
				if (isPlaying || autoplayRef.current) {
					audio.play().catch(() => {});
				}
				autoplayRef.current = false;
			} catch {
				// Failed to get signed URL
			}
		};

		loadTrack();

		return () => {
			cancelled = true;
		};
	}, [audio, albums, playingAlbumIndex, currentTrackIndex, isPlaying]);

	// Audio event listeners
	useEffect(() => {
		if (!audio) return;

		const trackCount = albums[playingAlbumIndex].tracks.length;

		const onTimeUpdate = () => setCurrentTime(audio.currentTime);
		const onDurationChange = () => setDuration(audio.duration || 0);
		const onEnded = () => {
			if (currentTrackIndex < trackCount - 1) {
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
		const onPause = () => {
			if (!audio.ended) setIsPlaying(false);
		};

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
	}, [audio, albums, playingAlbumIndex, currentTrackIndex]);

	const togglePlay = useCallback(() => {
		if (!audio) return;
		if (audio.paused) {
			audio.play().catch(() => {});
		} else {
			audio.pause();
		}
	}, [audio]);

	const nextTrack = useCallback(() => {
		const trackCount = albums[playingAlbumIndex].tracks.length;
		setCurrentTrackIndex((i) => (i < trackCount - 1 ? i + 1 : i));
	}, [albums, playingAlbumIndex]);

	const prevTrack = useCallback(() => {
		if (audio && audio.currentTime > 3) {
			audio.currentTime = 0;
		} else {
			setCurrentTrackIndex((i) => (i > 0 ? i - 1 : i));
		}
	}, [audio]);

	const seekTo = useCallback(
		(time: number) => {
			if (!audio) return;
			audio.currentTime = time;
			setCurrentTime(time);
		},
		[audio],
	);

	const selectTrack = useCallback(
		(albumIndex: number, trackIndex: number) => {
			const track = albums[albumIndex].tracks[trackIndex];
			if (!track) return;

			setPlayingAlbumIndex(albumIndex);
			setCurrentTrackIndex(trackIndex);
			setCurrentTime(0);

			if (loadedTrackIdRef.current === track.id) {
				// Re-selecting the loaded track restarts it
				if (audio) {
					audio.currentTime = 0;
					audio.play().catch(() => {});
				}
			} else {
				autoplayRef.current = true;
			}
		},
		[albums, audio],
	);

	/** Queue an album's first track without starting playback */
	const cueAlbum = useCallback((albumIndex: number) => {
		setPlayingAlbumIndex(albumIndex);
		setCurrentTrackIndex(0);
		setCurrentTime(0);
	}, []);

	return {
		audio,
		isPlaying,
		hasPlayed,
		playingAlbumIndex,
		currentTrackIndex,
		currentTime,
		duration,
		togglePlay,
		nextTrack,
		prevTrack,
		seekTo,
		selectTrack,
		cueAlbum,
	};
}
