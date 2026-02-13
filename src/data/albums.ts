import type { Album } from "@/types";

const R2_BASE = "https://pub-9025265ed5a24ffcbe9c5c7a29a18fa2.r2.dev";

export const albums: [Album, Album] = [
	{
		id: "4y-plus",
		title: "4y+",
		artist: "eralgo",
		year: 2024,
		coverUrl: "/4y+_artwork.jpeg",
		tracks: [
			{
				id: "4yp-01",
				title: "sum",
				duration: "5:04",
				durationSeconds: 304,
				audioUrl: `${R2_BASE}/4y+/sum.wav`,
			},
			{
				id: "4yp-02",
				title: "watcher",
				duration: "4:26",
				durationSeconds: 266,
				audioUrl: `${R2_BASE}/4y+/watcher.wav`,
			},
			{
				id: "4yp-03",
				title: "lostfound",
				duration: "3:24",
				durationSeconds: 204,
				audioUrl: `${R2_BASE}/4y+/lostfound.wav`,
			},
			{
				id: "4yp-04",
				title: "casa del capitano",
				duration: "2:09",
				durationSeconds: 129,
				audioUrl: `${R2_BASE}/4y+/casa del capitano.wav`,
			},
			{
				id: "4yp-05",
				title: "eoy",
				duration: "4:12",
				durationSeconds: 252,
				audioUrl: `${R2_BASE}/4y+/eoy.wav`,
			},
		],
	},
	{
		id: "often-after",
		title: "often after",
		artist: "eralgo",
		year: 2025,
		coverUrl: "/often-after.jpeg",
		tracks: [
			{
				id: "oa-01",
				title: "track one",
				duration: "4:10",
				durationSeconds: 250,
				audioUrl: `${R2_BASE}/often-after/01-track-one.mp3`,
			},
		],
	},
];
