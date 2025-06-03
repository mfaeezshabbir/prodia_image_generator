import React from "react";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { FiDownload, FiShare2 } from "react-icons/fi";

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  altText: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  imageUrl,
  altText,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this image",
          text: altText,
          url: imageUrl,
        })
        .catch(console.error);
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center z-50">
      <div className="relative w-full h-full max-w-5xl max-h-[90vh] mx-auto my-auto p-6">
        <div className="flex justify-center items-center h-full">
          <Image
            src={imageUrl}
            alt={altText}
            width={1200}
            height={1200}
            className="object-contain rounded-lg shadow-2xl max-h-[80vh]"
          />
        </div>
        <div className="absolute top-6 right-6 flex space-x-3">
          <a
            href={`${imageUrl}?download=1`}
            download={`GeneratedImage`}
            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
            title="Download Image"
          >
            <FiDownload size={20} />
          </a>
          <button
            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
            onClick={handleShare}
            title="Share Image"
          >
            <FiShare2 />
          </button>{" "}
          <button
            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
            onClick={onClose}
            title="Close"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
