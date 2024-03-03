"use client";
const SongItem = ({ title, src }: { title: string; src?: string }) => {
	return (
		<div className="font-semibold tracking-tighter text-[clamp(24px,7vw,92px)] text-[#a37373] max-w-min whitespace-nowrap select-none cursor-pointer hover:text-[#be858577]">
			{title}
		</div>
	);
};

export default SongItem;
