import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DestinationCard from '../components/DestinationCard';
import { fetchDestinations } from '../services/api';
import { motion } from 'framer-motion';

const Destinations = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState('All');
  const [destinations, setDestinations] = useState([]);

  const searchQuery = searchParams.get('search') || '';
  const searchType = searchParams.get('type') || '';

  useEffect(() => {
    fetchDestinations().then(data => setDestinations(data)).catch(console.error);
  }, []);

  const filteredDestinations = destinations.filter(d => {
    // Apply region filter
    if (filter !== 'All' && d.region !== filter) return false;
    
    // Apply search query filter
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !d.country.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Apply type filter
    if (searchType && d.type && !d.type.toLowerCase().includes(searchType.toLowerCase())) return false;
    
    return true;
  });

  return (
    <div className="pt-24 pb-16 bg-earth-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-earth-800 pb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            African Destinations
          </motion.h1>
          <p className="text-gray-400 max-w-3xl mb-8 text-lg">
            From the endless plains of the Serengeti to the vibrant streets of Marrakech, discover the magic of Africa.
          </p>

          <div className="flex flex-wrap gap-4">
            {['All', 'East Africa', 'West Africa', 'North Africa', 'Southern Africa'].map((region) => (
              <button
                key={region}
                onClick={() => setFilter(region)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition duration-300 ${
                  filter === region 
                  ? 'bg-africa-orange text-white' 
                  : 'bg-earth-800 text-gray-400 hover:text-white hover:bg-earth-700'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredDestinations.map(dest => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={dest.id}
            >
              <DestinationCard destination={dest} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Destinations;
