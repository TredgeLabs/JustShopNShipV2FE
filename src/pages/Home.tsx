import React from 'react';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs';
import CostComparison from '../components/CostComparison';
import ShippingCalculator from '../components/ShippingCalculator';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <WhyChooseUs />
      <CostComparison />
      <ShippingCalculator />
      <Testimonials />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Home;