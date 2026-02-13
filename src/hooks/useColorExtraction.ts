"use client";

interface Colors {
	bgColor: string;
	accentColor: string;
	textColor: string;
}

const FIXED: Colors = {
	bgColor: "#d4d0c8",
	accentColor: "#000080",
	textColor: "#222222",
};

export function useColorExtraction(_coverUrl: string): Colors {
	return FIXED;
}
