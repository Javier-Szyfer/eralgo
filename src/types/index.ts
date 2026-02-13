export interface Track {
	id: string;
	title: string;
	duration: string;
	durationSeconds: number;
	audioUrl: string;
}

export interface Album {
	id: string;
	title: string;
	artist: string;
	year: number;
	coverUrl: string;
	tracks: Track[];
}
