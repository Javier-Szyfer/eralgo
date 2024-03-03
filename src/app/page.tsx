// Components
import Home from "@/components/Home";

// Context
import MusicPlayerProvider from "@/store/MusicPlayerCtx";

export default function Page() {
	return (
		<main className="p-4 leading-none">
			<MusicPlayerProvider>
				<Home />
			</MusicPlayerProvider>
		</main>
	);
}
