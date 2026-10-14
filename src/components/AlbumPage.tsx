"use client";

import { useState } from "react";
import { useAudioAnalyser } from "@/hooks/useAudioAnalyser";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { formatTime } from "@/lib/formatTime";
import type { Album } from "@/types";
import About from "./About";
import AlbumToggle from "./AlbumToggle";
import Player from "./Player";
import ReactiveAlbumCover from "./ReactiveAlbumCover";
import Tracklist from "./Tracklist";

interface AlbumPageProps {
	albums: Album[];
}

export default function AlbumPage({ albums }: AlbumPageProps) {
	const [viewedAlbumIndex, setViewedAlbumIndex] = useState(0);
	const viewedAlbum = albums[viewedAlbumIndex];

	const player = useAudioPlayer(albums);
	const { getFrequencyData } = useAudioAnalyser(player.audio);
	const playingTrack =
		albums[player.playingAlbumIndex].tracks[player.currentTrackIndex];
	const isViewingPlayingAlbum = viewedAlbumIndex === player.playingAlbumIndex;

	const totalDuration = viewedAlbum.tracks.reduce(
		(sum, t) => sum + t.durationSeconds,
		0,
	);

	const selectAlbum = (i: number) => {
		setViewedAlbumIndex(i);
		if (!player.hasPlayed) player.cueAlbum(i);
	};

	return (
		<div className="pb-safe flex h-dvh flex-col items-center overflow-y-auto px-4 py-4 sm:h-auto sm:min-h-screen sm:justify-center sm:py-6">
			{/* Desktop: fixed nav on the left edge */}
			<div className="fixed top-6 left-0 z-10 hidden pl-6 text-left sm:block">
				<div className="mb-3">
					<About hover />
				</div>
				<AlbumToggle
					albums={albums}
					activeIndex={viewedAlbumIndex}
					onSelect={selectAlbum}
				/>
			</div>

			{/* Mobile: toggle above */}
			<div className="mb-4 w-full max-w-lg sm:hidden">
				<div className="mb-2">
					<About />
				</div>
				<AlbumToggle
					albums={albums}
					activeIndex={viewedAlbumIndex}
					onSelect={selectAlbum}
				/>
			</div>

			<div
				key={viewedAlbum.id}
				className="w-full animate-fade-in opacity-0 sm:max-w-md"
			>
				<div className="w-full sm:rounded-xl sm:border sm:border-white/50 sm:bg-white/10 sm:backdrop-blur-2xl">
					<div className="flex flex-col items-start gap-3 sm:items-center sm:gap-4 sm:p-5">
						<ReactiveAlbumCover
							src={viewedAlbum.coverUrl}
							alt={`${viewedAlbum.title} by ${viewedAlbum.artist}`}
							getFrequencyData={getFrequencyData}
							isPlaying={player.isPlaying && isViewingPlayingAlbum}
						/>

						<Tracklist
							tracks={viewedAlbum.tracks}
							currentTrackIndex={
								isViewingPlayingAlbum ? player.currentTrackIndex : -1
							}
							isPlaying={player.isPlaying}
							onSelectTrack={(i) => player.selectTrack(viewedAlbumIndex, i)}
						/>

						<div className="w-full space-y-0.5 text-left text-[9px] text-mac-text-muted tracking-wide">
							<p>Release: {viewedAlbum.releaseDate}</p>
							<p>Duration: {formatTime(totalDuration)}</p>
						</div>
					</div>
				</div>
			</div>

			<div
				key={`player-${viewedAlbum.id}`}
				className="mt-auto mb-4 w-full max-w-lg shrink-0 animate-fade-in rounded-2xl border border-white/50 bg-white/10 px-3 pt-2 pb-1.5 opacity-0 backdrop-blur-2xl [animation-delay:200ms] sm:mt-4 sm:mb-0 sm:max-w-xs"
			>
				<p className="mb-2.5 truncate text-[9px] text-mac-text-muted tracking-wide">
					{playingTrack?.title}
				</p>
				<Player
					isPlaying={player.isPlaying}
					currentTime={player.currentTime}
					duration={player.duration}
					onTogglePlay={player.togglePlay}
					onPrev={player.prevTrack}
					onNext={player.nextTrack}
					onSeek={player.seekTo}
				/>
			</div>
		</div>
	);
}
