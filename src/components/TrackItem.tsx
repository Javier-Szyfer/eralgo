import { formatTime } from "@/lib/formatTime";
import type { Track } from "@/types";

interface TrackItemProps {
	track: Track;
	index: number;
	isActive: boolean;
	isPlaying: boolean;
	onSelect: () => void;
}

export default function TrackItem({
	track,
	index,
	isActive,
	isPlaying,
	onSelect,
}: TrackItemProps) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={`w-full flex items-center gap-2 pl-2 pr-3 py-1 text-left border-b border-white/50 last:border-b-0 first:rounded-t-lg last:rounded-b-lg text-[13px] ${
				isActive
					? "bg-white/60 text-mac-text"
					: "text-mac-text hover:bg-white/30 transition-colors"
			}`}
		>
			<span className="w-5 text-right text-[11px] tabular-nums opacity-50 shrink-0">
				{isActive && isPlaying ? (
					<svg
						aria-hidden="true"
						width="12"
						height="12"
						viewBox="0 0 12 12"
						className="inline-block"
					>
						<rect x="1" y="2" width="2" height="8" fill="currentColor" rx="0.5">
							<animate
								attributeName="height"
								values="8;4;8"
								dur="0.8s"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="y"
								values="2;4;2"
								dur="0.8s"
								repeatCount="indefinite"
							/>
						</rect>
						<rect x="5" y="2" width="2" height="8" fill="currentColor" rx="0.5">
							<animate
								attributeName="height"
								values="4;8;4"
								dur="0.8s"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="y"
								values="4;2;4"
								dur="0.8s"
								repeatCount="indefinite"
							/>
						</rect>
						<rect x="9" y="2" width="2" height="8" fill="currentColor" rx="0.5">
							<animate
								attributeName="height"
								values="6;3;6"
								dur="0.8s"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="y"
								values="3;5;3"
								dur="0.8s"
								repeatCount="indefinite"
							/>
						</rect>
					</svg>
				) : (
					index + 1
				)}
			</span>
			<span className="flex-1 truncate">{track.title}</span>
			<span className="text-[11px] tabular-nums opacity-50 shrink-0">
				{formatTime(track.durationSeconds)}
			</span>
		</button>
	);
}
