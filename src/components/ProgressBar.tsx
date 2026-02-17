import { useState, useRef, useCallback } from "react";

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
	const [isDragging, setIsDragging] = useState(false);
	const dragValueRef = useRef(0);
	const [dragDisplay, setDragDisplay] = useState(0);

	const handlePointerDown = useCallback(() => {
		dragValueRef.current = currentTime;
		setDragDisplay(currentTime);
		setIsDragging(true);
	}, [currentTime]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const val = Number(e.target.value);
			dragValueRef.current = val;
			setDragDisplay(val);
			if (!isDragging) {
				onSeek(val);
			}
		},
		[isDragging, onSeek],
	);

	const handlePointerUp = useCallback(() => {
		if (isDragging) {
			onSeek(dragValueRef.current);
			setIsDragging(false);
		}
	}, [isDragging, onSeek]);

	const displayTime = isDragging ? dragDisplay : currentTime;

	return (
		<div className="flex items-center gap-2 flex-1">
			<span className="text-[10px] tabular-nums text-mac-text-muted w-8 text-right">
				{formatTime(displayTime)}
			</span>
			<input
				type="range"
				min={0}
				max={duration || 0}
				value={displayTime}
				onChange={handleChange}
				onPointerDown={handlePointerDown}
				onPointerUp={handlePointerUp}
				step={0.1}
				className="flex-1"
			/>
			<span className="text-[10px] tabular-nums text-mac-text-muted w-8">
				{formatTime(duration)}
			</span>
		</div>
	);
}
