import Image from "next/image";
export default function Home() {
  return (
    <main className="p-2">
     <div className="text-2xl font-bold">eralgo - 4y+</div>
      <Image src="/artwork.jpg" alt="artwork" width={500} height={500} />
      <div className="flex flex-col">
      contact: hello@javier.onl
      <a className="text-blue-600" href="https://www.instagram.com/eralgoworld/">Instagram</a>
      <a className="text-blue-600" href="https://ditto.fm/4y">Listen 🎹 </a>
      </div>
    </main>
  );
}
