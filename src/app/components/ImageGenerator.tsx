"use client";
import React, { useState, useEffect } from "react";
import Switch from "./Switch";
import InputForm from "./InputForm";
import ImagePreview from "./ImagePreview";

const ImageGenerator = () => {
    const [prompt, setPrompt] = useState("");
    const [numImages, setNumImages] = useState(1); // 1 or 2 images
    const [jobIds, setJobIds] = useState<(string | null)[]>([null, null]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [imageLoading, setImageLoading] = useState([false, false]);

    const handlePromptChange = (newPrompt: string) => {
        setPrompt(newPrompt);
    };

    const handleSwitchChange = (checked: boolean) => {
        setNumImages(checked ? 2 : 1);
    };

    const generateImages = async () => {
        if (!prompt.trim()) {
            alert("Please enter a prompt.");
            return;
        }

        setLoading(true);
        setImageUrls([]);
        setJobIds([null, null]); // Reset job IDs
        setImageLoading([true, true]); // Show image loading for both slots initially

        try {
            const responses = await Promise.all(
                Array.from({ length: numImages }).map(() =>
                    fetch("/api/prodia", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ prompt }),
                    })
                )
            );

            const data = await Promise.all(responses.map((res) => res.json()));

            if (responses.every((res) => res.ok)) {
                setJobIds([data[0].job, data[1]?.job || null]);
            } else {
                alert("Failed to generate images.");
            }
        } catch (error) {
            console.error("Error generating images:", error);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const checkImageStatus = async (jobId: string, index: number) => {
        try {
            const response = await fetch(`/api/prodia?jobId=${jobId}`);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            if (data.status === "succeeded") {
                const imageUrl = data.imageUrl;
                setImageUrls((prev) => {
                    const newUrls = [...prev];
                    newUrls[index] = imageUrl;
                    return newUrls;
                });

                setImageLoading((prev) => {
                    const newLoading = [...prev];
                    newLoading[index] = false;
                    return newLoading;
                });
                return true;
            } else if (data.status === "pending") {
                return false;
            } else {
                throw new Error("Job status unknown");
            }
        } catch (error) {
            console.error("Error during status check:", error);
            return false;
        }
    };

    useEffect(() => {
        jobIds.forEach((jobId, index) => {
            if (jobId) {
                const interval = setInterval(async () => {
                    const isCompleted = await checkImageStatus(jobId, index);
                    if (isCompleted) {
                        clearInterval(interval);
                    }
                }, 5000);

                return () => clearInterval(interval);
            }
        });
    }, [jobIds]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
            <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">AI Image Generator</h1>
                <Switch label="Generate Two Images" checked={numImages === 2} onChange={handleSwitchChange} />
                <InputForm
                    prompt={prompt}
                    onPromptChange={handlePromptChange}
                    onSubmit={generateImages}
                    loading={loading}
                />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        <div className="text-center col-span-2">Generating images, please wait...</div>
                    ) : (
                        imageUrls.map((url, idx) => (
                            <ImagePreview key={idx} imageUrl={url} altText={`Generated Image ${idx + 1}`} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageGenerator;
