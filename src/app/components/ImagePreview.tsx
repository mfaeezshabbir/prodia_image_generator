import React, { useState } from "react";
import Image from "next/image";
import { BiShareAlt, BiSolidDownload } from "react-icons/bi";
import ImageModal from "./ImageModal";  // Import the new modal component

interface ImagePreviewProps {
    imageUrl: string;
    altText: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, altText }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this image!',
                url: imageUrl,
            }).catch(console.error);
        } else {
            alert('Sharing is not supported in this browser.');
        }
    };

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="relative">
            {/* Image Preview */}
            <div onClick={handleImageClick} className="cursor-pointer">
                <Image
                    src={imageUrl}
                    alt={altText}
                    width={500}
                    height={500}
                    className="object-cover rounded-lg"
                />
            </div>

            {/* Download and Share Buttons */}
            <a href={`${imageUrl}?download=1`} download={`GeneratedImage`} className="mt-2">
                <button className="mt-4 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition" title="Download Image">
                    <BiSolidDownload size={20} />
                </button>
            </a>
            <button
                onClick={handleShare}
                className="mt-4 ml-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition"
                title="Share this image"
            >
                <BiShareAlt size={20} />
            </button>

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
