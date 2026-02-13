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
		<div className="flex items-center justify-center gap-4 py-3">
			{albums.map((album, i) => (
				<button
					key={album.id}
					onClick={() => onSelect(i)}
					className={`text-sm transition-colors ${
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
