import React from 'react';
import { RiFacebookFill, RiInstagramFill, RiTwitterFill, RiLinkedinFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-earth-900 border-t border-earth-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-3xl font-bold tracking-widest text-africa-orange mb-6 block">
              AfriView
            </Link>
            <p className="text-gray-400 mb-6">
              AfriView. Explore the untouched beauty, vibrant culture, and magnificent wildlife of Africa with us.
            </p>
            <div className="flex space-x-4 animate-fade-in-up">
              <a href="#" className="w-10 h-10 rounded-full bg-earth-800 flex items-center justify-center text-white hover:bg-africa-orange transition duration-300">
                <RiFacebookFill />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-earth-800 flex items-center justify-center text-white hover:bg-africa-orange transition duration-300">
                <RiInstagramFill />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-earth-800 flex items-center justify-center text-white hover:bg-africa-orange transition duration-300">
                <RiTwitterFill />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-earth-800 flex items-center justify-center text-white hover:bg-africa-orange transition duration-300">
                <RiLinkedinFill />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link to="/destinations" className="text-gray-400 hover:text-white transition">Destinations</Link></li>
              <li><Link to="/tours" className="text-gray-400 hover:text-white transition">Tours</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Experiences</h4>
            <ul className="space-y-3">
              <li><Link to="/tours" className="text-gray-400 hover:text-white transition">Safari Packages</Link></li>
              <li><Link to="/tours" className="text-gray-400 hover:text-white transition">Mountain Climbing</Link></li>
              <li><Link to="/tours" className="text-gray-400 hover:text-white transition">Beach Holidays</Link></li>
              <li><Link to="/tours" className="text-gray-400 hover:text-white transition">Cultural Tours</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter to get latest updates and offers.</p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-earth-800 border border-earth-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-africa-orange"
              />
              <button className="bg-africa-orange hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition duration-300">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-earth-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AfriView. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
