import PlayerControls from "./PlayerControls";
import ProgressBar from "./ProgressBar";

interface PlayerProps {
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	onTogglePlay: () => void;
	onPrev: () => void;
	onNext: () => void;
	onSeek: (time: number) => void;
}

export default function Player({
	isPlaying,
	currentTime,
	duration,
	onTogglePlay,
	onPrev,
	onNext,
	onSeek,
}: PlayerProps) {
	return (
		<div className="flex items-center gap-3">
			<PlayerControls
				isPlaying={isPlaying}
				onTogglePlay={onTogglePlay}
				onPrev={onPrev}
				onNext={onNext}
			/>
			<ProgressBar
				currentTime={currentTime}
				duration={duration}
				onSeek={onSeek}
			/>
		</div>
	);
}
