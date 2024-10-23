"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import { db } from "../utils/firebaseConfig";
import Link from "next/link";
import ImagePreview from "../components/ImagePreview";

const PreviousImages = () => {
  const [images, setImages] = useState<
    { imageUrl: string; prompt: string; id: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "generatedImages"));
        const imagesList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            imageUrl: data.imageUrl,
            prompt: data.prompt,
            id: doc.id,
          };
        });
        setImages(imagesList);
      } catch (error) {
        console.error("Error fetching images: ", error);
        setError("Failed to load images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-10 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-10 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Previously Generated Images</h1>
        <Link
          href="/generate"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Generate New Image
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No images available.
          </div>
        ) : (
          images.map((image, idx) => (
            <ImagePreview
              key={idx}
              imageUrl={image.imageUrl}
              altText={`Generated Image ${idx + 1}`}
              prompt={image.prompt}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PreviousImages;
