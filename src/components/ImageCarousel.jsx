import React, { useState, useEffect, useRef } from 'react';

const ImageCarousel = ({ images, alt, className = '', autoPlay = true, compact = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Auto-scroll from RIGHT TO LEFT (RTL)
  // Images enter from the right side and exit to the left
  useEffect(() => {
    if (images.length <= 1) return;

    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        // Move to next image (slides from right to left)
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    }, 3000); // Change every 3 seconds

    return () => clearInterval(intervalRef.current);
  }, [images.length, isPaused]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-800 flex items-center justify-center ${className}`}>
        <span className="text-gray-500">No image</span>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden group ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* RTL Auto-scroll indicator - hidden in compact mode */}
      {images.length > 1 && !isPaused && !compact && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 text-white/60 text-xs bg-black/30 px-2 py-1 rounded">
          <span className="animate-pulse">◄ scrolling</span>
        </div>
      )}

      {/* Images container - slides RIGHT TO LEFT */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div 
            key={index} 
            className="min-w-full h-full flex-shrink-0"
          >
            <img
              src={image}
              alt={`${alt} - ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/Assets/images/placeholder.jpg';
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows - RTL: Right arrow goes to previous, Left arrow goes to next */}
      {images.length > 1 && !compact && (
        <>
          {/* Left arrow = Next (RTL direction) */}
          <button
            onClick={goToNext}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {/* Right arrow = Previous (RTL direction) */}
          <button
            onClick={goToPrevious}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
