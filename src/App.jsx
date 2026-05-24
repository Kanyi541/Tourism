import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Tours from './pages/Tours';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import BookingForm from './pages/BookingForm';
import DestinationDetail from './pages/DestinationDetail';
function App() {
  return (
      <HelmetProvider>
        <Helmet>
          <link rel="icon" href="/logo.png" />
          <link rel="apple-touch-icon" href="/logo.png" />
          <link rel="mask-icon" href="/favicon.svg" color="#ffffff" />
          <meta property="og:site_name" content="African Tourism" />
          <meta property="og:image" content="/logo.png" />
        </Helmet>
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-earth-900">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/login" element={<Login />} />
              <Route path="/booking" element={<BookingForm />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
</Routes>
        </main>
        <Footer />
      </div>
    </Router>
  </AuthProvider>
</HelmetProvider>
  );
}

export default App;
