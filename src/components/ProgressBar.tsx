interface ProgressBarProps {
	currentTime: number;
	duration: number;
	onSeek: (time: number) => void;
}

export function formatTime(seconds: number): string {
	if (!seconds || !isFinite(seconds)) return "0:00";
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ProgressBar({
	currentTime,
	duration,
	onSeek,
}: ProgressBarProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onSeek(Number(e.target.value));
	};

	return (
		<div className="flex items-center gap-2 flex-1">
			<span className="text-[10px] tabular-nums text-mac-text-muted w-8 text-right">
				{formatTime(currentTime)}
			</span>
			<input
				type="range"
				min={0}
				max={duration || 0}
				value={currentTime}
				onChange={handleChange}
				step={0.1}
				className="flex-1"
			/>
			<span className="text-[10px] tabular-nums text-mac-text-muted w-8">
				{formatTime(duration)}
			</span>
		</div>
	);
}
