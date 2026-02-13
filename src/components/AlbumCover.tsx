interface AlbumCoverProps {
	src: string;
	alt: string;
}

export default function AlbumCover({ src, alt }: AlbumCoverProps) {
	return (
		<div className="w-2/5 sm:w-full aspect-square flex-shrink-0">
			<img
				src={src}
				alt={alt}
				crossOrigin="anonymous"
				className="w-full h-full object-cover rounded-lg border border-white/50"
			/>
		</div>
	);
}
