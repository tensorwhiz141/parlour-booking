import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash, X, Star } from 'lucide-react';
import { 
  getAllStylists, 
  getStylistById, 
  createStylist, 
  updateStylist, 
  deleteStylist 
} from '../../services/stylistService';
import { Stylist } from '../../types';
import Swal from 'sweetalert2';

const ManageStylists: React.FC = () => {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [filteredStylists, setFilteredStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStylist, setCurrentStylist] = useState<Stylist>({
    name: '',
    specialization: [],
    experience: 0,
    rating: 5,
    image: '',
    availability: []
  });
  const [specializationInput, setSpecializationInput] = useState('');

  // Fetch all stylists
  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const response = await getAllStylists();
        
        if (response.success && response.data) {
          setStylists(response.data);
          setFilteredStylists(response.data);
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

  // Apply search filter
  useEffect(() => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const filtered = stylists.filter(
        stylist =>
          stylist.name.toLowerCase().includes(search) ||
          stylist.specialization.some(spec => spec.toLowerCase().includes(search))
      );
      setFilteredStylists(filtered);
    } else {
      setFilteredStylists(stylists);
    }
  }, [searchTerm, stylists]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'experience' || name === 'rating') {
      setCurrentStylist({
        ...currentStylist,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setCurrentStylist({
        ...currentStylist,
        [name]: value,
      });
    }
  };

  // Handle specialization input
  const handleSpecializationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecializationInput(e.target.value);
  };

  // Add specialization
  const handleAddSpecialization = () => {
    if (specializationInput.trim() === '') return;
    
    if (!currentStylist.specialization.includes(specializationInput.trim())) {
      setCurrentStylist({
        ...currentStylist,
        specialization: [...currentStylist.specialization, specializationInput.trim()]
      });
    }
    
    setSpecializationInput('');
  };

  // Remove specialization
  const handleRemoveSpecialization = (index: number) => {
    const updatedSpecializations = [...currentStylist.specialization];
    updatedSpecializations.splice(index, 1);
    
    setCurrentStylist({
      ...currentStylist,
      specialization: updatedSpecializations
    });
  };

  // Open modal for creating a new stylist
  const handleAddStylist = () => {
    setCurrentStylist({
      name: '',
      specialization: [],
      experience: 0,
      rating: 5,
      image: '',
      availability: []
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing stylist
  const handleEditStylist = async (stylistId: string | undefined) => {
    if (!stylistId) return;
    
    try {
      const response = await getStylistById(stylistId);
      
      if (response.success && response.data) {
        setCurrentStylist(response.data);
        setIsEditing(true);
        setIsModalOpen(true);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load stylist details',
      });
    }
  };

  // Save stylist (create or update)
  const handleSaveStylist = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!currentStylist.name || currentStylist.experience < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill all required fields with valid values',
      });
      return;
    }
    
    try {
      let response;
      
      if (isEditing && currentStylist._id) {
        // Update existing stylist
        response = await updateStylist(currentStylist._id, currentStylist);
        
        if (response.success) {
          // Update local state
          setStylists(prevStylists =>
            prevStylists.map(stylist =>
              stylist._id === currentStylist._id ? { ...currentStylist } : stylist
            )
          );
          
          Swal.fire({
            icon: 'success',
            title: 'Stylist Updated',
            text: 'The stylist has been updated successfully',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } else {
        // Create new stylist
        response = await createStylist(currentStylist);
        
        if (response.success && response.data) {
          // Add to local state
          setStylists(prevStylists => [...prevStylists, response.data as Stylist]);
          
          Swal.fire({
            icon: 'success',
            title: 'Stylist Created',
            text: 'The stylist has been created successfully',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
      
      if (!response.success) {
        Swal.fire({
          icon: 'error',
          title: 'Operation Failed',
          text: response.error || 'Failed to save stylist',
        });
      } else {
        // Close modal on success
        setIsModalOpen(false);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text: 'An error occurred while saving the stylist',
      });
    }
  };

  // Delete stylist
  const handleDeleteStylist = async (stylistId: string | undefined) => {
    if (!stylistId) return;
    
    // Confirm before deletion
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This stylist will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (result.isConfirmed) {
      try {
        const response = await deleteStylist(stylistId);
        
        if (response.success) {
          // Update local state
          setStylists(prevStylists => 
            prevStylists.filter(stylist => stylist._id !== stylistId)
          );
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Stylist has been deleted',
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Deletion Failed',
            text: response.error || 'Failed to delete stylist',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Deletion Failed',
          text: 'An error occurred while deleting the stylist',
        });
      }
    }
  };

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
          <h1 className="text-2xl font-semibold text-gray-800">Manage Stylists</h1>
          <p className="text-gray-600">Add, edit or remove stylists from your team</p>
        </div>
        
        <button
          onClick={handleAddStylist}
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Stylist
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
            placeholder="Search stylists by name or specialization..."
          />
        </div>
      </div>
      
      {/* Stylists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStylists.length > 0 ? (
          filteredStylists.map((stylist) => (
            <div 
              key={stylist._id} 
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="relative h-48 bg-gray-100">
                {stylist.image ? (
                  <img 
                    src={stylist.image} 
                    alt={stylist.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-primary-50">
                    <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-3xl font-semibold text-primary-700">
                        {stylist.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">{stylist.name}</h2>
                
                <div className="flex items-center text-yellow-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < (stylist.rating || 0) ? 'fill-current' : ''}`}
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">({stylist.rating || 0})</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-medium text-gray-700">Experience:</span> {stylist.experience} years
                </p>
                
                {stylist.specialization && stylist.specialization.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Specializations:</p>
                    <div className="flex flex-wrap gap-2">
                      {stylist.specialization.map((spec, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleEditStylist(stylist._id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit Stylist"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteStylist(stylist._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Stylist"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No stylists found matching your search</p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
      
      {/* Stylist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditing ? 'Edit Stylist' : 'Add New Stylist'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveStylist} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stylist Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentStylist.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g. Priya Sharma"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  name="image"
                  value={currentStylist.image || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter a URL for the stylist's profile image
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience (years) *
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={currentStylist.experience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g. 5"
                    min="0"
                    step="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={currentStylist.rating || 5}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g. 4.5"
                    min="1"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specializations
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={specializationInput}
                    onChange={handleSpecializationChange}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g. Hair Coloring"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialization())}
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecialization}
                    className="px-4 py-2 bg-primary-600 text-white font-medium rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {currentStylist.specialization && currentStylist.specialization.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {currentStylist.specialization.map((spec, index) => (
                      <div 
                        key={index} 
                        className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full flex items-center"
                      >
                        {spec}
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecialization(index)}
                          className="ml-2 text-primary-700 hover:text-primary-900 focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  {isEditing ? 'Update Stylist' : 'Add Stylist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStylists;