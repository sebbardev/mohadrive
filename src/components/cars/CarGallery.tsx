"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Star } from "lucide-react";

interface CarGalleryProps {
  car: {
    image: string;
    images: string[];
    name: string;
  };
}

export default function CarGallery({ car }: CarGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Combine main image and additional images
  const allImages = [car.image, ...(car.images || [])].filter(Boolean);

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setSelectedImage(allImages[index]);
  };

  const closeGallery = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % allImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(allImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(allImages[prevIndex]);
  };

  return (
    <>
      {/* Hidden button triggers for gallery */}
      <div className="hidden" id="gallery-triggers">
        {allImages.map((img, idx) => (
          <button
            key={idx}
            data-gallery-index={idx}
            onClick={() => openGallery(idx)}
            className="gallery-trigger"
          />
        ))}
      </div>

      {/* Image Gallery Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center animate-fade-in"
          onClick={closeGallery}
        >
          {/* Close button */}
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-xl p-3 sm:p-4 rounded-full transition-all duration-300 group"
          >
            <X size={24} className="text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 sm:left-8 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-xl p-3 sm:p-4 rounded-full transition-all duration-300 group"
          >
            <ChevronLeft size={28} className="text-white group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 sm:right-8 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-xl p-3 sm:p-4 rounded-full transition-all duration-300 group"
          >
            <ChevronRight size={28} className="text-white group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full">
            <p className="text-white text-sm font-bold">
              {currentImageIndex + 1} / {allImages.length}
            </p>
          </div>

          {/* Main gallery image */}
          <div 
            className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 sm:p-8 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-h-[80vh]">
              <Image
                src={selectedImage}
                alt={car.name}
                fill
                sizes="90vw"
                className="object-contain"
                quality={95}
                priority
              />
            </div>
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div 
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 sm:gap-3 bg-white/10 backdrop-blur-xl p-3 sm:p-4 rounded-2xl overflow-x-auto max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentImageIndex(idx);
                    setSelectedImage(img);
                  }}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    idx === currentImageIndex 
                      ? 'border-white scale-110 shadow-xl' 
                      : 'border-white/30 hover:border-white/60 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${car.name} ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                    quality={75}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expose openGallery function globally */}
      <script dangerouslySetInnerHTML={{
        __html: `
          window.openCarGallery = function(index) {
            document.querySelectorAll('.gallery-trigger')[index]?.click();
          };
        `
      }} />
    </>
  );
}
