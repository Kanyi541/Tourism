import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiSearchLine, RiMenu3Line, RiCloseLine, RiShoppingCartLine } from 'react-icons/ri';
import { useAppStore } from '../context/AppContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cart = useAppStore(state => state.cart);
  const cartCount = cart.length;

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-earth-900/90 backdrop-blur-md border-b border-earth-700/50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
                <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                <span className="text-2xl font-bold tracking-widest text-africa-orange">AfriView</span>
              </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-africa-orange transition duration-300 font-medium">Home</Link>
            <Link to="/destinations" className="hover:text-africa-orange transition duration-300 font-medium">Destinations</Link>
            <Link to="/tours" className="hover:text-africa-orange transition duration-300 font-medium">Tours</Link>
            <button className="p-2 rounded-full hover:bg-earth-700 transition">
              <RiSearchLine className="text-xl" />
            </button>
            <Link to="/dashboard" className="p-2 rounded-full hover:bg-earth-700 transition relative">
              <RiShoppingCartLine className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-africa-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <Link to="/dashboard" className="p-2 rounded-full hover:bg-earth-700 transition relative">
              <RiShoppingCartLine className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-africa-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
              {isOpen ? <RiCloseLine /> : <RiMenu3Line />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-earth-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-earth-700">Home</Link>
            <Link to="/destinations" className="block px-3 py-2 rounded-md hover:bg-earth-700">Destinations</Link>
            <Link to="/tours" className="block px-3 py-2 rounded-md hover:bg-earth-700">Tours</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
