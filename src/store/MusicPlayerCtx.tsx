"use client";

import { createContext } from "react";

export const MusicPlayerContext = createContext({} as MusicPlayerContextType);
const MusicPlayerProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<MusicPlayerContext.Provider
			value={{
				src: "hello",
			}}
		>
			{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
			<audio />
			{children}
		</MusicPlayerContext.Provider>
	);
};

export default MusicPlayerProvider;
