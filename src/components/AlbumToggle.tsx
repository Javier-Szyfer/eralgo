import type { Album } from "@/types";

interface AlbumToggleProps {
	albums: [Album, Album];
	activeIndex: number;
	onSelect: (index: number) => void;
}

export default function AlbumToggle({
	albums,
	activeIndex,
	onSelect,
}: AlbumToggleProps) {
	return (
		<div className="flex flex-col items-start gap-1 py-3">
			{albums.map((album, i) => (
				<button
					key={album.id}
					onClick={() => onSelect(i)}
					className={`text-xs transition-colors ${
						activeIndex === i
							? "text-mac-text"
							: "text-mac-text-muted hover:text-mac-text"
					}`}
				>
					{album.title}
				</button>
			))}
		</div>
	);
}
