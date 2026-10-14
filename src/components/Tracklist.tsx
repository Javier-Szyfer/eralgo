import type { Track } from "@/types";
import TrackItem from "./TrackItem";

interface TracklistProps {
	tracks: Track[];
	currentTrackIndex: number;
	isPlaying: boolean;
	onSelectTrack: (index: number) => void;
}

export default function Tracklist({
	tracks,
	currentTrackIndex,
	isPlaying,
	onSelectTrack,
}: TracklistProps) {
	return (
		<div className="w-full border border-white/80 rounded-lg bg-white/20 backdrop-blur-xl max-h-[140px] sm:max-h-[180px] overflow-y-auto tracklist-scroll">
			<div className="flex flex-col">
				{tracks.map((track, i) => (
					<TrackItem
						key={track.id}
						track={track}
						index={i}
						isActive={i === currentTrackIndex}
						isPlaying={isPlaying}
						onSelect={() => onSelectTrack(i)}
					/>
				))}
			</div>
		</div>
	);
}
