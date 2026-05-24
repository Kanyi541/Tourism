// API base URL configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Re-export Firebase functions as API utilities
export {
    fetchDestinations,
    fetchTours,
    addDestination,
    addTour,
    deleteDestination,
    updateDestination,
    deleteTour,
    updateTour
} from './firebase.js';

export const fetchDestinationById = (id) => fetch(`${API_BASE_URL}/api/destinations/${id}`).then(res => res.json());
