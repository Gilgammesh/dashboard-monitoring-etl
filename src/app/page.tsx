import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div
        className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
        style={{ backgroundImage: 'url("/background.jpg")' }}
      >
        <div className="flex flex-col items-center">
          <Image src="/logo.svg" alt="Logo" width={250} height={250} />

          <div className="mt-14 mb-10">
            <h1 className="text-green-800 text-7xl mt-4">Cloud Functions</h1>
          </div>

          <Link
            href="/panel"
            className="mt-6 px-8 py-3 bg-green-600 text-white text-lg rounded hover:bg-green-800 transition-colors"
          >
            Ir al Panel
          </Link>
        </div>
      </div>
    </div>
  );
}
