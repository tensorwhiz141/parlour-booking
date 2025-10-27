// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { getAllServices } from '../../services/serviceService';
// import { getAllStylists } from '../../services/stylistService';
// import { createBooking, getAvailableTimeSlots } from '../../services/bookingService';
// import { useAuth } from '../../context/AuthContext';
// import { Service, Stylist } from '../../types';
// import Swal from 'sweetalert2';

// const BookingPage: React.FC = () => {
//   const { authState } = useAuth();
//   const navigate = useNavigate();
  
//   const [services, setServices] = useState<Service[]>([]);
//   const [stylists, setStylists] = useState<Stylist[]>([]);
//   const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
  
//   const [formData, setFormData] = useState({
//     serviceId: '',
//     serviceName: '',
//     price: 0,
//     stylistId: '',
//     stylistName: '',
//     date: new Date(),
//     time: '',
//     specialRequests: '',
//   });

//   // Fetch services and stylists
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const servicesResponse = await getAllServices();
//         const stylistsResponse = await getAllStylists();
        
//         if (servicesResponse.success && servicesResponse.data) {
//           setServices(servicesResponse.data);
//         }
        
//         if (stylistsResponse.success && stylistsResponse.data) {
//           setStylists(stylistsResponse.data);
//         }
//       } catch (error) {
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: 'Failed to load booking data',
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   // Fetch available time slots when date or service changes
//   useEffect(() => {
//     const fetchTimeSlots = async () => {
//       if (!formData.serviceId || !formData.date) return;
      
//       try {
//         const dateString = formData.date.toISOString().split('T')[0];
//         const response = await getAvailableTimeSlots(dateString, formData.serviceId);
        
//         if (response.success && response.data) {
//           setAvailableTimeSlots(response.data);
//           // Reset time selection if previously selected time is no longer available
//           if (formData.time && !response.data.includes(formData.time)) {
//             setFormData({ ...formData, time: '' });
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching time slots:', error);
//       }
//     };
    
//     fetchTimeSlots();
//   }, [formData.date, formData.serviceId]);

//   // Handle form changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
    
//     if (name === 'serviceId') {
//       const selectedService = services.find(service => service._id === value);
//       setFormData({
//         ...formData,
//         serviceId: value,
//         serviceName: selectedService?.name || '',
//         price: selectedService?.price || 0,
//       });
//     } else if (name === 'stylistId') {
//       const selectedStylist = stylists.find(stylist => stylist._id === value);
//       setFormData({
//         ...formData,
//         stylistId: value,
//         stylistName: selectedStylist?.name || '',
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   // Handle date change
//   const handleDateChange = (date: Date) => {
//     setFormData({ ...formData, date, time: '' });
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Basic validation
//     if (!formData.serviceId || !formData.date || !formData.time) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Validation Error',
//         text: 'Please select a service, date, and time',
//       });
//       return;
//     }
    
//     setSubmitting(true);
    
//     try {
//       const response = await createBooking({
//         serviceId: formData.serviceId,
//         serviceName: formData.serviceName,
//         stylistId: formData.stylistId || undefined,
//         stylistName: formData.stylistName || undefined,
//         date: formData.date,
//         time: formData.time,
//         price: formData.price,
//         specialRequests: formData.specialRequests,
//         status: 'pending',
//       });
      
//       if (response.success) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Booking Successful',
//           text: 'Your appointment has been successfully booked! We will confirm your appointment soon.',
//           confirmButtonText: 'View My Bookings',
//         }).then((result) => {
//           if (result.isConfirmed) {
//             navigate('/user/dashboard');
//           }
//         });
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Booking Failed',
//           text: response.error || 'Failed to create booking. Please try again.',
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Booking Failed',
//         text: 'An unexpected error occurred. Please try again.',
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Handle next step
//   const handleNextStep = () => {
//     if (currentStep === 1 && !formData.serviceId) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Please Select a Service',
//         text: 'You need to select a service to proceed',
//       });
//       return;
//     }
    
//     if (currentStep === 2 && (!formData.date || !formData.time)) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Please Select Date and Time',
//         text: 'You need to select both date and time to proceed',
//       });
//       return;
//     }
    
//     setCurrentStep(currentStep + 1);
//   };

//   // Handle previous step
//   const handlePrevStep = () => {
//     setCurrentStep(currentStep - 1);
//   };

