import React from 'react';
import Welcome from '../components/Welcome';
import VaultInfo from '../components/VaultInfo';
import OrderManagement from '../components/OrderManagement';
import HowItWorks from '../components/HowItWorks';
import ShippingCalculator from '../components/ShippingCalculator';
import Offers from '../components/Offers';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Welcome />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <VaultInfo />
          <OrderManagement />
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HowItWorks />
        </div>
      </div>

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Offers />
        </div>
      </div>

      <ShippingCalculator />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Dashboard;