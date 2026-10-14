import type { Album } from "@/types";

export const albums: Album[] = [
	{
		id: "often-after",
		title: "often after",
		artist: "eralgo",
		releaseDate: "March 2, 2026",
		coverUrl: "/often-after.jpeg",
		tracks: [
			{
				id: "oa-01",
				title: "unfair companies",
				durationSeconds: 188.87,
			},
			{
				id: "oa-02",
				title: "anna´s archive",
				durationSeconds: 252.16,
			},
			{
				id: "oa-03",
				title: "duck call",
				durationSeconds: 145.61,
			},
			{
				id: "oa-04",
				title: "genlos",
				durationSeconds: 154.28,
			},
			{
				id: "oa-05",
				title: "widespread",
				durationSeconds: 348.71,
			},
			{
				id: "oa-06",
				title: "reskin",
				durationSeconds: 249.1,
			},
			{
				id: "oa-07",
				title: "PRIVACY",
				durationSeconds: 51.62,
			},
			{
				id: "oa-08",
				title: "often after",
				durationSeconds: 212.92,
			},
			{
				id: "oa-09",
				title: "social being",
				durationSeconds: 267.6,
			},
		],
	},
	{
		id: "4y-plus",
		title: "4y+",
		artist: "eralgo",
		releaseDate: "December 2024",
		coverUrl: "/4y+_artwork.jpeg",
		tracks: [
			{
				id: "4yp-01",
				title: "sum",
				durationSeconds: 264.25,
			},
			{
				id: "4yp-02",
				title: "watcher",
				durationSeconds: 231.15,
			},
			{
				id: "4yp-03",
				title: "lostfound",
				durationSeconds: 176.94,
			},
			{
				id: "4yp-04",
				title: "casa del capitano",
				durationSeconds: 112.41,
			},
			{
				id: "4yp-05",
				title: "eoy",
				durationSeconds: 219.13,
			},
		],
	},
];

/** Server-side only — maps trackId → R2 object key */
export const trackKeyMap: Record<string, string> = {
	"oa-01": "often after/unfair companies.mp3",
	"oa-02": "often after/anna's archive.mp3",
	"oa-03": "often after/duck call.mp3",
	"oa-04": "often after/genlos.mp3",
	"oa-05": "often after/widespread.mp3",
	"oa-06": "often after/reskin.mp3",
	"oa-07": "often after/PRIVACY.mp3",
	"oa-08": "often after/often after.mp3",
	"oa-09": "often after/social being.mp3",
	"4yp-01": "4y+/sum.mp3",
	"4yp-02": "4y+/watcher.mp3",
	"4yp-03": "4y+/lostfound.mp3",
	"4yp-04": "4y+/casa del capitano.mp3",
	"4yp-05": "4y+/eoy.mp3",
};