//   // Mock time slots (replace with actual API data)
//   const generateMockTimeSlots = () => {
//     const slots = [];
//     for (let hour = 10; hour <= 19; hour++) {
//       slots.push(`${hour}:00`);
//       if (hour < 19) slots.push(`${hour}:30`);
//     }
//     return slots;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-3xl mx-auto">
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="bg-primary-600 p-6 text-white">
//             <h1 className="text-2xl font-semibold">Book an Appointment</h1>
//             <p className="mt-1 text-primary-100">
//               Follow the steps below to book your beauty service
//             </p>
//           </div>
          
//           {/* Stepper */}
//           <div className="flex border-b border-gray-200">
//             <div 
//               className={`flex-1 py-4 px-6 text-center border-b-2 ${
//                 currentStep === 1 ? 'border-primary-600 text-primary-600' : 'border-transparent'
//               }`}
//             >
//               <span className={`inline-block w-6 h-6 rounded-full mr-2 text-sm ${
//                 currentStep === 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
//               }`}>
//                 1
//               </span>
//               <span className={currentStep === 1 ? 'font-medium' : 'text-gray-500'}>Select Service</span>
//             </div>
            
//             <div 
//               className={`flex-1 py-4 px-6 text-center border-b-2 ${
//                 currentStep === 2 ? 'border-primary-600 text-primary-600' : 'border-transparent'
//               }`}
//             >
//               <span className={`inline-block w-6 h-6 rounded-full mr-2 text-sm ${
//                 currentStep === 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
//               }`}>
//                 2
//               </span>
//               <span className={currentStep === 2 ? 'font-medium' : 'text-gray-500'}>Choose Date & Time</span>
//             </div>
            
//             <div 
//               className={`flex-1 py-4 px-6 text-center border-b-2 ${
//                 currentStep === 3 ? 'border-primary-600 text-primary-600' : 'border-transparent'
//               }`}
//             >
//               <span className={`inline-block w-6 h-6 rounded-full mr-2 text-sm ${
//                 currentStep === 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
//               }`}>
//                 3
//               </span>
//               <span className={currentStep === 3 ? 'font-medium' : 'text-gray-500'}>Confirm Booking</span>
//             </div>
//           </div>
          
//           <form onSubmit={handleSubmit}>
//             {/* Step 1: Select Service */}
//             {currentStep === 1 && (
//               <div className="p-6">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Select a Service</h2>
                
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Choose Service
//                   </label>
//                   <select
//                     name="serviceId"
//                     value={formData.serviceId}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                     required
//                   >
//                     <option value="">-- Select a service --</option>
//                     {services.map((service) => (
//                       <option key={service._id} value={service._id}>
//                         {service.name} - ₹{service.price}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Choose Stylist (Optional)
//                   </label>
//                   <select
//                     name="stylistId"
//                     value={formData.stylistId}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                   >
//                     <option value="">Any Available Stylist</option>
//                     {stylists.map((stylist) => (
//                       <option key={stylist._id} value={stylist._id}>
//                         {stylist.name} - {stylist.specialization.join(', ')}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
                
//                 {formData.serviceId && (
//                   <div className="bg-gray-50 p-4 rounded-md mb-6">
//                     <h3 className="font-medium text-gray-800 mb-2">Service Details</h3>
//                     <p className="text-gray-600 mb-1">
//                       {services.find(s => s._id === formData.serviceId)?.description}
//                     </p>
//                     <p className="text-gray-800 font-medium">
//                       Duration: {services.find(s => s._id === formData.serviceId)?.duration} minutes
//                     </p>
//                   </div>
//                 )}
                
//                 <div className="flex justify-end">
//                   <button
//                     type="button"
//                     onClick={handleNextStep}
//                     className="px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
            
//             {/* Step 2: Select Date and Time */}
//             {currentStep === 2 && (
//               <div className="p-6">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Date and Time</h2>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Choose Date
//                     </label>
//                     <DatePicker
//                       selected={formData.date}
//                       onChange={handleDateChange}
//                       minDate={new Date()}
//                       dateFormat="dd/MM/yyyy"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Choose Time
//                     </label>
//                     <select
//                       name="time"
//                       value={formData.time}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                       required
//                     >
//                       <option value="">-- Select a time slot --</option>
//                       {/* Use actual API data instead of mock data in production */}
//                       {(availableTimeSlots.length > 0 ? availableTimeSlots : generateMockTimeSlots()).map((slot) => (
//                         <option key={slot} value={slot}>
//                           {slot}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
                
