import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../context/AppContext';
import ImageCarousel from './ImageCarousel';

const DestinationCard = ({ destination }) => {
  const navigate = useNavigate();
  const addToCart = useAppStore(state => state.addToCart);
  const cart = useAppStore(state => state.cart);
  const [showToast, setShowToast] = useState(false);

  // Combine main image with additional images for full carousel
  const allImages = destination.images && destination.images.length > 0
    ? [destination.image, ...destination.images]
    : [destination.image];

  const handleBookNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Create booking item from destination
    const bookingItem = {
      id: `dest-${destination.id}`,
      title: destination.name,
      image: destination.image,
      duration: 3,
      price: destination.price || 499,
      rating: destination.rating,
      description: destination.description,
      destination: destination.country
    };
    
    // Check if user is logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        // User is logged in, go to booking form
        navigate('/booking', { state: { item: bookingItem } });
      } else {
        // User is not logged in, redirect to login
        navigate('/login', { state: { bookingItem, from: { pathname: '/booking' } } });
      }
    });
  };

  const isBooked = cart.some(item => item.id === `dest-${destination.id}`);

  return (
    <div className="group relative">
      <Link to={`/destinations/${destination.id}`} className="block">
        <div className="relative h-80 w-full overflow-hidden rounded-2xl">
          <ImageCarousel
            images={allImages}
            alt={destination.name}
            className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-700"
            compact={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-africa-orange text-sm font-bold uppercase tracking-wider mb-1">{destination.country}</p>
                <h3 className="text-xl font-bold text-white">{destination.name}</h3>
              </div>
              <div className="bg-earth-900/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium border border-white/10">
                {destination.type}
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4 bg-earth-900/80 px-3 py-1 rounded-full text-sm font-semibold text-africa-yellow backdrop-blur-sm z-10">
            ★ {destination.rating}
          </div>
        </div>
      </Link>
      
      {/* Book Now Button */}
      <button
        onClick={handleBookNow}
        disabled={isBooked}
        className={`absolute bottom-4 right-4 z-20 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
          isBooked 
            ? 'bg-africa-green text-white cursor-default' 
            : 'bg-africa-orange hover:bg-orange-600 text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
        }`}
      >
        {isBooked ? '✓ Booked' : 'Book Now'}
      </button>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-africa-green text-white px-4 py-2 rounded-lg text-sm font-medium z-30 shadow-lg"
          >
            Added to bookings!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DestinationCard;
