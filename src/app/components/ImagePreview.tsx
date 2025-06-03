import React, { useEffect } from "react";
import Image from "next/image";
import { BiShareAlt, BiSolidDownload } from "react-icons/bi";
import ImageModal from "./ImageModal";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { useAuth } from "../contexts/AuthContext";

interface ImagePreviewProps {
  imageUrl: string;
  altText: string;
  prompt: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  altText,
  prompt,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this image!",
          url: imageUrl,
        })
        .catch(console.error);
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const { currentUser } = useAuth();
  
  const saveToFirestore = async () => {
    try {
      // Generate a unique ID using timestamp + random string instead of just using prompt
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const imageDocRef = doc(db, "generatedImages", uniqueId);
      await setDoc(imageDocRef, {
        imageUrl,
        prompt,
        timestamp: new Date().toISOString(),
        userId: currentUser?.uid || 'anonymous',
      });
      console.log("Image saved successfully");
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  useEffect(() => {
    saveToFirestore();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, prompt]);

  return (
    <div className="relative group overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg">
      {/* Image Preview */}
      <div onClick={handleImageClick} className="cursor-pointer">
        <Image
          src={imageUrl}
          alt={altText}
          width={500}
          height={500}
          className="object-cover w-full aspect-square rounded-lg transform transition-transform group-hover:scale-[1.02]"
        />
      </div>

      {/* Overlay with buttons */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="flex items-center justify-between">
          <p className="text-white text-sm truncate max-w-[70%]">
            {prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt}
          </p>
          
          <div className="flex gap-2">
            <a
              href={`${imageUrl}?download=1`}
              download={`GeneratedImage`}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              title="Download Image"
            >
              <BiSolidDownload size={18} />
            </a>
            <button
              onClick={handleShare}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              title="Share this image"
            >
              <BiShareAlt size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={imageUrl}
        altText={altText}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ImagePreview;
