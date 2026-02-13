export interface Track {
	id: string;
	title: string;
	duration: string;
	durationSeconds: number;
}

export interface Album {
	id: string;
	title: string;
	artist: string;
	year: number;
	releaseDate: string;
	coverUrl: string;
	tracks: Track[];
}
