import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [type, setType] = useState('safari');

  const handleExplore = () => {
    const params = new URLSearchParams();
    if (destination.trim()) {
      params.append('search', destination.trim());
    }
    if (type) {
      params.append('type', type);
    }
    navigate(`/destinations?${params.toString()}`);
  };
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/Assets/images/kenya.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900 via-earth-900/60 to-earth-900/30" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center pt-20">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
        >
          Discover The Heart Of <span className="text-africa-orange">Africa</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-2xl text-gray-300 max-w-3xl mb-12"
        >
          Experience untamed wilderness, vibrant cultures, and unforgettable adventures perfectly tailored for you.
        </motion.p>

        {/* Search Bar Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-earth-800/80 backdrop-blur-md p-4 rounded-3xl md:rounded-full shadow-2xl border border-earth-700/50 w-full max-w-4xl"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full px-4 border-b md:border-b-0 md:border-r border-earth-700/50 pb-4 md:pb-0">
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Destination</label>
              <input 
                type="text" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where to?" 
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500 font-medium" 
              />
            </div>
            <div className="flex-1 w-full px-4 border-b md:border-b-0 md:border-r border-earth-700/50 pb-4 md:pb-0">
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500 font-medium appearance-none"
              >
                <option value="safari" className="bg-earth-800">Safari</option>
                <option value="mountain" className="bg-earth-800">Mountain Climbing</option>
                <option value="beach" className="bg-earth-800">Beach Holiday</option>
              </select>
            </div>
            <div className="px-4 w-full md:w-auto">
              <button 
                onClick={handleExplore}
                className="w-full bg-africa-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg shadow-orange-900/30"
              >
                Explore Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
