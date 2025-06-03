"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import Link from "next/link";
import ImagePreview from "../components/ImagePreview";
import AppLayout from "../AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";

const PreviousImages = () => {
  const [images, setImages] = useState<
    { imageUrl: string; prompt: string; id: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        let querySnapshot;
        // If user is logged in, fetch only their images
        if (currentUser) {
          querySnapshot = await getDocs(
            query(
              collection(db, "generatedImages"), 
              where("userId", "==", currentUser.uid)
            )
          );
        } else {
          // Otherwise fetch all images (or none if you want to restrict)
          querySnapshot = await getDocs(collection(db, "generatedImages"));
        }
        
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
  }, [currentUser]);

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 pt-20 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading your gallery...</p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 pt-20 flex flex-col items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h3 className="text-red-600 font-medium mb-2">Error Loading Images</h3>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <div className="pt-24 px-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Your Image Gallery</h1>
                <p className="text-gray-600 mt-1">Browse through your previously generated images</p>
              </div>
              <Link
                href="/generate"
                className="gradient-bg text-white font-medium py-2.5 px-6 rounded-lg transition-transform hover:scale-105 shadow-sm flex items-center"
              >
                Create New Image
              </Link>
            </div>

            {images.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl">🖼️</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Images Yet</h3>
                <p className="text-gray-600 mb-6">You haven&apos;t generated any images yet</p>
                <Link
                  href="/generate"
                  className="inline-flex items-center gradient-bg text-white font-medium py-2.5 px-6 rounded-lg transition-transform hover:scale-105 shadow-sm"
                >
                  Create Your First Image
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((image, idx) => (
                  <ImagePreview
                    key={idx}
                    imageUrl={image.imageUrl}
                    altText={`Generated Image ${idx + 1}`}
                    prompt={image.prompt}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </ProtectedRoute>
    </AppLayout>
  );
};

export default PreviousImages;
