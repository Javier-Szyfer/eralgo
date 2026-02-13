interface AlbumCoverProps {
	src: string;
	alt: string;
}

export default function AlbumCover({ src, alt }: AlbumCoverProps) {
	return (
		<div className="w-full max-w-[240px] md:max-w-[400px] aspect-square flex-shrink-0">
			<img
				src={src}
				alt={alt}
				crossOrigin="anonymous"
				className="w-full h-full object-cover rounded-lg border border-mac-border"
			/>
		</div>
	);
}
