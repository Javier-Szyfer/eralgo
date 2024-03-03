import Image from "next/image";
const EralgoImage = () => {
	return (
		<div className="overflow-hidden mt-6 h-[300px] w-[200px] md:h-[400px] md:w-[300px] md:absolute md:bottom-4 md:right-4  mix-blend-luminosity">
			<Image
				src="/img/profile-pic.jpg"
				width={300}
				height={300}
				alt="eralgo"
				priority
				className="drag-none pointer-events-none select-none border-2 border-[#7a5151] object-cover"
			/>
		</div>
	);
};

export default EralgoImage;
