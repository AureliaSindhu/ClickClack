"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter(); 

    const startPhotoSession = () => {
        router.push("/capture");
    };

    return (
        <div className="flex flex-col align-center items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to Korean Photobooth</h1>
            <p className="text-lg text-gray-700 mb-8">
                Capture fun and creative photos just like in a real photobooth!
            </p>
            <button
                onClick={startPhotoSession}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition"
            >
                Start Photo Session
            </button>
        </div>
    );
}
