import React, { useState, useEffect } from 'react';
import TourCard from '../components/TourCard';
import { fetchTours } from '../services/api';
import { motion } from 'framer-motion';

const Tours = () => {
  const [priceFilter, setPriceFilter] = useState('All');
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetchTours().then(data => setTours(data)).catch(console.error);
  }, []);

  const filteredTours = tours.filter(tour => {
    if (priceFilter === 'Under $1000') return tour.price < 1000;
    if (priceFilter === 'Over $1000') return tour.price >= 1000;
    return true;
  });

  return (
    <div className="pt-24 pb-16 bg-earth-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-earth-800 pb-8 flex flex-col md:flex-row md:justify-between md:items-end">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Curated Experiences
            </motion.h1>
            <p className="text-gray-400 max-w-xl text-lg">
              Find the perfect tour for your next adventure.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0">
            <select 
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="bg-earth-800 text-white border border-earth-700 px-4 py-2 rounded-lg focus:outline-none focus:border-africa-orange"
            >
              <option value="All">All Prices</option>
              <option value="Under $1000">Under $1000</option>
              <option value="Over $1000">$1000 & Above</option>
            </select>
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredTours.map(tour => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={tour.id}
            >
              <TourCard tour={tour} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Tours;
