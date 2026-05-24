import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import ImageCarousel from "./ImageCarousel";

const TourCard = ({ tour }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    // Check if user is logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        // User is logged in, go to booking form
        navigate('/booking', { state: { item: tour } });
      } else {
        // User is not logged in, redirect to login with booking item info
        navigate('/login', { state: { bookingItem: tour, from: { pathname: '/booking' } } });
      }
    });
  };

  // Combine main image with additional images for carousel
  const carouselImages = tour.images && tour.images.length > 0 
    ? [tour.image, ...tour.images] 
    : [tour.image];

  return (
    <div className="bg-earth-800 rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition duration-300 border border-earth-700/50">
      <div className="relative">
        <ImageCarousel 
          images={carouselImages} 
          alt={tour.title} 
          className="h-56 w-full" 
        />
        <div className="absolute top-4 right-4 bg-earth-900/80 px-3 py-1 rounded-full text-sm font-semibold text-africa-yellow backdrop-blur-sm z-10">
          ★ {tour.rating}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-white text-xl font-bold mb-2">{tour.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{tour.duration} Days Experience</p>
        
        <div className="flex justify-between items-center mt-3 pt-4 border-t border-earth-700/50">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Starting from</span>
            <span className="text-africa-green font-bold text-xl">${tour.price}</span>
          </div>
          <button 
            onClick={handleBookNow}
            className="px-5 py-2.5 bg-africa-green hover:bg-green-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-green-900/20"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
