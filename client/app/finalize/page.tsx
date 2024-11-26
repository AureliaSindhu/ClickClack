"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
} from "react-share";

interface Frame {
    id: string;
    type: "color" | "custom";
    src: string; // URL of the frame image or color code
    name: string;
}

export default function FinalizePage() {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);
    const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
    const [finalImage, setFinalImage] = useState<string>("");

    const finalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load photos from sessionStorage
        const storedPhotos = sessionStorage.getItem("photos");
        if (storedPhotos) {
            setPhotos(JSON.parse(storedPhotos));
        } else {
            // If no photos are found, redirect back to the capture page
            router.push("/capture");
        }

        // Load selected frame from sessionStorage
        const storedSelectedFrame = sessionStorage.getItem("selectedFrame");
        if (storedSelectedFrame) {
            setSelectedFrame(JSON.parse(storedSelectedFrame));
        } else {
            // If no frame is selected, redirect back to the frame selection page
            router.push("/frame");
        }
    }, [router]);

    useEffect(() => {
        if (photos.length > 0 && selectedFrame) {
            // Generate the final image after the component mounts and data is loaded
            generateFinalImage();
        }
    }, [photos, selectedFrame]);

    const generateFinalImage = async () => {
        if (finalRef.current) {
            try {
                const canvas = await html2canvas(finalRef.current, {
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: null, // Ensures transparency if needed
                });
                const dataURL = canvas.toDataURL("image/png");
                setFinalImage(dataURL);
            } catch (error) {
                console.error("Error generating final image:", error);
            }
        }
    };

    const handleDownload = () => {
        if (finalImage) {
            const link = document.createElement("a");
            link.href = finalImage;
            link.download = "final_image.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleShare = () => {
        // Instagram sharing via web is limited. Users typically need to upload manually.
        alert("Instagram sharing is not directly supported. Please download the image and share manually.");
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-6">Finalize Your Photos</h1>

            {/* Final Image Preview */}
            <div
                ref={finalRef}
                className="relative flex flex-col items-center justify-center mb-8 bg-white"
                style={{
                    width: "400px",
                    height: "340px", // 320px photo grid + 10px top + 10px bottom borders
                    backgroundColor: selectedFrame?.type === "color" ? "transparent" : "transparent",
                    padding: selectedFrame?.type === "color" ? "0px" : "0px", // No padding needed since borders are separate
                }}
            >
                {/* Top Border */}
                {selectedFrame?.type === "color" && (
                    <div
                        className="absolute top-0 left-0 w-full"
                        style={{ height: "10px", backgroundColor: selectedFrame.src }}
                    ></div>
                )}

                {/* Bottom Border */}
                {selectedFrame?.type === "color" && (
                    <div
                        className="absolute bottom-0 left-0 w-full"
                        style={{ height: "10px", backgroundColor: selectedFrame.src }}
                    ></div>
                )}

                {/* Custom Frame Overlay */}
                {selectedFrame?.type === "custom" && (
                    <img
                        src={selectedFrame.src}
                        alt={`Frame ${selectedFrame.name}`}
                        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
                        style={{ zIndex: 1 }}
                    />
                )}

                {/* Photo Grid */}
                <div
                    className="grid grid-cols-2 gap-4 z-10"
                    style={{
                        width: "320px", // 160px * 2
                        height: "320px", // 160px * 2
                        marginTop: selectedFrame?.type === "color" ? "10px" : "0",
                        marginBottom: selectedFrame?.type === "color" ? "10px" : "0",
                    }}
                >
                    {photos.map((photo, index) => (
                        <img
                            key={index}
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="object-cover rounded-md"
                            style={{ width: "160px", height: "160px" }}
                        />
                    ))}
                </div>
            </div>

            {/* Final Image Display */}
            {finalImage && (
                <div className="flex flex-col items-center mb-6">
                    <h2 className="text-xl font-semibold mb-2">Your Final Image:</h2>
                    <img 
                        src={finalImage} 
                        alt="Final Image" 
                        className="w-100 h-100 object-contain rounded-md mb-4" // Tailwind doesn't have w-100 and h-100 by default
                        style={{
                            width: "400px",
                            height: "340px",
                        }}
                    />
                </div>
            )}

            {/* Download and Share Buttons */}
            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={handleDownload}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition"
                >
                    Download Image
                </button>

                {/* Social Share Buttons */}
                <div className="flex items-center gap-4">
                    <FacebookShareButton url={finalImage} title="Check out my framed photos!">
                        <FacebookIcon size={40} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={finalImage} title="Check out my framed photos!">
                        <TwitterIcon size={40} round />
                    </TwitterShareButton>
                    <WhatsappShareButton url={finalImage} title="Check out my framed photos!">
                        <WhatsappIcon size={40} round />
                    </WhatsappShareButton>
                    <button
                        onClick={handleShare}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600 transition flex items-center"
                    >
                        Share to Instagram
                    </button>
                </div>
            </div>
        </div>
    );
}
