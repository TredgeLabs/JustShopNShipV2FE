import React from 'react';
import {
  Plane,
  Globe,
  Shield,
  Clock,
  Truck,
  CheckCircle,
  ArrowRight,
  Package,
  MapPin,
  Star
} from 'lucide-react';
import { countries } from '../constants/countries';

const InternationalShipping: React.FC = () => {
  const features = [
    {
      icon: Globe,
      title: '50+ Countries',
      description: 'We ship to over 50 countries worldwide with reliable delivery.',
      color: 'text-blue-600'
    },
    {
      icon: Shield,
      title: 'Fully Insured',
      description: 'All shipments are fully insured against loss or damage.',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Express options available with delivery in 3-7 business days.',
      color: 'text-purple-600'
    },
    {
      icon: CheckCircle,
      title: 'Real-time Tracking',
      description: 'Track your package every step of the way with detailed updates.',
      color: 'text-orange-600'
    }
  ];

  const shippingOptions = [
    {
      name: 'Express Shipping',
      duration: '3-7 business days',
      features: ['Priority handling', 'Express customs clearance', 'Premium tracking', 'Insurance included'],
      icon: Plane,
      color: 'bg-blue-600'
    },
    {
      name: 'Standard Shipping',
      duration: '7-12 business days',
      features: ['Reliable delivery', 'Standard tracking', 'Insurance included', 'Cost-effective'],
      icon: Truck,
      color: 'bg-green-600'
    },
    {
      name: 'Economy Shipping',
      duration: '12-20 business days',
      features: ['Budget-friendly', 'Basic tracking', 'Longer transit time', 'Reliable service'],
      icon: Package,
      color: 'bg-gray-600'
    }
  ];

  const testimonials = [
    {
      name: 'David Miller',
      location: 'New York, USA',
      text: 'My package arrived in perfect condition within 5 days. The tracking was accurate and customer service was excellent.',
      rating: 5
    },
    {
      name: 'Lisa Thompson',
      location: 'Melbourne, Australia',
      text: 'I\'ve used their shipping service multiple times. Always reliable, well-packaged, and reasonably priced.',
      rating: 5
    },
    {
      name: 'James Wilson',
      location: 'Manchester, UK',
      text: 'The customs handling was seamless. No delays or complications - everything was handled professionally.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              International Shipping
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Fast, reliable, and secure international shipping to over 50 countries worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Plane className="h-5 w-5 mr-2" />
                Ship Internationally
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
              <button className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold rounded-lg transition-all duration-300">
                Calculate Shipping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our International Shipping?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make international shipping simple, secure, and affordable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shipping Options
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the shipping option that best fits your needs and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shippingOptions.map((option, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className={`${option.color} text-white p-6 text-center`}>
                  <option.icon className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{option.name}</h3>
                  <p className="text-lg">{option.duration}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {option.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full mt-6 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
                    Select This Option
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries We Ship To */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Countries We Ship To
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We deliver to over 50 countries worldwide with reliable service.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Popular Destinations</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {countries.filter(country => country.popular).map((country, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
                  <div className="text-3xl mb-2">{country.flag}</div>
                  <p className="text-sm font-medium text-gray-900">{country.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Other Destinations</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {countries.filter(country => !country.popular).map((country, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
                  <div className="text-3xl mb-2">{country.flag}</div>
                  <p className="text-sm font-medium text-gray-900">{country.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">Don't see your country? <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Contact us</a> to check availability.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from customers around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Ship Internationally?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Get your packages delivered worldwide with our reliable international shipping service.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
            <Plane className="h-5 w-5 mr-2" />
            Start Shipping Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default InternationalShipping;