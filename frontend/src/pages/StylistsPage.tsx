import React, { useState, useEffect } from 'react';
import { getAllStylists } from '../services/stylistService';
import { Stylist } from '../types';
import { Star } from 'lucide-react';
import Swal from 'sweetalert2';

const StylistsPage: React.FC = () => {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const response = await getAllStylists();
        if (response.success && response.data) {
          setStylists(response.data);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load stylists',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStylists();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-gray-800 mb-4">Our Expert Stylists</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Meet our team of experienced beauty professionals dedicated to making you look and feel your best.
        </p>
      </div>

      {/* Stylists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stylists.map((stylist) => (
          <div
            key={stylist._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-64">
              {stylist.image ? (
                <img
                  src={stylist.image}
                  alt={stylist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary-50 flex items-center justify-center">
                  <span className="text-primary-600 text-6xl font-display">{stylist.name[0]}</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{stylist.name}</h3>
              
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < (stylist.rating || 5)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({stylist.rating || 5})
                </span>
              </div>

              <p className="text-gray-600 mb-4">
                <span className="font-medium">Experience:</span> {stylist.experience} years
              </p>

              {stylist.specialization && stylist.specialization.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Specializations:</h4>
                  <div className="flex flex-wrap gap-2">
                    {stylist.specialization.map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {stylists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No stylists available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default StylistsPage;