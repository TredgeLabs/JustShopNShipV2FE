import React from 'react';
import { User, ShoppingCart, Package, Plane, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: User,
    title: "Create Your Vault",
    description: "Sign up and get your personal Indian address for shopping from any Indian e-commerce site.",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: ShoppingCart,
    title: "Add Shopping Links",
    description: "Send us links to products you want to buy, and we'll handle the purchasing process.",
    color: "bg-orange-100 text-orange-600"
  },
  {
    icon: Package,
    title: "We Order & Consolidate",
    description: "We purchase your items and consolidate them at your vault address to save on shipping.",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Plane,
    title: "International Shipment",
    description: "Your consolidated package is shipped internationally to your doorstep with tracking.",
    color: "bg-purple-100 text-purple-600"
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, secure, and efficient process to get your favorite Indian products delivered worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${step.color} rounded-full mb-6`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
              
              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-8 h-8 transform -translate-x-4">
                  <div className="w-full h-0.5 bg-gray-300 mt-4"></div>
                  <div className="absolute right-0 top-2 w-0 h-0 border-l-4 border-l-gray-300 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
            <CheckCircle className="h-5 w-5 mr-2" />
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;