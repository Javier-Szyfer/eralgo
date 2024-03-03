import SongItem from "@/components/SongItem";
import Image from "next/image";

export default function Home() {
	return (
		<main className="p-4 leading-none">
			<div className="font-semibold text-[clamp(24px,10vw,100px)] text-[#be858577] tracking-tighter">
				4y+
			</div>
			<div className="flex flex-col gap-2">
				<SongItem title="sum" />
				<SongItem title="watcher" />
				<SongItem title="lostfound" />
				<SongItem title="casa del capitano" />
				<SongItem title="eoy" />
			</div>
			<div className="mt-6 h-[400px] w-[300px] md:absolute md:bottom-4 md:right-4 border-2 border-[#7a5151] mix-blend-luminosity">
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
