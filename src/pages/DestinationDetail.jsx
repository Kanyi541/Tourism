// src/pages/DestinationDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchDestinationById } from '../services/api';
import DestinationCard from '../components/DestinationCard';

const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchDestinationById(id)
      .then((data) => {
        setDestination(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load destination');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  if (!destination) {
    return <div className="flex items-center justify-center h-screen text-gray-400">Destination not found.</div>;
  }

  const { name, country, description, image, rating, type } = destination;

  return (
    <>
      <Helmet>
        <title>{name} – African Tourism</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={name} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={`https://yourdomain.com/destinations/${id}`} />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="{name}, {country}, tourism, africa" />
      </Helmet>
      <div className="min-h-screen bg-earth-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{name}</h1>
          <p className="text-gray-300 mb-6">{description}</p>
          <img src={image} alt={name} className="w-full h-64 object-cover rounded-lg mb-6" />
          <div className="flex items-center mb-4">
            <span className="mr-2 font-medium">Country:</span>{' '}{country}
          </div>
          <div className="flex items-center mb-4">
            <span className="mr-2 font-medium">Region Type:</span>{' '}{type}
          </div>
          <div className="flex items-center mb-4">
            <span className="mr-2 font-medium">Rating:</span>{' '}★ {rating}
          </div>
        </div>
      </div>
    </>
  );
};

export default DestinationDetail;
