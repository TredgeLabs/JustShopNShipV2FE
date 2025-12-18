import React from 'react';
import { Truck, DollarSign, Shield, Users, Clock, Star } from 'lucide-react';

const benefits = [
  {
    icon: DollarSign,
    title: "Save Up to 70%",
    description: "Consolidate multiple orders into one shipment and save significantly on international shipping costs.",
    color: "text-green-600"
  },
  {
    icon: Truck,
    title: "Reliable Shipping",
    description: "Partnerships with leading logistics providers ensure your packages arrive safely and on time.",
    color: "text-blue-600"
  },
  // {
  //   icon: Shield,
  //   title: "Secure & Insured",
  //   description: "Every package is fully insured and tracked from pickup to delivery for complete peace of mind.",
  //   color: "text-purple-600"
  // },
  {
    icon: Users,
    title: "Personal Shopper",
    description: "Our dedicated team handles your purchases, ensuring you get exactly what you ordered.",
    color: "text-orange-600"
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Quick order processing and consolidation means your packages ship faster than traditional methods.",
    color: "text-indigo-600"
  },
  {
    icon: Star,
    title: "Premium Service",
    description: "24/7 customer support and real-time tracking keep you informed throughout the entire process.",
    color: "text-pink-600"
  }
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose JustShopAndShip?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the difference with our premium international shopping and shipping service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 ${benefit.color} mb-6`}>
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Saving on International Shipping?
          </h3>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of satisfied customers who trust us with their international shopping needs.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
            Create Your Vault Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;