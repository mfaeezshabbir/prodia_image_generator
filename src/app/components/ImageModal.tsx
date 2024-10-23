import React from 'react';
import Image from 'next/image';
import { AiOutlineClose } from 'react-icons/ai';
import { FiDownload, FiShare2 } from 'react-icons/fi';

interface ImageModalProps {
    isOpen: boolean;
    imageUrl: string;
    altText: string;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, altText, onClose }) => {
    if (!isOpen) return null;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this image',
                text: altText,
                url: imageUrl,
            }).catch(console.error);
        } else {
            alert('Sharing is not supported in this browser.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="relative w-full h-full">
                <button
                    className="absolute top-4 right-4 text-white text-3xl"
                    onClick={onClose}
                    title="Close"
                >
                    <AiOutlineClose />
                </button>
                <div className="flex justify-center align-center h-full">
                    <Image
                        src={imageUrl}
                        alt={altText}
                        width={900}
                        height={900}
                        className="object-contain rounded-lg"
                    />
                </div>
                <div className="absolute bottom-4 left-4 flex space-x-4">
                    <a href={`${imageUrl}?download=1`} download={`GeneratedImage`} className="mt-2">
                        <button
                            className="text-white text-2xl"
                            title="Download"
                        >
                            <FiDownload />
                        </button>
                    </a>
                    <button
                        className="text-white text-2xl"
                        onClick={handleShare}
                        title="Share"
                    >
                        <FiShare2 />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageModal;