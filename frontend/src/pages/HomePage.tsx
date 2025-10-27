import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, Scissors } from 'lucide-react';

const HomePage: React.FC = () => {
  // Sample data
  const featuredServices = [
    {
      id: 1,
      name: 'Bridal Makeup',
      description: 'Complete bridal makeup with hair styling and draping',
      price: 12000,
      image: 'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      name: 'Hair Coloring',
      description: 'Professional hair coloring with premium products',
      price: 3500,
      image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      name: 'Luxury Facial',
      description: 'Rejuvenating facial treatment with natural ingredients',
      price: 2500,
      image: 'https://images.pexels.com/photos/3997381/pexels-photo-3997381.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 4,
      name: 'Manicure & Pedicure',
      description: 'Complete hand and foot care with massage',
      price: 1200,
      image: 'https://images.pexels.com/photos/939836/pexels-photo-939836.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Priya Malhotra',
      text: 'I got my bridal makeup done from Ananda and I was so happy with the results! Highly recommend their services for any special occasion.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Anjali Patel',
      text: 'The staff is very professional and friendly. I loved my hair color and got so many compliments!',
      rating: 5,
      image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Deepa Gupta',
      text: 'Their facial treatment is amazing! My skin felt so refreshed and glowing. Will definitely be back.',
      rating: 4,
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div 
          className="relative h-[80vh] flex items-center bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/3738339/pexels-photo-3738339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">
                Discover Your True Beauty
              </h1>
              <p className="text-xl mb-8">
                Experience premium beauty services at Mumbai's most luxurious parlour
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/user/booking" 
                  className="px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-medium rounded-md transition-colors"
                >
                  Book Now
                </Link>
                <Link 
                  to="/services" 
                  className="px-6 py-3 bg-transparent border border-white hover:bg-white hover:text-primary-800 text-white font-medium rounded-md transition-colors"
                >
                  Our Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">Our Featured Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our range of premium beauty services designed to enhance your natural beauty
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredServices.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                {/* <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-48 object-cover"
                /> */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-700 font-semibold">₹{service.price}</span>
                    <Link 
                      to="/user/booking" 
                      className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
                    >
                      Book Now <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              to="/services" 
              className="inline-flex items-center px-5 py-2 border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium rounded-md transition-colors"
            >
              View All Services <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">Why Choose Ananda Beauty</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional service and results that exceed your expectations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-primary-50 rounded-lg">
              <div className="bg-primary-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scissors className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Stylists</h3>
              <p className="text-gray-600">
                Our team consists of highly trained professionals with years of experience in the beauty industry
              </p>
            </div>
            
            <div className="text-center p-6 bg-secondary-50 rounded-lg">
              <div className="bg-secondary-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Premium Products</h3>
              <p className="text-gray-600">
                We use only the highest quality, skin-friendly products for all our services
              </p>
            </div>
            
            <div className="text-center p-6 bg-accent-50 rounded-lg">
              <div className="bg-accent-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Convenience</h3>
              <p className="text-gray-600">
                Easy online booking, flexible scheduling, and comfortable ambiance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read testimonials from our happy customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-white p-6 rounded-lg shadow"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-10 w-10 rounded-full object-cover mr-3"
                  />
                  <span className="font-medium text-gray-800">{testimonial.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to Experience the Ananda Difference?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Book your appointment today and let our experts enhance your natural beauty
          </p>
          <Link 
            to="/user/booking" 
            className="inline-block px-8 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-medium rounded-md transition-colors text-lg"
          >
            Book Your Appointment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;