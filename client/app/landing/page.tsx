"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Frame data with photo slots
const frames = [
    { id: "frame1", name: "Classic", url: "/frames/frame1.png", photoSlots: [{x: 0, y: 0, width: 100, height: 100}, {x: 100, y: 0, width: 100, height: 100}, {x: 0, y: 100, width: 100, height: 100}, {x: 100, y: 100, width: 100, height: 100}] }, 
    { id: "frame2", name: "Modern", url: "/frames/frame2.png", photoSlots: [{x: 50, y: 50, width: 120, height: 120}, {x: 180, y: 50, width: 120, height: 120}, {x: 50, y: 180, width: 120, height: 120}, {x: 180, y: 180, width: 120, height: 120}] },
    // Add more frames here
];

export default function PreviewPage() {
    const [photos, setPhotos] = useState<string[]>([]);
    const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter();

    // Load photos and selected frame from sessionStorage
    useEffect(() => {
        const storedPhotos = sessionStorage.getItem("photos");
        const storedFrame = sessionStorage.getItem("selectedFrame");

        if (storedPhotos && storedFrame) {
            setPhotos(JSON.parse(storedPhotos));
            setSelectedFrame(storedFrame);
        } else {
            router.push("/capture"); // Redirect if no photos or frame are found
        }
    }, [router]);

    useEffect(() => {
        if (canvasRef.current && photos.length === 4 && selectedFrame) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            if (!ctx) return;

            // Find the selected frame object
            const selectedFrameObj = frames.find(f => f.id === selectedFrame);
            const frameImg = new Image();
            frameImg.src = selectedFrameObj?.url || "";

            frameImg.onload = () => {
                const scaleX = canvas.width / 183; // Scale factor for the frame image width
                const scaleY = canvas.height / 275; // Scale factor for the frame image height
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
                ctx.drawImage(frameImg, 0, 0, 183, 275, 0, 0, canvas.width, canvas.height); // Draw the frame

                // Loop through photo slots and draw each photo in the appropriate slot
                selectedFrameObj?.photoSlots.forEach((slot, index) => {
                    const img = new Image();
                    img.src = photos[index];

                    img.onload = () => {
                        ctx.drawImage(img, slot.x, slot.y, slot.width, slot.height); // Draw each photo in the specified position
                    };
                });
            };
        }
    }, [photos, selectedFrame]);

    // Function to download the final image
    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement("a");
        link.download = "final-photo.png"; // Set file name for download
        link.href = canvas.toDataURL("image/png"); // Get the data URL of the canvas
        link.click(); // Trigger the download
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Preview Your Photos</h1>

            <div className="mb-6">
                {/* Canvas to display the frame with photos */}
                <canvas
                    ref={canvasRef}
                    width={600} // Set desired width for the canvas
                    height={800} // Set desired height for the canvas
                    className="border-4 border-gray-300"
                ></canvas>
            </div>

            <button
                onClick={downloadImage}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition"
            >
                Download Final Image
            </button>
        </div>
    );
}
