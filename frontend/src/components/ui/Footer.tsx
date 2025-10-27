import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Phone, MapPin, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <Scissors className="h-6 w-6 text-primary-400" />
              <h3 className="ml-2 text-xl font-display font-medium text-white">Ananda Beauty</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Providing premium beauty services in Mumbai since 2018. Our expert stylists are dedicated to bringing out your natural beauty.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-400 hover:text-primary-400 transition-colors">Our Services</Link>
              </li>
              <li>
                <Link to="/stylists" className="text-gray-400 hover:text-primary-400 transition-colors">Meet Our Stylists</Link>
              </li>
              <li>
                <Link to="/user/booking" className="text-gray-400 hover:text-primary-400 transition-colors">Book Appointment</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-primary-400 transition-colors">Gallery</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Our Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Hair Styling</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Makeup</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Facials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Manicure & Pedicure</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Bridal Packages</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-400 mr-2 mt-0.5" />
                <span className="text-gray-400">
                  123 Ananda Complex, Bandra West, Mumbai, Maharashtra 400050
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary-400 mr-2" />
                <span className="text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary-400 mr-2" />
                <span className="text-gray-400">info@anandabeauty.in</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-primary-400 mr-2 mt-0.5" />
                <span className="text-gray-400">
                  Mon-Sat: 10:00 AM - 8:00 PM<br />
                  Sunday: 11:00 AM - 6:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Ananda Beauty Parlour. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;