import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash, X } from 'lucide-react';
import { 
  getAllServices, 
  getServiceById, 
  createService, 
  updateService, 
  deleteService 
} from '../../services/serviceService';
import { Service } from '../../types';
import Swal from 'sweetalert2';

const ManageServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Service>({
    name: '',
    description: '',
    price: 0,
    duration: 60,
    category: ''
  });

  // Fetch all services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllServices();
        
        if (response.success && response.data) {
          setServices(response.data);
          setFilteredServices(response.data);
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

  // Apply search filter
  useEffect(() => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const filtered = services.filter(
        service =>
          service.name.toLowerCase().includes(search) ||
          service.description.toLowerCase().includes(search) ||
          service.category?.toLowerCase().includes(search)
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  }, [searchTerm, services]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'duration') {
      setCurrentService({
        ...currentService,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setCurrentService({
        ...currentService,
        [name]: value,
      });
    }
  };

  // Open modal for creating a new service
  const handleAddService = () => {
    setCurrentService({
      name: '',
      description: '',
      price: 0,
      duration: 60,
      category: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing service
  const handleEditService = async (serviceId: string | undefined) => {
    if (!serviceId) return;
    
    try {
      const response = await getServiceById(serviceId);
      
      if (response.success && response.data) {
        setCurrentService(response.data);
        setIsEditing(true);
        setIsModalOpen(true);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load service details',
      });
    }
  };

  // Save service (create or update)
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!currentService.name || !currentService.description || currentService.price <= 0 || currentService.duration <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill all required fields with valid values',
      });
      return;
    }
    
    try {
      let response;
      
      if (isEditing && currentService._id) {
        // Update existing service
        response = await updateService(currentService._id, currentService);
        
        if (response.success) {
          // Update local state
          setServices(prevServices =>
            prevServices.map(service =>
              service._id === currentService._id ? { ...currentService } : service
            )
          );
          
          Swal.fire({
            icon: 'success',
            title: 'Service Updated',
            text: 'The service has been updated successfully',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } else {
        // Create new service
        response = await createService(currentService);
        
        if (response.success && response.data) {
          // Add to local state
          setServices(prevServices => [...prevServices, response.data as Service]);
          
          Swal.fire({
            icon: 'success',
            title: 'Service Created',
            text: 'The service has been created successfully',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
      
      if (!response.success) {
        Swal.fire({
          icon: 'error',
          title: 'Operation Failed',
          text: response.error || 'Failed to save service',
        });
      } else {
        // Close modal on success
        setIsModalOpen(false);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text: 'An error occurred while saving the service',
      });
    }
  };

  // Delete service
  const handleDeleteService = async (serviceId: string | undefined) => {
    if (!serviceId) return;
    
    // Confirm before deletion
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This service will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (result.isConfirmed) {
      try {
        const response = await deleteService(serviceId);
        
        if (response.success) {
          // Update local state
          setServices(prevServices => 
            prevServices.filter(service => service._id !== serviceId)
          );
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Service has been deleted',
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Deletion Failed',
            text: response.error || 'Failed to delete service',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Deletion Failed',
          text: 'An error occurred while deleting the service',
        });
      }
    }
  };

  // Service categories (you can expand this list)
  const serviceCategories = [
    'Hair',
    'Makeup',
    'Facial',
    'Manicure & Pedicure',
    'Body Treatments',
    'Bridal',
    'Waxing',
    'Other'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Manage Services</h1>
          <p className="text-gray-600">Add, edit or remove beauty services</p>
        </div>
        
        <button
          onClick={handleAddService}
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Service
        </button>
      </div>
      
      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Search services by name, description, or category..."
          />
        </div>
      </div>
      
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div 
              key={service._id} 
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-gray-800">{service.name}</h2>
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-semibold rounded">
                    {service.category || 'Uncategorized'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{service.description}</p>
              </div>
              
              <div className="p-4 bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-primary-700">₹{service.price}</p>
                  <p className="text-xs text-gray-500">{service.duration} minutes</p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditService(service._id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit Service"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Service"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No services found matching your search</p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
      
      {/* Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditing ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveService} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentService.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g. Hair Styling"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={currentService.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe the service..."
                  rows={3}
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={currentService.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g. 1500"
                    min="0"
                    step="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={currentService.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g. 60"
                    min="1"
                    step="1"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={currentService.category || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {serviceCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                >
                  {isEditing ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;