import React from 'react';
import { 
  ShoppingCart, 
  User, 
  Search, 
  CheckCircle, 
  Star, 
  Shield, 
  Clock,
  DollarSign,
  ArrowRight,
  Package,
  MessageCircle
} from 'lucide-react';

const PersonalShopping: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: 'Product Research',
      description: 'We find the best deals and authentic products from trusted Indian sellers.',
      color: 'text-blue-600'
    },
    {
      icon: DollarSign,
      title: 'Price Negotiation',
      description: 'Our team negotiates better prices and bulk discounts on your behalf.',
      color: 'text-green-600'
    },
    {
      icon: Shield,
      title: 'Quality Verification',
      description: 'We inspect products for quality and authenticity before shipping.',
      color: 'text-purple-600'
    },
    {
      icon: Clock,
      title: 'Time Saving',
      description: 'Skip the hassle of browsing multiple sites - we do the work for you.',
      color: 'text-orange-600'
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Submit Your Request',
      description: 'Tell us what you\'re looking for with as much detail as possible.',
      icon: MessageCircle
    },
    {
      step: 2,
      title: 'We Research & Quote',
      description: 'Our team finds the best options and provides you with quotes.',
      icon: Search
    },
    {
      step: 3,
      title: 'You Approve',
      description: 'Review our findings and approve the items you want to purchase.',
      icon: CheckCircle
    },
    {
      step: 4,
      title: 'We Purchase & Ship',
      description: 'We buy the items and ship them to your vault for consolidation.',
      icon: Package
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'Toronto, Canada',
      text: 'The personal shopping service helped me find authentic Indian spices that I couldn\'t locate anywhere else. Amazing service!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      location: 'Sydney, Australia',
      text: 'They found a traditional kurta set for my wedding at half the price I was quoted locally. Excellent quality too!',
      rating: 5
    },
    {
      name: 'Emma Wilson',
      location: 'London, UK',
      text: 'I needed specific Ayurvedic products and they sourced everything perfectly. The quality verification gave me confidence.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Personal Shopping Service
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Can't find what you're looking for? Our expert shoppers will find, negotiate, and purchase items from India on your behalf.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                <User className="h-5 w-5 mr-2" />
                Request Personal Shopper
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
              <button className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold rounded-lg transition-all duration-300">
                Learn More
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
              Why Choose Our Personal Shopping Service?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our experienced team knows the Indian market inside out and can find exactly what you need.
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

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Personal Shopping Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, transparent process to get exactly what you want from India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-6">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <div className="absolute top-8 left-8 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-8 h-8 transform -translate-x-4">
                    <div className="w-full h-0.5 bg-gray-300 mt-4"></div>
                    <div className="absolute right-0 top-2 w-0 h-0 border-l-4 border-l-gray-300 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from customers who used our personal shopping service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
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
            Ready to Start Personal Shopping?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Submit your request today and let our expert shoppers find exactly what you need from India.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Submit Shopping Request
          </button>
        </div>
      </section>
    </div>
  );
};

export default PersonalShopping;