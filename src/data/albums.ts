import type { Album } from "@/types";

export const albums: [Album, Album] = [
	{
		id: "often-after",
		title: "often after",
		artist: "eralgo",
		year: 2026,
		releaseDate: "February 2026",
		coverUrl: "/often-after.jpeg",
		tracks: [
			{
				id: "oa-01",
				title: "track one",
				duration: "4:10",
				durationSeconds: 250,
			},
		],
	},
	{
		id: "4y-plus",
		title: "4y+",
		artist: "eralgo",
		year: 2024,
		releaseDate: "December 2024",
		coverUrl: "/4y+_artwork.jpeg",
		tracks: [
			{
				id: "4yp-01",
				title: "sum",
				duration: "5:04",
				durationSeconds: 304,
			},
			{
				id: "4yp-02",
				title: "watcher",
				duration: "4:26",
				durationSeconds: 266,
			},
			{
				id: "4yp-03",
				title: "lostfound",
				duration: "3:24",
				durationSeconds: 204,
			},
			{
				id: "4yp-04",
				title: "casa del capitano",
				duration: "2:09",
				durationSeconds: 129,
			},
			{
				id: "4yp-05",
				title: "eoy",
				duration: "4:12",
				durationSeconds: 252,
			},
		],
	},
];

/** Server-side only — maps trackId → R2 object key */
export const trackKeyMap: Record<string, string> = {
	"oa-01": "often-after/01-track-one.mp3",
	"4yp-01": "4y+/sum.wav",
	"4yp-02": "4y+/watcher.wav",
	"4yp-03": "4y+/lostfound.wav",
	"4yp-04": "4y+/casa del capitano.wav",
	"4yp-05": "4y+/eoy.wav",
};
