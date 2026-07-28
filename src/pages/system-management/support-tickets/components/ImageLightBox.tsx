// components/ImageLightbox.tsx
import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Download,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
}) => {
  const [index, setIndex] = useState(currentIndex);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          goToPrev();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, index]);

  const goToNext = () => {
    const newIndex = (index + 1) % images.length;
    setIndex(newIndex);
    setZoom(1);
    onIndexChange?.(newIndex);
  };

  const goToPrev = () => {
    const newIndex = (index - 1 + images.length) % images.length;
    setIndex(newIndex);
    setZoom(1);
    onIndexChange?.(newIndex);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Top Actions */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <a
          href={images[index]}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Open Original
        </a>
        <a
          href={images[index]}
          download
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
        >
          <Download className="h-4 w-4" />
          Download
        </a>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/10 rounded-full p-1">
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <span className="text-white text-sm px-2 min-w-[50px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-white/10 rounded-full text-white text-sm">
          {index + 1} / {images.length}
        </div>
      )}

      {/* Main Image */}
      <div className="absolute inset-0 flex items-center justify-center p-16">
        <img
          src={images[index]}
          alt={`Attachment ${index + 1}`}
          className="max-w-full max-h-full object-contain transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 p-2 bg-white/10 rounded-xl max-w-[80vw] overflow-x-auto">
          {images.map((image, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                setZoom(1);
                onIndexChange?.(i);
              }}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                i === index
                  ? "border-white scale-110"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <img
                src={image}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageLightbox;