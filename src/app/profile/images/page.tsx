"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuImagePlus, LuChevronLeft, LuTrash, LuDownload, LuShare } from "react-icons/lu";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { doc, query, collection, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import toast from "react-hot-toast";

interface UserImage {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: string;
  userId: string;
}

const UserImagesPage = () => {
  const { currentUser } = useAuth();
  const [images, setImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserImages = async () => {
      if (!currentUser) return;
      
      try {
        const imagesQuery = query(
          collection(db, "generatedImages"),
          where("userId", "==", currentUser.uid)
        );
        
        const querySnapshot = await getDocs(imagesQuery);
        const userImages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<UserImage, 'id'>
        })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          
        setImages(userImages);
      } catch (error) {
        console.error("Error fetching images:", error);
        toast.error("Failed to load your images");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserImages();
  }, [currentUser]);

  const handleDelete = async (imageId: string) => {
    if (!currentUser) return;
    
    try {
      await deleteDoc(doc(db, "generatedImages", imageId));
      setImages(images.filter(img => img.id !== imageId));
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
    
    setConfirmDelete(null);
  };

  const handleShare = (imageUrl: string) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this image!",
          url: imageUrl,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(imageUrl);
      toast.success("Image URL copied to clipboard");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Content starts below the Navigation component */}
        <div className="pt-24 px-6 pb-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link href="/profile" className="mr-4 text-gray-700 hover:text-indigo-600">
                <LuChevronLeft size={20} />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">My Images</h1>
            </div>
            
            <Link
              href="/generate"
              className="gradient-bg text-white py-2.5 px-5 rounded-lg flex items-center justify-center font-medium"
            >
              <LuImagePlus className="mr-2" /> Create New Image
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-24">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <div key={image.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="relative aspect-square">
                    <Image 
                      src={image.imageUrl}
                      alt={image.prompt || "Generated image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <p className="text-sm text-gray-900 line-clamp-2 h-10">{image.prompt}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(image.timestamp).toLocaleDateString()}
                    </p>
                    
                    <div className="flex justify-between mt-4">
                      <div className="flex gap-2">
                        <a
                          href={`${image.imageUrl}?download=1`}
                          download={`Generated-Image`}
                          className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
                          title="Download"
                        >
                          <LuDownload size={18} />
                        </a>
                        
                        <button
                          onClick={() => handleShare(image.imageUrl)}
                          className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
                          title="Share"
                        >
                          <LuShare size={18} />
                        </button>
                      </div>
                      
                      {confirmDelete === image.id ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleDelete(image.id)}
                            className="p-1 rounded bg-red-50 text-red-600 text-xs"
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => setConfirmDelete(null)}
                            className="p-1 rounded bg-gray-50 text-gray-600 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(image.id)}
                          className="p-2 rounded-md hover:bg-red-50 text-red-500"
                          title="Delete"
                        >
                          <LuTrash size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
                <LuImagePlus className="text-gray-400 text-3xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Images Found</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven&apos;t generated any images yet. Start creating stunning visuals with our AI-powered image generator.
              </p>
              <Link
                href="/generate"
                className="gradient-bg text-white px-6 py-3 rounded-lg font-medium inline-flex items-center"
              >
                <LuImagePlus className="mr-2" /> Create Your First Image
              </Link>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UserImagesPage;
