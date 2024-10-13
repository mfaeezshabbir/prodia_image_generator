"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);

  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setPrompt(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      generateImage();
    }
  };

  const generateImage = async () => {
    if (prompt.trim() === "") {
      alert("Please enter a prompt");
      return;
    }

    setLoading(true);
    setImageUrl("");
    setDownloadUrl(null);
    setProgress(0);

    try {
      const response = await fetch("/api/prodia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setJobId(data.job);
      } else {
        console.error("Error generating image:", data);
        alert("Failed to generate image. Please try again.");
      }
    } catch (error) {
      console.error("Error during image generation:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkImageStatus = async (jobId: never) => {
    try {
      const response = await fetch(`/api/prodia?jobId=${jobId}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.status === "succeeded") {
        const imageUrl = data.imageUrl;
        setImageUrl(imageUrl);
        setDownloadUrl(`${imageUrl}?download=1`);
        setImageLoading(true); // Set image loading to true when image URL is set
        return true;
      } else if (data.status === "pending") {
        setProgress((prev) => Math.min(prev + 10, 100)); // Increment progress
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
    if (jobId) {
      const interval = setInterval(async () => {
        const isCompleted = await checkImageStatus(jobId);
        if (isCompleted) {
          clearInterval(interval);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [jobId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Type your message here..."
            value={prompt}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-grow text-gray-700 text-lg px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={generateImage}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-r-full text-lg shadow-md hover:from-blue-500 hover:to-blue-300 transition duration-300"
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>

        {imageLoading && (
          <div className="mt-4 flex justify-center items-center" style={{ width: '100%', height: '100%' }}>
            <div className="text-gray-700">Generating image...</div>
          </div>
        )}

        {!loading && imageUrl && (
          <div className="mt-4 text-center">
            {imageLoading && <div className="text-gray-700">Loading image...</div>}
            <Image
              src={imageUrl}
              alt="Generated"
              width={400}
              height={400}
              className="mx-auto mt-5 rounded-lg shadow-lg"
              onLoad={() => setImageLoading(false)} // Set image loading to false when image has loaded
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null; // prevents looping
                setImageUrl("/path/to/fallback/image.png"); // Set a fallback image
                setImageLoading(false); // Set image loading to false on error
              }}
            />
            {downloadUrl && (
              <a
                href={downloadUrl}
                className="mt-3 inline-block px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-400 transition duration-300"
                download
              >
                Download Image
              </a>
            )}
            <div className="mt-3 text-gray-700">
              <span>Shareable URL: </span>
              <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                {imageUrl}
              </a>
            </div>
          </div>
        )}

        {jobId && <div className="mt-5 text-gray-500">Job ID: {jobId}</div>}
      </div>
    </div>
  );
};

export default Home;