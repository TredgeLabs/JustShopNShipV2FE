import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import userService from '../api/services/userService';

const Footer: React.FC = () => {
  const isLoggedIn = userService.isAuthenticated();
  const navigate = useNavigate();

  const handleTrackOrder = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop the link from trying to navigate to ""
    if (isLoggedIn) {
      navigate('/international-orders');
    } else {
      navigate('/login');
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">JustShopAndShip</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your trusted partner for international shopping and shipping from India. We make global shopping simple, secure, and affordable.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/guide" className="text-gray-300 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/shipping-calculator" className="text-gray-300 hover:text-white transition-colors">Shipping Calculator</Link></li>
              <li><Link to="#" onClick={handleTrackOrder} className="text-gray-300 hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/personal-shopping" className="text-gray-300 hover:text-white transition-colors">Personal Shopping</Link></li>
              <li><Link to="/package-consolidation" className="text-gray-300 hover:text-white transition-colors">Package Consolidation</Link></li>
              <li><Link to="/international-shipping" className="text-gray-300 hover:text-white transition-colors">International Shipping</Link></li>
              <li><Link to="/express-delivery" className="text-gray-300 hover:text-white transition-colors">Express Delivery</Link></li>
              <li><Link to="/customs-handling" className="text-gray-300 hover:text-white transition-colors">Customs Handling</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              {/* Email: Opens default mail client (Outlook, Gmail, Apple Mail) */}
              <a
                href="mailto:support@justshopandship.com"
                className="flex items-center space-x-3 group hover:text-blue-400 transition-colors"
              >
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 group-hover:text-blue-400">support@justshopandship.com</span>
              </a>

              {/* Phone: Opens dialer on mobile; some desktop browsers can link to FaceTime or Skype */}
              <a
                href="tel:+919876543210"
                className="flex items-center space-x-3 group hover:text-blue-400 transition-colors"
              >
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 group-hover:text-blue-400">+91 9876543210</span>
              </a>

              {/* Location: Opens Google Maps on Web/Android and Apple Maps on iOS */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Mumbai,India"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 group hover:text-blue-400 transition-colors"
              >
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 group-hover:text-blue-400">Mumbai, India</span>
              </a>
            </div>

            {/* Commneted down below code for now later will update in phase two */}
            {/* <div className="mt-6">
              <h4 className="font-semibold mb-2">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-400"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div> */}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 JustShopAndShip. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
            <Link to="/cookie-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;