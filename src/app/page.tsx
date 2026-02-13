import { albums } from "@/data/albums";
import AlbumPage from "@/components/AlbumPage";

export default function Page() {
	return <AlbumPage albums={albums} />;
}
