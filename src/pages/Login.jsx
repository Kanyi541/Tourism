import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, upsertUser } from '../services/firebase';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Get the redirect path from location state, default to /dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  const bookingItem = location.state?.bookingItem;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If there was a booking item, redirect to booking form
        if (bookingItem) {
          navigate('/booking', { state: { item: bookingItem }, replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    });
    return () => unsubscribe();
  }, [navigate, from, bookingItem]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation handled by useEffect
    } catch (err) {
      setError(getErrorMessage(err.code));
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
        // After successful registration, show success and stop loading
        setSuccess('Account created successfully!');
        setLoading(false);
        // Optionally navigate after a brief delay (handled by AuthContext useEffect)

    } catch (err) {
      setError(getErrorMessage(err.code));
      setLoading(false);
    }
  };



  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed';
      case 'auth/cancelled-popup-request':
        return 'Multiple popups opened. Please try again';
      default:
        return 'An error occurred. Please try again';
    }
  };

  return (
    <div className="min-h-screen bg-earth-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-earth-800 rounded-2xl p-8 shadow-xl border border-earth-700">
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          {bookingItem ? 'Sign in to Book' : 'AfriView Login'}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          {bookingItem 
            ? `Book: ${bookingItem.title || bookingItem.name}` 
            : 'Welcome back! Sign in to continue'}
        </p>
        
        {/* Tabs */}
        <div className="flex mb-6 bg-earth-900 rounded-lg p-1">
          <button
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`flex-1 py-2 rounded-md font-medium transition ${
              activeTab === 'login' 
                ? 'bg-africa-green text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(''); }}
            className={`flex-1 py-2 rounded-md font-medium transition ${
              activeTab === 'register' 
                ? 'bg-africa-green text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>
        
        {error && (
          <div className="bg-africa-red/20 border border-africa-red text-africa-red p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-africa-green hover:bg-emerald-700 text-white rounded-xl font-bold transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-earth-900 border border-earth-700 rounded-lg p-3 text-white focus:border-africa-green outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-africa-green hover:bg-emerald-700 text-white rounded-xl font-bold transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <a href="/" className="text-africa-orange hover:text-orange-400 text-sm">
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
