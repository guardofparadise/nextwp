'use client';

import { useEffect, useState, useCallback } from 'react';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export default function GutenbergGallery() {
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Find all gallery images and add click handlers
    const setupGalleries = () => {
      const galleries = document.querySelectorAll('.wp-block-gallery');
      const allImages: GalleryImage[] = [];
      
      galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('img');
        
        images.forEach((img, index) => {
          const imageData: GalleryImage = {
            src: img.src || img.getAttribute('data-src') || '',
            alt: img.alt || '',
            caption: img.parentElement?.querySelector('figcaption')?.textContent || ''
          };
          
          allImages.push(imageData);
          
          // Add click handler to open lightbox
          img.style.cursor = 'pointer';
          (img as HTMLImageElement).onclick = (e) => {
            e.preventDefault();
            setGalleryImages(allImages);
            setCurrentIndex(index);
            setLightboxImage(imageData);
          };
        });
      });

      // Also handle single images with links
      const linkedImages = document.querySelectorAll('.wp-block-image a');
      linkedImages.forEach(link => {
        const img = link.querySelector('img');
        if (img && link.getAttribute('href')?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          (link as HTMLAnchorElement).onclick = (e) => {
            e.preventDefault();
            const imageData: GalleryImage = {
              src: link.getAttribute('href') || img.src,
              alt: img.alt || '',
              caption: img.parentElement?.querySelector('figcaption')?.textContent || ''
            };
            setGalleryImages([imageData]);
            setCurrentIndex(0);
            setLightboxImage(imageData);
          };
        }
      });
    };

    // Setup galleries on mount and when content changes
    setupGalleries();
    
    // Use MutationObserver to detect content changes
    const observer = new MutationObserver(() => {
      setupGalleries();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxImage(null);
    setGalleryImages([]);
  }, []);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setLightboxImage(galleryImages[currentIndex - 1]);
    }
  }, [currentIndex, galleryImages]);

  const goToNext = useCallback(() => {
    if (currentIndex < galleryImages.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setLightboxImage(galleryImages[currentIndex + 1]);
    }
  }, [currentIndex, galleryImages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxImage) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, closeLightbox, goToPrevious, goToNext]);

  if (!lightboxImage) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      onClick={closeLightbox}
    >
      <button
        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-50"
        onClick={closeLightbox}
        aria-label="Close"
      >
        ×
      </button>

      {galleryImages.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            disabled={currentIndex === 0}
            aria-label="Previous image"
          >
            ‹
          </button>
          
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            disabled={currentIndex === galleryImages.length - 1}
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}

      <div 
        className="relative max-w-7xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          className="max-w-full max-h-[80vh] object-contain"
        />
        
        {lightboxImage.caption && (
          <p className="text-white text-center mt-4 px-4">
            {lightboxImage.caption}
          </p>
        )}
        
        {galleryImages.length > 1 && (
          <div className="text-white text-sm mt-2">
            {currentIndex + 1} / {galleryImages.length}
          </div>
        )}
      </div>
    </div>
  );
}