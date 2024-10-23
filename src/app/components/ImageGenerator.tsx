/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import InputForm from "./InputForm";
import ImagePreview from "./ImagePreview";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [numImages, setNumImages] = useState(1);
  const [jobIds, setJobIds] = useState<string[]>([]); // Changed to dynamic array
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState<boolean[]>([]);
  const [showLoading, setShowLoading] = useState(false);

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
  };

  const handleNumImagesChange = (num: number) => {
    setNumImages(num);
  };

  const generateImages = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setShowLoading(true);
    setImageUrls([]);
    setJobIds([]); // Reset job IDs
    setImageLoading(Array(numImages).fill(true)); // Initialize loading state for each image

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
        // Store job IDs for all requested images
        const newJobIds = data.map((item) => item.job);
        setJobIds(newJobIds);
        setTimeout(() => {
          setShowLoading(false);
        }, 10000);
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
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left side: Form */}
      <div className="md:w-1/3 h-full p-8 bg-white shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          AI Image Generator
        </h1>
        <InputForm
          prompt={prompt}
          onPromptChange={handlePromptChange}
          onSubmit={generateImages}
          loading={loading}
          numImages={numImages}
          onNumImagesChange={handleNumImagesChange}
        />
      </div>

      {/* Right side: Image Preview */}
      <div className="w-full h-full p-8 bg-gray-300 overflow-auto">
        {loading ? (
          <div className="text-center">Generating images, please wait...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imageUrls.map((url, idx) => (
              <ImagePreview
                key={idx}
                imageUrl={url}
                altText={`Generated Image ${idx + 1}`}
                prompt={prompt}
              />
            ))}
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {showLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="text-white">Generating images, please wait...</div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
