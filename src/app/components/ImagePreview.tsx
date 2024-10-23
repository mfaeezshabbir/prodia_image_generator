// ImagePreview.tsx
import React from "react";
import Image from "next/image";

interface ImagePreviewProps {
    imageUrl: string;
    altText: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, altText }) => {
    return (
        <div className="relative">
            <Image
                src={imageUrl}
                alt={altText}
                width={500}
                height={500}
                className="object-cover rounded-lg"
            />
            <a href={`${imageUrl}?download=1`} download={`GeneratedImage`} className="mt-2">
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Download Image
                </button>
            </a>
        </div>
    );
};

export default ImagePreview;
