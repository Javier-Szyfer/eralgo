"use client";

import { useState } from "react";
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

	return (
		<div className="h-screen flex flex-col items-center overflow-y-auto py-6 px-4">
			<AlbumToggle
				albums={albums}
				activeIndex={viewedAlbumIndex}
				onSelect={(i) => setViewedAlbumIndex(i as 0 | 1)}
			/>

			<div className="w-full max-w-lg border border-white/50 rounded-xl bg-white/10 backdrop-blur-2xl">
				<div className="flex flex-col items-center gap-4 p-5">
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
				</div>
			</div>

			<div className="w-full max-w-md mt-4 border border-white/50 rounded-xl bg-white/10 backdrop-blur-2xl">
				<div className="px-4 py-1.5 border-b border-white/30">
					<p className="text-left text-[10px] text-mac-text-muted tracking-wide truncate">
						{playingTrack?.title ?? ""}
					</p>
				</div>

				<div className="p-4">
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
