import React, { useState, useEffect } from 'react';
import { useAppStore } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { addDestination, addTour, fetchDestinations, fetchTours, deleteDestination, updateDestination, deleteTour, updateTour } from '../services/api';
import ImageUpload from '../components/ImageUpload';

const Dashboard = () => {
  const cart = useAppStore(state => state.cart);
  const removeFromCart = useAppStore(state => state.removeFromCart);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('bookings');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  // Data states
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Edit modal states
  const [editingDestination, setEditingDestination] = useState(null);
  const [editingTour, setEditingTour] = useState(null);
  
  // Load data when management tabs are active
  useEffect(() => {
    if (activeTab === 'manage_dest' || activeTab === 'manage_tours') {
      loadData();
    }
  }, [activeTab]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const [destData, toursData] = await Promise.all([fetchDestinations(), fetchTours()]);
      setDestinations(destData);
      setTours(toursData);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
    setLoading(false);
  };
  
  // Delete handlers
  const handleDeleteDestination = async (id) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;
    try {
      await deleteDestination(id);
    } catch (err) {
      // If 404, item already deleted - that's fine
      if (err.message && !err.message.includes('404')) {
        alert('Failed to delete destination: ' + err.message);
        return;
      }
    }
    // Always refresh from server to sync state
    await loadData();
  };
  
  const handleDeleteTour = async (id) => {
    if (!confirm('Are you sure you want to delete this curated experience?')) return;
    try {
      await deleteTour(id);
    } catch (err) {
      // If 404, item already deleted - that's fine
      if (err.message && !err.message.includes('404')) {
        alert('Failed to delete tour: ' + err.message);
        return;
      }
    }
    // Always refresh from server to sync state
    await loadData();
  };
  
  // Destination Form State
  const [destName, setDestName] = useState('');
  const [destCountry, setDestCountry] = useState('');
  const [destRegion, setDestRegion] = useState('East Africa');
  const [destImage, setDestImage] = useState('');
  const [destBudget, setDestBudget] = useState('$$');
  const [destType, setDestType] = useState('Safari');
  const [destDesc, setDestDesc] = useState('');
  const [destStatus, setDestStatus] = useState('');
  const [destImages, setDestImages] = useState([]); // For multiple images

  // Tour Form State
  const [tourTitle, setTourTitle] = useState('');
  const [tourDuration, setTourDuration] = useState('');
  const [tourPrice, setTourPrice] = useState('');
  const [tourImage, setTourImage] = useState('');
  const [tourStatus, setTourStatus] = useState('');
  const [tourImages, setTourImages] = useState([]); // For multiple images carousel

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleAddDestination = async (e) => {
      e.preventDefault();
      try {
          // Use first uploaded image as main image, rest as additional images
          const mainImage = destImages.length > 0 ? destImages[0] : destImage;
          const additionalImages = destImages.length > 1 ? destImages.slice(1) : [];
          
          await addDestination({
              name: destName, country: destCountry, region: destRegion,
              image: mainImage, images: additionalImages, budget: destBudget, type: destType, description: destDesc
          });
          setDestStatus('Success! Destination saved.');
          setDestName(''); setDestCountry(''); setDestImage(''); setDestDesc(''); setDestImages([]);
          setTimeout(() => setDestStatus(''), 3000);
      } catch (err) { 
          console.error(err);
          setDestStatus('Error saving to DB: ' + err.message);
      }
  };

  const handleAddTour = async (e) => {
      e.preventDefault();
      try {
          // Use uploaded images if available, otherwise fallback to URL
          // First image is main image, rest are for carousel
          const mainImage = tourImages.length > 0 ? tourImages[0] : tourImage;
          const additionalImages = tourImages.length > 1 ? tourImages.slice(1) : [];
          
          await addTour({
              title: tourTitle, duration: parseInt(tourDuration), price: parseFloat(tourPrice),
              image: mainImage, images: additionalImages, destinationId: 1
          });
          setTourStatus('Success! Tour saved.');
          setTourTitle(''); setTourDuration(''); setTourPrice(''); setTourImage(''); setTourImages([]);
          setTimeout(() => setTourStatus(''), 3000);
      } catch (err) { 
          console.error(err);
          setTourStatus('Error saving to DB: ' + err.message);
      }
  };

  return (
    <div className="pt-24 pb-16 bg-earth-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">AfriView Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">{user?.email}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-earth-700 hover:bg-earth-600 text-white rounded-lg text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
            <button onClick={() => setActiveTab('bookings')} className={`px-6 py-2 rounded-full font-medium transition ${activeTab === 'bookings' ? 'bg-africa-orange text-white' : 'bg-earth-800 text-gray-400'}`}>My Bookings</button>
            <button onClick={() => setActiveTab('manage_dest')} className={`px-6 py-2 rounded-full font-medium transition ${activeTab === 'manage_dest' ? 'bg-africa-green text-white' : 'bg-earth-800 text-gray-400'}`}>Manage Destinations</button>
            <button onClick={() => setActiveTab('manage_tours')} className={`px-6 py-2 rounded-full font-medium transition ${activeTab === 'manage_tours' ? 'bg-africa-green text-white' : 'bg-earth-800 text-gray-400'}`}>Manage Experiences</button>
        </div>

        {activeTab === 'bookings' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="bg-earth-800 rounded-2xl p-6 shadow-xl border border-earth-700">
                <h2 className="text-xl font-semibold text-white mb-6">My Bookings ({cart.length})</h2>
                
                {cart.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 mb-4">No tours or destinations booked yet.</p>
                        <div className="flex gap-4 justify-center">
                            <a href="/tours" className="px-4 py-2 bg-africa-green hover:bg-emerald-700 text-white rounded-lg transition">
                                Browse Tours
                            </a>
                            <a href="/destinations" className="px-4 py-2 bg-africa-orange hover:bg-orange-600 text-white rounded-lg transition">
                                Explore Destinations
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                    {cart.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex flex-col sm:flex-row items-center justify-between border border-earth-700 p-4 rounded-xl bg-earth-900/50">
                        <div className="flex items-center space-x-4 mb-4 sm:mb-0 w-full md:w-auto">
                            <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                            <div>
                            <h3 className="text-white font-medium">{item.title}</h3>
                            <p className="text-sm text-gray-400">{item.duration} Days • {item.destination || 'Tour Package'}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-africa-green/20 text-africa-green text-xs rounded-full">
                                Pending Confirmation
                            </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="text-right">
                                <span className="text-africa-green font-bold block">${item.price}</span>
                                <span className="text-xs text-gray-500">per person</span>
                            </div>
                            <button 
                            onClick={() => removeFromCart(item.id)}
                            className="ml-4 px-3 py-1.5 bg-africa-red/20 hover:bg-africa-red/30 text-africa-red text-sm font-medium rounded-lg transition"
                            >
                            Remove
                            </button>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-earth-800 rounded-2xl p-6 shadow-xl border border-earth-700 sticky top-28">
                <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>${total}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                    <span>Taxes & Fees</span>
                    <span>${(total * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-earth-700 pt-3 flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span className="text-africa-green">${(total * 1.1).toFixed(2)}</span>
                    </div>
                </div>

                <button 
                    disabled={cart.length === 0}
                    className={`w-full py-3 rounded-xl font-bold transition duration-300 ${cart.length === 0 ? 'bg-earth-700 text-gray-500 cursor-not-allowed' : 'bg-africa-green hover:bg-green-600 text-white shadow-lg shadow-green-900/20'}`}
                >
                    Proceed to Checkout
                </button>
                </div>
            </div>
            </div>
        )}

        {activeTab === 'add_dest' && (
            <div className="bg-earth-800 rounded-2xl p-6 shadow-xl border border-earth-700 max-w-3xl mx-auto">
                <button 
                    onClick={() => setActiveTab('manage_dest')}
                    className="mb-4 text-gray-400 hover:text-white flex items-center gap-1 text-sm"
                >
                    ← Back to Manage Destinations
                </button>
                <h2 className="text-2xl font-bold text-white mb-2">Publish African Destination</h2>
                <p className="text-gray-400 mb-6">Add a new destination directly to the SQLite database.</p>
                {destStatus && <div className="mb-4 p-3 rounded bg-green-900/30 text-green-400 border border-green-500/50">{destStatus}</div>}
                
                <form onSubmit={handleAddDestination} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Destination Name</label>
                            <input required value={destName} onChange={e => setDestName(e.target.value)} type="text" className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none" placeholder="e.g. Serengeti" />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Country</label>
                            <input required value={destCountry} onChange={e => setDestCountry(e.target.value)} type="text" className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none" placeholder="e.g. Tanzania" />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Region</label>
                            <select value={destRegion} onChange={e => setDestRegion(e.target.value)} className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none">
                                <option>East Africa</option>
                                <option>West Africa</option>
                                <option>North Africa</option>
                                <option>Southern Africa</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Type</label>
                            <select value={destType} onChange={e => setDestType(e.target.value)} className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none">
                                <option>Safari</option>
                                <option>Adventure</option>
                                <option>Beach Holiday</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Upload Images (First will be main image)</label>
                        <ImageUpload 
                            onImagesUploaded={setDestImages} 
                            multiple={true}
                        />
                        {destImages.length > 0 && (
                            <p className="text-green-400 text-sm mt-2">{destImages.length} image(s) uploaded</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">Or enter URL manually:</p>
                        <input value={destImage} onChange={e => setDestImage(e.target.value)} type="text" className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none mt-1" placeholder="https://..." />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Description</label>
                        <textarea required value={destDesc} onChange={e => setDestDesc(e.target.value)} rows="3" className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none" placeholder="Discover the magic of Africa..."></textarea>
                    </div>
                    <button type="submit" className="w-full bg-africa-green hover:bg-green-600 text-white font-bold py-3 rounded-xl transition duration-300">
                        Save Destination to DB
                    </button>
                </form>
            </div>
        )}

        {activeTab === 'add_tour' && (
            <div className="bg-earth-800 rounded-2xl p-6 shadow-xl border border-earth-700 max-w-3xl mx-auto">
                <button 
                    onClick={() => setActiveTab('manage_tours')}
                    className="mb-4 text-gray-400 hover:text-white flex items-center gap-1 text-sm"
                >
                    ← Back to Manage Experiences
                </button>
                <h2 className="text-2xl font-bold text-white mb-2">Publish Curated Experience (Tour)</h2>
                <p className="text-gray-400 mb-6">Save a brand-new tour or package to the SQLite database.</p>
                {tourStatus && <div className="mb-4 p-3 rounded bg-green-900/30 text-green-400 border border-green-500/50">{tourStatus}</div>}
                
                <form onSubmit={handleAddTour} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Tour Title / Package Name</label>
                        <input required value={tourTitle} onChange={e => setTourTitle(e.target.value)} type="text" className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none" placeholder="e.g. 7-Day Great Migration" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Duration (Days)</label>
                            <input required value={tourDuration} onChange={e => setTourDuration(e.target.value)} type="number" className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none" placeholder="e.g. 7" />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Price ($)</label>
                            <input required value={tourPrice} onChange={e => setTourPrice(e.target.value)} type="number" className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none" placeholder="e.g. 1500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Upload Images (First will be main image, others for carousel)</label>
                        <ImageUpload 
                            onImagesUploaded={setTourImages} 
                            multiple={true}
                        />
                        {tourImages.length > 0 && (
                            <p className="text-green-400 text-sm mt-2">{tourImages.length} image(s) uploaded</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">Or enter single URL manually:</p>
                        <input value={tourImage} onChange={e => setTourImage(e.target.value)} type="text" className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none mt-1" placeholder="https://..." />
                    </div>
                    <button type="submit" className="w-full bg-africa-green hover:bg-green-600 text-white font-bold py-3 rounded-xl transition duration-300">
                        Save Tour to DB
                    </button>
                </form>
            </div>
        )}

        {activeTab === 'manage_dest' && (
            <div className="bg-earth-800 rounded-2xl p-6 shadow-xl border border-earth-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Manage African Destinations</h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setActiveTab('add_dest')}
                            className="flex items-center gap-2 px-4 py-2 bg-africa-green hover:bg-green-600 text-white rounded-lg font-medium transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Destination
                        </button>
                        <button 
                            onClick={loadData}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-earth-700 hover:bg-earth-600 text-white rounded-lg font-medium transition disabled:opacity-50"
                        >
                            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>
                </div>
                {loading ? (
                    <p className="text-gray-400 text-center py-8">Loading...</p>
                ) : destinations.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No destinations found.</p>
                ) : (
                    <div className="space-y-4">
                        {destinations.map((dest) => (
                            <div key={dest.id} className="flex items-center gap-4 bg-earth-900 rounded-xl p-4 border border-earth-700">
                                <img src={dest.image || (dest.images && dest.images[0])} alt={dest.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                                <div className="flex-grow min-w-0">
                                    <h3 className="text-white font-semibold truncate">{dest.name}</h3>
                                    <p className="text-gray-400 text-sm">{dest.country} • {dest.region}</p>
                                    <p className="text-africa-orange text-sm">{dest.type}</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button 
                                        onClick={() => setEditingDestination(dest)}
                                        className="px-4 py-2 bg-africa-green hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteDestination(dest.id)}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {activeTab === 'manage_tours' && (
            <div className="bg-earth-800 rounded-2xl p-6 shadow-xl border border-earth-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Manage Curated Experiences</h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setActiveTab('add_tour')}
                            className="flex items-center gap-2 px-4 py-2 bg-africa-green hover:bg-green-600 text-white rounded-lg font-medium transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Curated Experience
                        </button>
                        <button 
                            onClick={loadData}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-earth-700 hover:bg-earth-600 text-white rounded-lg font-medium transition disabled:opacity-50"
                        >
                            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>
                </div>
                {loading ? (
                    <p className="text-gray-400 text-center py-8">Loading...</p>
                ) : tours.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No curated experiences found.</p>
                ) : (
                    <div className="space-y-4">
                        {tours.map((tour) => (
                            <div key={tour.id} className="flex items-center gap-4 bg-earth-900 rounded-xl p-4 border border-earth-700">
                                <img src={tour.image} alt={tour.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                                <div className="flex-grow min-w-0">
                                    <h3 className="text-white font-semibold truncate">{tour.title}</h3>
                                    <p className="text-gray-400 text-sm">{tour.duration} Days • ${tour.price}</p>
                                    <p className="text-africa-yellow text-sm">★ {tour.rating}</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button 
                                        onClick={() => setEditingTour(tour)}
                                        className="px-4 py-2 bg-africa-green hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteTour(tour.id)}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
        
        {/* Edit Destination Modal */}
        {editingDestination && (
            <EditDestinationModal 
                destination={editingDestination} 
                onClose={() => setEditingDestination(null)}
                onSave={(updated) => {
                    setDestinations(destinations.map(d => d.id === updated.id ? updated : d));
                    setEditingDestination(null);
                }}
            />
        )}
        
        {/* Edit Tour Modal */}
        {editingTour && (
            <EditTourModal 
                tour={editingTour} 
                onClose={() => setEditingTour(null)}
                onSave={(updated) => {
                    setTours(tours.map(t => t.id === updated.id ? updated : t));
                    setEditingTour(null);
                }}
            />
        )}
      </div>
    </div>
  );
};

// Edit Destination Modal Component
const EditDestinationModal = ({ destination, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...destination });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDestination(destination.id, formData);
      onSave(formData);
    } catch (err) {
      alert('Failed to update destination');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-earth-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-earth-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Destination</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Country</label>
              <input
                type="text"
                value={formData.country || ''}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Region</label>
              <select
                value={formData.region || 'East Africa'}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
              >
                <option>East Africa</option>
                <option>West Africa</option>
                <option>North Africa</option>
                <option>Southern Africa</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Type</label>
              <select
                value={formData.type || 'Safari'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
              >
                <option>Safari</option>
                <option>Adventure</option>
                <option>Beach Holiday</option>
                <option>Cultural</option>
              </select>
            </div>
          </div>
          {/* Image Management */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Images</label>
            
            {/* Current Images with Delete */}
            <div className="flex gap-2 flex-wrap mb-4">
              {formData.image && (
                <div className="relative w-20 h-20 group">
                  <img 
                    src={formData.image} 
                    alt="Main" 
                    className="w-full h-full object-cover rounded-lg border-2 border-africa-green"
                  />
                  <span className="absolute -top-1 -left-1 bg-africa-green text-white text-xs px-1 rounded">Main</span>
                  <button
                    type="button"
                    onClick={() => {
                      const remaining = formData.images || [];
                      if (remaining.length > 0) {
                        setFormData({ ...formData, image: remaining[0], images: remaining.slice(1) });
                      } else {
                        setFormData({ ...formData, image: '' });
                      }
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {formData.images?.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 group">
                  <img 
                    src={img} 
                    alt={`Extra ${idx + 1}`} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== idx);
                      setFormData({ ...formData, images: newImages });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            {/* Add New Images */}
            <label className="block text-gray-500 text-xs mb-1">Add new images:</label>
            <ImageUpload 
              onImagesUploaded={(newImages) => {
                if (!Array.isArray(newImages)) newImages = [newImages];
                const currentImages = formData.images || [];
                setFormData({ ...formData, images: [...currentImages, ...newImages] });
              }} 
              multiple={true}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-earth-700 hover:bg-earth-600 text-white rounded-xl font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-africa-green hover:bg-emerald-700 text-white rounded-xl font-medium transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Tour Modal Component
const EditTourModal = ({ tour, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...tour });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateTour(tour.id, formData);
      onSave(formData);
    } catch (err) {
      alert('Failed to update tour');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-earth-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-earth-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Curated Experience</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Tour Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Duration (Days)</label>
              <input
                type="number"
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Price ($)</label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating || 5}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
              />
            </div>
          </div>
          {/* Image Management */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Images</label>
            
            {/* Current Images with Delete */}
            <div className="flex gap-2 flex-wrap mb-4">
              {formData.image && (
                <div className="relative w-20 h-20 group">
                  <img 
                    src={formData.image} 
                    alt="Main" 
                    className="w-full h-full object-cover rounded-lg border-2 border-africa-green"
                  />
                  <span className="absolute -top-1 -left-1 bg-africa-green text-white text-xs px-1 rounded">Main</span>
                  <button
                    type="button"
                    onClick={() => {
                      const remaining = formData.images || [];
                      if (remaining.length > 0) {
                        setFormData({ ...formData, image: remaining[0], images: remaining.slice(1) });
                      } else {
                        setFormData({ ...formData, image: '' });
                      }
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {formData.images?.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 group">
                  <img 
                    src={img} 
                    alt={`Extra ${idx + 1}`} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== idx);
                      setFormData({ ...formData, images: newImages });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            {/* Add New Images */}
            <label className="block text-gray-500 text-xs mb-1">Add new images:</label>
            <ImageUpload 
              onImagesUploaded={(newImages) => {
                if (!Array.isArray(newImages)) newImages = [newImages];
                const currentImages = formData.images || [];
                setFormData({ ...formData, images: [...currentImages, ...newImages] });
              }} 
              multiple={true}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-earth-700 hover:bg-earth-600 text-white rounded-xl font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-africa-green hover:bg-emerald-700 text-white rounded-xl font-medium transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
