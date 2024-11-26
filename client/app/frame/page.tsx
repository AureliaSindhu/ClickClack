"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Frame {
    id: string;
    type: "color" | "custom";
    src: string; // URL of the frame image or color code
    name: string;
}

export default function FramePage() {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);
    const [frames, setFrames] = useState<Frame[]>([]);
    const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

    // Predefined color frames
    const colorFrames: Frame[] = [
        { id: "color-white", type: "color", src: "#FFFFFF", name: "White Border" },
        { id: "color-red", type: "color", src: "#FF0000", name: "Red Border" },
        { id: "color-blue", type: "color", src: "#0000FF", name: "Blue Border" },
        { id: "color-green", type: "color", src: "#00FF00", name: "Green Border" },
        // Add more color frames as needed
    ];

    // Predefined custom frames (ensure these images are in the /public/custom-frames/ directory)
    const customFrames: Frame[] = [
        { id: "custom1", type: "custom", src: "/custom-frames/custom-frame1.png", name: "Floral Frame" },
        { id: "custom2", type: "custom", src: "/custom-frames/custom-frame2.png", name: "Vintage Frame" },
        // Add more custom frames as needed
    ];

    useEffect(() => {
        // Load photos from sessionStorage
        const storedPhotos = sessionStorage.getItem("photos");
        if (storedPhotos) {
            setPhotos(JSON.parse(storedPhotos));
        } else {
            // If no photos are found, redirect back to the capture page
            router.push("/capture");
        }

        // Initialize frames with color and custom frames
        setFrames([...colorFrames, ...customFrames]);

        // Load selected frame from sessionStorage or set default
        const storedSelectedFrame = sessionStorage.getItem("selectedFrame");
        if (storedSelectedFrame) {
            setSelectedFrame(JSON.parse(storedSelectedFrame));
        } else {
            // Set default frame as white border
            setSelectedFrame(colorFrames[0]);
        }
    }, []);

    // Handle frame selection
    const handleSelectFrame = (frame: Frame) => {
        setSelectedFrame(frame);
        sessionStorage.setItem("selectedFrame", JSON.stringify(frame));
    };

    const handleProceed = () => {
        // Proceed to the next step/page
        router.push("/finalize"); // Update the route as needed
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-6">Select a Frame for Your Photos</h1>
            
            {/* Frame Canvas */}
            <div
                className="relative flex flex-col items-center justify-center mb-8"
                style={{
                    width: "400px",
                    height: "400px",
                    backgroundColor: selectedFrame?.type === "color" ? selectedFrame.src : "transparent",
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
                    />
                )}

                {/* Photo Grid */}
                <div
                    className="grid grid-cols-2 gap-4 z-10"
                    style={{
                        paddingTop: selectedFrame?.type === "color" ? "10px" : "0",
                        paddingBottom: selectedFrame?.type === "color" ? "10px" : "0",
                        width: "320px", // 160px * 2
                        height: "320px", // 160px * 2
                    }}
                >
                    {photos.map((photo, index) => (
                        <img
                            key={index}
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-40 h-40 object-cover rounded-md"
                            style={{ width: "160px", height: "160px" }}
                        />
                    ))}
                </div>
            </div>

            {/* Frame Options */}
            <div className="w-full max-w-4xl">
                <h2 className="text-xl font-semibold mb-4">Choose a Frame</h2>
                
                {/* Color Frames */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Color Frames</h3>
                    <div className="flex flex-wrap gap-4">
                        {colorFrames.map((frame) => (
                            <div
                                key={frame.id}
                                className={`flex flex-col items-center cursor-pointer p-2 rounded-md border-2 ${
                                    selectedFrame?.id === frame.id ? "border-blue-500" : "border-transparent"
                                }`}
                                onClick={() => handleSelectFrame(frame)}
                            >
                                <div
                                    className="w-16 h-16 rounded-full mb-2"
                                    style={{ backgroundColor: frame.src }}
                                ></div>
                                <p className="text-center">{frame.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Custom Frames */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Custom Frames</h3>
                    <div className="flex flex-wrap gap-4">
                        {customFrames.length > 0 ? (
                            customFrames.map((frame) => (
                                <div
                                    key={frame.id}
                                    className={`flex flex-col items-center cursor-pointer p-2 rounded-md border-2 ${
                                        selectedFrame?.id === frame.id ? "border-blue-500" : "border-transparent"
                                    }`}
                                    onClick={() => handleSelectFrame(frame)}
                                >
                                    <img
                                        src={frame.src}
                                        alt={frame.name}
                                        className="w-24 h-24 object-contain mb-2"
                                    />
                                    <p className="text-center">{frame.name}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No custom frames available.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Proceed Button */}
            <button
                onClick={handleProceed}
                className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition"
                disabled={!selectedFrame}
            >
                Proceed to Finalize
            </button>
        </div>
    );
}
