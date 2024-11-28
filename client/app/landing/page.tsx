"use client";

import { useRouter } from "next/navigation";
import '../style.css';

export default function HomePage() {
    const router = useRouter(); 

    const startPhotoSession = () => {
        router.push("/capture");
    };

    return (
        <div className="flex flex-col align-center items-center justify-center min-h-screen bg-[var(--canvas)]">
            <h1 className="text-4xl font-bold mb-4">ClickClack</h1>
            <p className="text-lg text-gray-700 mb-8">
                Capture fun and creative photos just like in a real photobooth!
            </p>
            <button
                onClick={startPhotoSession}
                className="px-6 py-3 bg-[var(--charcoal)] text-white rounded-lg shadow-lg hover:bg-blue-600 transition"
            >
                Start Photo Session
            </button>
        </div>
    );
}
