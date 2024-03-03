import Image from "next/image";
const Logo = () => {
	return (
		<div className="h-[110px] w-[70px] md:h-[300px] md:w-[200px] opacity-30">
			<Image
				src="/img/4y+.png"
				width={3000}
				height={3000}
				alt="4y+"
				className="drag-none pointer-events-none select-none"
			/>
		</div>
	);
};

export default Logo;