//                 <div className="flex justify-between mt-6">
//                   <button
//                     type="button"
//                     onClick={handlePrevStep}
//                     className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
//                   >
//                     Back
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleNextStep}
//                     className="px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
            
//             {/* Step 3: Confirm Booking */}
//             {currentStep === 3 && (
//               <div className="p-6">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Your Booking</h2>
                
//                 <div className="bg-gray-50 p-4 rounded-md mb-6">
//                   <h3 className="font-medium text-gray-800 mb-3">Booking Summary</h3>
                  
//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <p className="text-sm text-gray-500">Service</p>
//                       <p className="font-medium text-gray-800">{formData.serviceName}</p>
//                     </div>
                    
//                     <div>
//                       <p className="text-sm text-gray-500">Price</p>
//                       <p className="font-medium text-gray-800">₹{formData.price}</p>
//                     </div>
                    
//                     <div>
//                       <p className="text-sm text-gray-500">Date</p>
//                       <p className="font-medium text-gray-800">
//                         {formData.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
//                       </p>
//                     </div>
                    
//                     <div>
//                       <p className="text-sm text-gray-500">Time</p>
//                       <p className="font-medium text-gray-800">{formData.time}</p>
//                     </div>
                    
//                     <div>
//                       <p className="text-sm text-gray-500">Stylist</p>
//                       <p className="font-medium text-gray-800">{formData.stylistName || 'Any Available Stylist'}</p>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Special Requests (Optional)
//                   </label>
//                   <textarea
//                     name="specialRequests"
//                     value={formData.specialRequests}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                     rows={3}
//                     placeholder="Any special requirements or preferences..."
//                   ></textarea>
//                 </div>
                
//                 <div className="flex justify-between">
//                   <button
//                     type="button"
//                     onClick={handlePrevStep}
//                     className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
//                   >
//                     Back
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={submitting}
//                     className="px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
//                   >
//                     {submitting ? 'Confirming...' : 'Confirm Booking'}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getAllServices } from '../../services/serviceService';
import { getAllStylists } from '../../services/stylistService';
import { createBooking, getAvailableTimeSlots } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { Service, Stylist } from '../../types';
import Swal from 'sweetalert2';

