import Image from "next/image";
const EralgoImage = () => {
	return (
		<div className="mt-6 h-[200px] w-[200px] md:h-[400px] md:w-[300px] md:absolute md:bottom-4 md:right-4 border-2 border-[#7a5151] mix-blend-luminosity">
			<Image
				src="/img/profile-pic.jpg"
				width={300}
				height={300}
				alt="eralgo"
				className="drag-none pointer-events-none select-none"
			/>
		</div>
	);
};

export default EralgoImage;
