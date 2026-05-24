import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import DestinationCard from '../components/DestinationCard';
import TourCard from '../components/TourCard';
import { fetchDestinations, fetchTours } from '../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetchDestinations().then(data => setDestinations(data)).catch(console.error);
    fetchTours().then(data => setTours(data)).catch(console.error);
  }, []);

  return (
    <div className="bg-earth-900 min-h-screen">
      <Hero />
      
      {/* Trending Destinations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-sm font-bold text-africa-orange uppercase tracking-widest mb-2">Explore Africa</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white">Trending Destinations</h3>
          </div>
          <Link to="/destinations" className="hidden md:block text-africa-yellow hover:text-white transition group flex items-center">
            View All <span className="ml-2 group-hover:translate-x-1 transition duration-300">→</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.slice(0, 3).map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-earth-800">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-africa-green uppercase tracking-widest mb-2">Top Experiences</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">Unforgettable Tours</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">Hand-picked adventures designed to give you the ultimate African experience with expert local guides.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.slice(0, 3).map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/tours" className="inline-block border border-white hover:bg-white hover:text-earth-900 text-white font-semibold py-3 px-8 rounded-full transition duration-300">
            View All Tours
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
