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
            <h1 className="text-4xl font-bold mb-4 text-[var(--charcoal)]">ClickClack</h1>
            <p className="text-lg text-[var(--slate)] mb-4">
                Capture fun and creative photos just like in a real photobooth!
            </p>
            <button
                onClick={startPhotoSession}
                className="px-6 py-3 bg-[var(--charcoal)] text-white rounded-lg shadow-lg hover:bg-[var(--slate)] transition"
            >
                Start Photo Session
            </button>
        </div>
    );
}
