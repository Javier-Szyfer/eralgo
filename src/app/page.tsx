import AlbumPage from "@/components/AlbumPage";
import { albums } from "@/data/albums";

export default function Page() {
	return <AlbumPage albums={albums} />;
}
