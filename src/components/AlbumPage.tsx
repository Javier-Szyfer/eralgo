"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { Album } from "@/types";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import AlbumToggle from "./AlbumToggle";
import AlbumCover from "./AlbumCover";
import Tracklist from "./Tracklist";
import Player from "./Player";

interface AlbumPageProps {
	albums: [Album, Album];
}

export default function AlbumPage({ albums }: AlbumPageProps) {
	const [viewedAlbumIndex, setViewedAlbumIndex] = useState<0 | 1>(0);
	const [showInfo, setShowInfo] = useState(false);
	const infoRef = useRef<HTMLDivElement>(null);
	const viewedAlbum = albums[viewedAlbumIndex];

	useEffect(() => {
		if (!showInfo) return;
		const handleClick = (e: MouseEvent | TouchEvent) => {
			if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
				setShowInfo(false);
			}
		};
		document.addEventListener("mousedown", handleClick);
		document.addEventListener("touchstart", handleClick);
		return () => {
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("touchstart", handleClick);
		};
	}, [showInfo]);

	const player = useAudioPlayer(albums);
	const playingAlbum = albums[player.playingAlbumIndex];
	const playingTrack = playingAlbum.tracks[player.currentTrackIndex];

	const isViewingPlayingAlbum = viewedAlbumIndex === player.playingAlbumIndex;

	const totalDuration = useMemo(() => {
		const seconds = viewedAlbum.tracks.reduce(
			(sum, t) => sum + (player.trackDurations[t.id] ?? t.durationSeconds),
			0,
		);
		const m = Math.floor(seconds / 60);
		const s = Math.floor(seconds % 60);
		return `${m}:${s.toString().padStart(2, "0")}`;
	}, [viewedAlbum.tracks, player.trackDurations]);

	return (
		<div className="h-dvh flex flex-col items-center px-4 py-4 overflow-y-auto sm:h-auto sm:min-h-screen sm:justify-center sm:py-6 pb-safe">
			{/* Desktop: fixed nav on the left edge */}
			<div className="hidden sm:block fixed left-0 top-6 pl-6 text-left z-10">
				<div ref={infoRef} className="flex items-center gap-2 mb-3 relative"
					onMouseEnter={() => setShowInfo(true)}
					onMouseLeave={() => setShowInfo(false)}
				>
					<p className="text-xs text-mac-text-muted">eralgo</p>
					<button
						onClick={() => setShowInfo(!showInfo)}
						className="w-4 h-4 rounded-full border border-white/50 bg-white/10 backdrop-blur-2xl text-[8px] text-mac-text-muted flex items-center justify-center hover:bg-white/20 transition-colors"
					>
						?
					</button>
					{showInfo && (
						<div className="absolute left-full top-0 ml-2 z-20 border border-white/50 rounded-xl bg-white/10 backdrop-blur-2xl p-3 w-[200px] opacity-0 animate-fade-in-fast">
							<p className="text-[10px] text-mac-text-muted leading-relaxed">
								eralgo is an independent electronic producer based in Buenos Aires, Argentina
							</p>
						</div>
					)}
				</div>
				<AlbumToggle
					albums={albums}
					activeIndex={viewedAlbumIndex}
					onSelect={(i) => setViewedAlbumIndex(i as 0 | 1)}
				/>
			</div>

			{/* Mobile: toggle above */}
			<div className="sm:hidden w-full max-w-lg mb-4">
				<div ref={infoRef} className="flex items-center gap-2 mb-2 relative">
					<p className="text-xs text-mac-text-muted">eralgo</p>
					<button
						onClick={() => setShowInfo(!showInfo)}
						className="w-4 h-4 rounded-full border border-white/50 bg-white/10 backdrop-blur-2xl text-[8px] text-mac-text-muted flex items-center justify-center"
					>
						?
					</button>
					{showInfo && (
						<div className="absolute top-full left-0 mt-2 z-20 border border-white/50 rounded-xl bg-white/10 backdrop-blur-2xl p-3 max-w-[250px] opacity-0 animate-fade-in-fast">
							<p className="text-[10px] text-mac-text-muted leading-relaxed">
								eralgo is an independent electronic producer based in Buenos Aires, Argentina
							</p>
						</div>
					)}
				</div>
				<AlbumToggle
					albums={albums}
					activeIndex={viewedAlbumIndex}
					onSelect={(i) => setViewedAlbumIndex(i as 0 | 1)}
				/>
			</div>

			<div key={viewedAlbum.id} className="w-full sm:max-w-md opacity-0 animate-fade-in">
				<div className="w-full sm:border sm:border-white/50 sm:rounded-xl sm:bg-white/10 sm:backdrop-blur-2xl">
					<div className="flex flex-col items-start gap-3 sm:items-center sm:gap-4 sm:p-5">
						<AlbumCover
							src={viewedAlbum.coverUrl}
							alt={`${viewedAlbum.title} by ${viewedAlbum.artist}`}
						/>

						<Tracklist
							tracks={viewedAlbum.tracks}
							currentTrackIndex={isViewingPlayingAlbum ? player.currentTrackIndex : -1}
							isPlaying={player.isPlaying}
							onSelectTrack={(i) => player.selectTrack(viewedAlbumIndex, i)}
							trackDurations={player.trackDurations}
						/>

						<div className="w-full text-left text-[9px] text-mac-text-muted tracking-wide space-y-0.5">
							<p>Release: {viewedAlbum.releaseDate}</p>
							<p>Duration: {totalDuration}</p>
						</div>
					</div>
				</div>
			</div>

			<div key={`player-${viewedAlbum.id}`} className="w-full max-w-lg mt-auto mb-4 sm:mb-0 border border-white/50 rounded-2xl bg-white/10 backdrop-blur-2xl px-3 pb-1.5 pt-2 flex-shrink-0 sm:max-w-xs sm:mt-4 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
				<p className="text-[9px] text-mac-text-muted tracking-wide truncate mb-2.5">
					{playingTrack?.title ?? ""}
				</p>
				<div>
					<Player
						isPlaying={player.isPlaying}
						currentTime={player.currentTime}
						duration={player.duration}
						trackTitle={playingTrack?.title ?? ""}
						onTogglePlay={player.togglePlay}
						onPrev={player.prevTrack}
						onNext={player.nextTrack}
						onSeek={player.seekTo}
					/>
				</div>
			</div>
		</div>
	);
}
