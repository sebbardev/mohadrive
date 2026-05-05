"use client";

import { useState, useCallback } from "react";
import ImageLightbox from "./ImageLightbox";

interface CarImageGalleryProps {
  images: string[];
  mainImage: string;
  alt: string;
}

export default function CarImageGallery({ images, mainImage, alt }: CarImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const allImages = [mainImage, ...images];

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  return (
    <>
      {/* Main Image */}
      <div
        className="relative h-[350px] sm:h-[450px] lg:h-[500px] xl:h-[600px] w-full overflow-hidden rounded-[2rem] lg:rounded-[3rem] shadow-2xl border-2 lg:border-4 border-white/50 group hover:shadow-[var(--color-primary)]/20 transition-all duration-700 cursor-pointer"
        onClick={() => openLightbox(0)}
      >
        {/* This will be replaced by the server component's Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/30 via-transparent to-transparent" />
        
        {/* Zoom icon */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg pointer-events-none">
          <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m7.5-7.5h-3m0 0h3" />
          </svg>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 mt-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative h-24 sm:h-28 lg:h-32 bg-white rounded-xl lg:rounded-2xl overflow-hidden border-2 border-white shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
              onClick={() => openLightbox(idx + 1)}
            >
              {/* Thumbnail images will be rendered by server component */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                <svg className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m7.5-7.5h-3m0 0h3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={images}
          mainImage={mainImage}
          alt={alt}
        />
      )}
    </>
  );
}
