/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import InputForm from "./InputForm";
import ImagePreview from "./ImagePreview";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [numImages, setNumImages] = useState(1);
  const [jobIds, setJobIds] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState<boolean[]>([]);
  const [showLoading, setShowLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("sdxl");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
  };

  const handleNumImagesChange = (num: number) => {
    setNumImages(num);
  };
  
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  const generateImages = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate images.");
      return;
    }

    setLoading(true);
    setShowLoading(true);
    setImageUrls([]);
    setJobIds([]); // Reset job IDs
    setErrorMessage(null);
    setImageLoading(Array(numImages).fill(true)); // Initialize loading state for each image

    try {
      // Generate images sequentially instead of in parallel to avoid timeout issues
      const newJobIds = [];
      
      for (let i = 0; i < numImages; i++) {
        try {
          const response = await fetch("/api/prodia", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              prompt,
              userId: currentUser?.uid || 'anonymous',
              model: selectedModel,
              negative_prompt: "blurry, bad quality, distorted, low resolution, ugly, unaesthetic",
              steps: 30,
              cfg_scale: 7
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.details || errorData.error || errorData.message || "Failed to generate image";
            setErrorMessage(errorMsg);
            toast.error(`Failed to generate image ${i+1}: ${errorMsg}`);
            continue;
          }
          
          const data = await response.json();
          if (data.image) {
            setImageUrls((prev) => [...prev, data.image]);
          }
          // Add a small delay between requests to avoid rate limiting
          if (i < numImages - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`Error generating image ${i+1}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setErrorMessage(errorMessage);
          toast.error(`Failed to generate image ${i+1}: ${errorMessage}`);
        }
      }
      
      if (imageUrls.length > 0) {
        setTimeout(() => {
          setShowLoading(false);
        }, 3000);
        toast.success("Image generation started successfully!");
      } else {
        setErrorMessage("Failed to generate any images. Please try again.");
        toast.error("Failed to generate images. Please try again.");
        setShowLoading(false);
      }
    } catch (error) {
      console.error("Error generating images:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred. Please try again later.";
      setErrorMessage(errorMessage);
      toast.error(errorMessage);
      setShowLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const checkImageStatus = async (jobId: string, index: number) => {
    let retries = 0;
    const maxRetries = 3;
    
    const checkStatus = async (): Promise<boolean> => {
      try {
        const response = await fetch(`/api/prodia?jobId=${jobId}`);
        
        if (!response.ok) {
          throw new Error("Failed to check image status");
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
        } else if (data.status === "failed") {
          toast.error(`Image generation failed: ${data.error || "Unknown error"}`);
          return true; // Mark as complete to stop polling
        } else {
          throw new Error("Job status unknown");
        }
      } catch (error) {
        console.error("Error during status check:", error);
        
        // Retry logic
        retries++;
        if (retries < maxRetries) {
          console.log(`Retrying status check (${retries}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retrying
          return await checkStatus();
        }
        
        toast.error("Failed to check image status. Please try refreshing.");
        return false;
      }
    };
    
    return checkStatus();
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="glass-effect py-5 px-8 flex justify-between items-center w-full z-10">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-gray-800 hover:text-indigo-600 flex items-center">
            <LuArrowLeft className="mr-2" /> Back to Home
          </Link>
        </div>
        <div className="font-bold text-2xl">
          <span className="text-gradient-animated">Prodia</span><span className="font-light">Studio</span>
        </div>
        <div className="w-24">
          {/* Spacer for flex alignment */}
        </div>
      </nav>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-6 py-10 gap-8 flex-grow w-full">
        {/* Left side: Form */}
        <div className="md:w-2/5 lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Create with AI
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
        </div>

        {/* Right side: Image Preview */}
        <div className="w-full md:w-3/5 lg:w-2/3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 h-full">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Generated Images</h2>
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p>Generating your images...</p>
                <p className="text-sm mt-2 text-gray-400">This may take a few moments</p>
              </div>
            ) : imageUrls.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {imageUrls.map((url, idx) => (
                  <ImagePreview
                    key={idx}
                    imageUrl={url}
                    altText={`Generated Image ${idx + 1}`}
                    prompt={prompt}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="mb-2">No images generated yet</p>
                <p className="text-sm text-gray-400">Fill the form and click &quot;Generate&quot; to create images</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {showLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-800 font-medium">Creating your masterpiece...</p>
            <p className="text-gray-500 text-sm mt-2">This usually takes 15-20 seconds</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
