"use client";

// Components
import SongItem from "@/components/SongItem";
import Logo from "@/components/Logo";
import EralgoImage from "@/components/EralgoImage";

// Hooks
import { useContext } from "react";

// Context
import { MusicPlayerContext } from "@/store/MusicPlayerCtx";

const Home = () => {
	const { src } = useContext(MusicPlayerContext);
	return (
		<>
			<Logo />
			<div className="flex flex-col gap-2">
				<SongItem title="sum" />
				<SongItem title="watcher" />
				<SongItem title="lostfound" />
				<SongItem title="casa del capitano" />
				<SongItem title="eoy" />
			</div>
			<EralgoImage />
		</>
	);
};

export default Home;
