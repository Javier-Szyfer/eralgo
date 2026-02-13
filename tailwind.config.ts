import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				"mac-desktop": "var(--mac-desktop)",
				"mac-window": "var(--mac-window-bg)",
				"mac-border": "var(--mac-border)",
				"mac-text": "var(--mac-text)",
				"mac-text-muted": "var(--mac-text-muted)",
				"mac-accent": "var(--mac-accent)",
				"mac-accent-text": "var(--mac-accent-text)",
			},
		},
	},
	plugins: [],
};
export default config;
