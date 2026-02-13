"use client";

import { useState, useMemo } from "react";
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
	const viewedAlbum = albums[viewedAlbumIndex];

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
				<p className="text-xs text-mac-text-muted mb-3">eralgo</p>
				<AlbumToggle
					albums={albums}
					activeIndex={viewedAlbumIndex}
					onSelect={(i) => setViewedAlbumIndex(i as 0 | 1)}
				/>
			</div>

			{/* Mobile: toggle above */}
			<div className="sm:hidden w-full max-w-lg mb-4">
				<p className="text-xs text-mac-text-muted mb-2">eralgo</p>
				<AlbumToggle
					albums={albums}
					activeIndex={viewedAlbumIndex}
					onSelect={(i) => setViewedAlbumIndex(i as 0 | 1)}
				/>
			</div>

			<div className="w-full sm:max-w-md">
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

			<div className="w-full max-w-lg mt-auto border border-white/50 rounded-2xl bg-white/10 backdrop-blur-2xl px-3 pb-1.5 pt-2 flex-shrink-0 sm:max-w-xs sm:mt-4">
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
