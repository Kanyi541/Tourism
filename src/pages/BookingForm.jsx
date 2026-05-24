import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../services/api';

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    num_travelers: 1,
    travel_date: '',
    special_requests: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!item) {
    return (
      <div className="min-h-screen bg-earth-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Item Selected</h2>
          <p className="text-gray-400 mb-6">Please select a tour or destination to book.</p>
          <button 
            onClick={() => navigate('/tours')}
            className="px-6 py-3 bg-africa-green hover:bg-emerald-700 text-white rounded-lg font-medium transition"
          >
            Browse Tours
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bookingData = {
      item_id: String(item.id),
      item_type: item.duration ? 'tour' : 'destination',
      item_title: item.title || item.name,
      item_image: item.image,
      ...formData,
      total_price: (item.price || 499) * formData.num_travelers
    };

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        alert('Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-earth-900 text-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-earth-800 p-8 rounded-2xl border border-africa-green"
        >
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2 text-africa-green">Booking Confirmed!</h2>
          <p className="text-gray-400">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-400 hover:text-white flex items-center gap-1"
        >
          ← Back
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Item Summary */}
          <div className="bg-earth-800 rounded-2xl p-6 border border-earth-700 h-fit">
            <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
            <img 
              src={item.image} 
              alt={item.title || item.name} 
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h3 className="text-lg font-semibold">{item.title || item.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{item.destination || item.country}</p>
            
            <div className="border-t border-earth-700 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Price per person</span>
                <span className="font-medium">${item.price || 499}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Travelers</span>
                <span className="font-medium">{formData.num_travelers}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-africa-green">
                <span>Total</span>
                <span>${(item.price || 499) * formData.num_travelers}</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-earth-800 rounded-2xl p-6 border border-earth-700">
            <h2 className="text-xl font-bold mb-6">Enter Your Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
                  placeholder="+254 700 000 000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Number of Travelers *</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.num_travelers}
                    onChange={(e) => setFormData({...formData, num_travelers: parseInt(e.target.value) || 1})}
                    className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Travel Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.travel_date}
                    onChange={(e) => setFormData({...formData, travel_date: e.target.value})}
                    className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Special Requests</label>
                <textarea
                  rows="3"
                  value={formData.special_requests}
                  onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                  className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
                  placeholder="Any dietary requirements, accessibility needs, or other requests..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-africa-green hover:bg-emerald-700 text-white rounded-xl font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BookingForm;

