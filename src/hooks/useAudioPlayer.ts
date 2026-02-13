"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Album } from "@/types";

export function useAudioPlayer(albums: [Album, Album]) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [playingAlbumIndex, setPlayingAlbumIndex] = useState(0);
	const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [trackDurations, setTrackDurations] = useState<Record<string, number>>(
		{},
	);

	// Create audio element once
	if (!audioRef.current && typeof window !== "undefined") {
		audioRef.current = new Audio();
		audioRef.current.volume = 0.8;
	}

	// Preload metadata for all tracks to get real durations
	useEffect(() => {
		const allTracks = [...albums[0].tracks, ...albums[1].tracks];
		const audioElements: HTMLAudioElement[] = [];

		for (const track of allTracks) {
			const audio = new Audio();
			audio.preload = "metadata";
			audio.src = track.audioUrl;
			audio.addEventListener("loadedmetadata", () => {
				if (audio.duration && isFinite(audio.duration)) {
					setTrackDurations((prev) => ({
						...prev,
						[track.id]: audio.duration,
					}));
				}
			});
			audioElements.push(audio);
		}

		return () => {
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

		if (audio.src !== track.audioUrl) {
			audio.src = track.audioUrl;
			audio.load();
			if (isPlaying) {
				audio.play().catch(() => {});
			}
		}
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
		const onPlay = () => setIsPlaying(true);
		const onPause = () => setIsPlaying(false);

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
			setPlayingAlbumIndex(albumIndex);
			setCurrentTrackIndex(trackIndex);
			setCurrentTime(0);
			const audio = audioRef.current;
			if (audio) {
				audio.src = albums[albumIndex].tracks[trackIndex].audioUrl;
				audio.load();
				audio.play().catch(() => {});
			}
		},
		[albums],
	);

	return {
		isPlaying,
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
	};
}