const BookingPage: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    serviceId: '',
    serviceName: '',
    price: 0,
    stylistId: '',
    stylistName: '',
    date: new Date(),
    time: '',
    specialRequests: '',
  });

  // Fetch services and stylists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesResponse = await getAllServices();
        const stylistsResponse = await getAllStylists();
        
        if (servicesResponse.success && servicesResponse.data) {
          setServices(servicesResponse.data);
        }
        
        if (stylistsResponse.success && stylistsResponse.data) {
          setStylists(stylistsResponse.data.filter(stylist => stylist.isActive));
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load booking data',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fetch available time slots when date, service, or stylist changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!formData.serviceId || !formData.date) return;
      
      try {
        const dateString = formData.date.toISOString().split('T')[0];
        console.log('Fetching time slots with stylistId:', formData.stylistId);
        const response = await getAvailableTimeSlots(dateString, formData.serviceId, formData.stylistId || undefined);
        
        if (response.success && response.data) {
          setAvailableTimeSlots(response.data);
          console.log('Available time slots received:', response.data);
          // Reset time selection if previously selected time is no longer available
          if (formData.time && !response.data.includes(formData.time)) {
            setFormData({ ...formData, time: '' });
          }
        }
      } catch (error) {
        console.error('Error fetching time slots:', error);
      }
    };
    
    fetchTimeSlots();
  }, [formData.date, formData.serviceId, formData.stylistId]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'serviceId') {
      const selectedService = services.find(service => service._id === value);
      setFormData({
        ...formData,
        serviceId: value,
        serviceName: selectedService?.name || '',
        price: selectedService?.price || 0,
      });
    } else if (name === 'stylistId') {
      const selectedStylist = stylists.find(stylist => stylist._id === value);
      setFormData({
        ...formData,
        stylistId: value,
        stylistName: selectedStylist?.name || '',
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle date change
  const handleDateChange = (date: Date) => {
    setFormData({ ...formData, date, time: '' });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.serviceId || !formData.date || !formData.time) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please select a service, date, and time',
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await createBooking({
        serviceId: formData.serviceId,
        serviceName: formData.serviceName,
        stylistId: formData.stylistId || undefined,
        stylistName: formData.stylistName || undefined,
        date: formData.date,
        time: formData.time,
        price: formData.price,
        specialRequests: formData.specialRequests,
        status: 'pending',
      });
      
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Booking Successful',
          text: 'Your appointment has been successfully booked! We will confirm your appointment soon.',
          confirmButtonText: 'View My Bookings',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/user/dashboard');
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Booking Failed',
          text: response.error || 'Failed to create booking. Please try again.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1 && !formData.serviceId) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Select a Service',
        text: 'You need to select a service to proceed',
      });
      return;
    }
    
    if (currentStep === 2 && (!formData.date || !formData.time)) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Select Date and Time',
        text: 'You need to select both date and time to proceed',
      });
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Mock time slots (replace with actual API data)
  const generateMockTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 19; hour++) {
      slots.push(`${hour}:00`);
      if (hour < 19) slots.push(`${hour}:30`);
    }
    return slots;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-primary-600 p-6 text-white">
            <h1 className="text-2xl font-semibold">Book an Appointment</h1>
            <p className="mt-1 text-primary-100">
              Follow the steps to book your beauty service
            </p>
          </div>
          
          {/* Stepper */}
          <div className="flex border-b border-gray-200">
            <div 
              className={`flex-1 py-4 px-6 text-center border-b-2 ${
                currentStep === 1 ? 'border-primary-600 text-primary-600' : 'border-transparent'
              }`}
            >
              <span className={`inline-block w-6 h-6 rounded-full mr-2 text-sm ${
                currentStep === 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                1
              </span>
              <span className={currentStep === 1 ? 'font-medium' : 'text-gray-500'}>Select Service</span>
            </div>
            
            <div 
              className={`flex-1 py-4 px-6 text-center border-b-2 ${
                currentStep === 2 ? 'border-primary-600 text-primary-600' : 'border-transparent'
              }`}
            >
              <span className={`inline-block w-6 h-6 rounded-full mr-2 text-sm ${
                currentStep === 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                2
              </span>
              <span className={currentStep === 2 ? 'font-medium' : 'text-gray-500'}>Choose Date & Time</span>
            </div>
            
            <div 
              className={`flex-1 py-4 px-6 text-center border-b-2 ${
                currentStep === 3 ? 'border-primary-600 text-primary-600' : 'border-transparent'
              }`}
            >
              <span className={`inline-block w-6 h-6 rounded-full mr-2 text-sm ${
                currentStep === 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                3
              </span>
              <span className={currentStep === 3 ? 'font-medium' : 'text-gray-500'}>Confirm Booking</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Step 1: Select Service */}
            {currentStep === 1 && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Select a Service</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Choose Service
                  </label>
                  <select
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Select a service --</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name} - ₹{service.price}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Choose Stylist (Optional)
                  </label>
                  <select
                    name="stylistId"
                    value={formData.stylistId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Any Available Stylist</option>
                    {stylists.map((stylist) => (
                      <option key={stylist._id} value={stylist._id}>
                        {stylist.name} - {stylist.specialization.join(', ')}
                      </option>
                    ))}
                  </select>
                </div>
                
                {formData.serviceId && (
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h3 className="font-medium text-gray-800 mb-2">Service Details</h3>
                    <p className="text-gray-600 mb-1">
                      {services.find(s => s._id === formData.serviceId)?.description}
                    </p>
                    <p className="text-gray-800 font-medium">
                      Duration: {services.find(s => s._id === formData.serviceId)?.duration} minutes
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Select Date and Time */}
            {currentStep === 2 && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Date and Time</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Choose Date
                    </label>
                    <DatePicker
                      selected={formData.date}
                      onChange={handleDateChange}
                      minDate={new Date()}
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Choose Time
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">-- Select a time slot --</option>
                      {(availableTimeSlots.length > 0 ? availableTimeSlots : generateMockTimeSlots()).map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Confirm Booking */}
            {currentStep === 3 && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Your Booking</h2>
                
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h3 className="font-medium text-gray-800 mb-3">Booking Summary</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Service</p>
                      <p className="font-medium text-gray-800">{formData.serviceName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium text-gray-800">₹{formData.price}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-gray-800">
                        {formData.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium text-gray-800">{formData.time}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Stylist</p>
                      <p className="font-medium text-gray-800">{formData.stylistName || 'Any Available Stylist'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Any special requirements or preferences..."
                  ></textarea>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
                  >
                    {submitting ? 'Confirming...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;