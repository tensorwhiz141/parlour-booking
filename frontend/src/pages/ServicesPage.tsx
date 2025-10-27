import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllServices } from '../services/serviceService';
import { Service } from '../types';
import { ChevronRight, Clock, IndianRupee } from 'lucide-react';
import Swal from 'sweetalert2';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllServices();
        if (response.success && response.data) {
          setServices(response.data);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load services',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = [
    'all',
    'Hair',
    'Makeup',
    'Facial',
    'Manicure & Pedicure',
    'Body Treatments',
    'Bridal',
    'Waxing',
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(service => service.category === selectedCategory);

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
        <h1 className="text-4xl font-display font-bold text-gray-800 mb-4">Our Services</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our range of premium beauty services designed to enhance your natural beauty and provide a relaxing experience.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {service.image ? (
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-primary-50 flex items-center justify-center">
                <span className="text-primary-600 text-4xl font-display">{service.name[0]}</span>
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
                {service.category && (
                  <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                    {service.category}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center text-gray-700">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    <span className="font-semibold">₹{service.price}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{service.duration} mins</span>
                  </div>
                </div>
                <Link
                  to="/user/booking"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Book Now
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No services found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;