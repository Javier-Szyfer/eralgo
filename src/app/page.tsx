import SongItem from "@/components/SongItem";
import Image from "next/image";

export default function Home() {
	return (
		<main className="p-4 leading-none">
			<div className="h-[110px] w-[70px] md:h-[300px] md:w-[200px] opacity-40 ">
				<Image
					src="/img/4y+.png"
					width={3000}
					height={3000}
					alt="4y+"
					className="drag-none pointer-events-none select-none"
					layout="responsive"
				/>
			</div>
			<div className="flex flex-col gap-2">
				<SongItem title="sum" />
				<SongItem title="watcher" />
				<SongItem title="lostfound" />
				<SongItem title="casa del capitano" />
				<SongItem title="eoy" />
			</div>
			<div className="mt-6 h-[200px] w-[200px] md:h-[400px] md:w-[300px] md:absolute md:bottom-4 md:right-4 border-2 border-[#7a5151] mix-blend-luminosity">
				<Image
					src="/img/profile-pic.jpg"
					width={300}
					height={300}
					alt="eralgo"
					className="drag-none pointer-events-none select-none"
					layout="responsive"
				/>
			</div>
		</main>
	);
}
