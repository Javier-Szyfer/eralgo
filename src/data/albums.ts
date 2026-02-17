import type { Album } from "@/types";

export const albums: [Album, Album] = [
	{
		id: "often-after",
		title: "often after",
		artist: "eralgo",
		year: 2026,
		releaseDate: "Release: -",
		coverUrl: "/often-after.jpeg",
		tracks: [
			{
				id: "oa-01",
				title: "unfair companies",
				duration: "3:09",
				durationSeconds: 189,
			},
			{
				id: "oa-02",
				title: "anna´s archive",
				duration: "4:12",
				durationSeconds: 252,
			},
			{
				id: "oa-03",
				title: "duck call",
				duration: "2:26",
				durationSeconds: 146,
			},
			{
				id: "oa-04",
				title: "genlos",
				duration: "2:34",
				durationSeconds: 154,
			},
			{
				id: "oa-05",
				title: "widespread",
				duration: "5:49",
				durationSeconds: 349,
			},
			{
				id: "oa-06",
				title: "reskin",
				duration: "4:09",
				durationSeconds: 249,
			},
			{
				id: "oa-07",
				title: "PRIVACY",
				duration: "0:52",
				durationSeconds: 52,
			},
			{
				id: "oa-08",
				title: "often after",
				duration: "3:33",
				durationSeconds: 213,
			},
			{
				id: "oa-09",
				title: "social being",
				duration: "4:28",
				durationSeconds: 268,
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
	"oa-01": "often after/unfair companies.mp3",
	"oa-02": "often after/anna´s archive.mp3",
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
