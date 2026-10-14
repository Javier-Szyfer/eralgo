export interface Track {
	id: string;
	title: string;
	durationSeconds: number;
}

export interface Album {
	id: string;
	title: string;
	artist: string;
	releaseDate: string;
	coverUrl: string;
	tracks: Track[];
}
