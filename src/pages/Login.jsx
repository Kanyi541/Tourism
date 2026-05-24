import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../services/firebase';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
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
      await createUserWithEmailAndPassword(auth, email, password);
      // Navigation handled by useEffect
    } catch (err) {
      setError(getErrorMessage(err.code));
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Navigation handled by useEffect
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
        
        {/* Google Sign In */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-earth-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-earth-800 text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mt-4 w-full py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-xl font-bold transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
        
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
