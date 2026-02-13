interface PlayerControlsProps {
	isPlaying: boolean;
	onTogglePlay: () => void;
	onPrev: () => void;
	onNext: () => void;
}

export default function PlayerControls({
	isPlaying,
	onTogglePlay,
	onPrev,
	onNext,
}: PlayerControlsProps) {
	return (
		<div className="flex items-center gap-4">
			{/* Previous */}
			<button
				onClick={onPrev}
				className="text-mac-text-muted hover:text-mac-text transition-colors"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
					<path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
				</svg>
			</button>

			{/* Play/Pause */}
			<button
				onClick={onTogglePlay}
				className="w-8 h-8 rounded-full border border-white/50 bg-white/50 backdrop-blur-xl flex items-center justify-center hover:bg-white/60 transition-colors"
			>
				{isPlaying ? (
					<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--mac-text)">
						<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
					</svg>
				) : (
					<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--mac-text)">
						<path d="M8 5v14l11-7z" />
					</svg>
				)}
			</button>

			{/* Next */}
			<button
				onClick={onNext}
				className="text-mac-text-muted hover:text-mac-text transition-colors"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
					<path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
				</svg>
			</button>
		</div>
	);
}
