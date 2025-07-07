import React from 'react';
import { 
  Zap, 
  Clock, 
  Shield, 
  CheckCircle, 
  Plane,
  ArrowRight,
  Package,
  Globe,
  Star,
  Truck
} from 'lucide-react';

const ExpressDelivery: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Express delivery in 3-5 business days to major destinations worldwide.',
      color: 'text-yellow-600'
    },
    {
      icon: Shield,
      title: 'Priority Handling',
      description: 'Your packages get priority processing and expedited customs clearance.',
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Get instant notifications and detailed tracking throughout the journey.',
      color: 'text-green-600'
    },
    {
      icon: CheckCircle,
      title: 'Guaranteed Delivery',
      description: 'We guarantee delivery within the promised timeframe or your money back.',
      color: 'text-purple-600'
    }
  ];

  const deliveryTimes = [
    { country: 'United States', flag: '🇺🇸', days: '3-5', popular: true },
    { country: 'Canada', flag: '🇨🇦', days: '3-5', popular: true },
    { country: 'United Kingdom', flag: '🇬🇧', days: '3-5', popular: true },
    { country: 'Australia', flag: '🇦🇺', days: '4-6', popular: true },
    { country: 'Germany', flag: '🇩🇪', days: '3-5', popular: true },
    { country: 'UAE', flag: '🇦🇪', days: '2-4', popular: true },
    { country: 'Singapore', flag: '🇸🇬', days: '3-5', popular: false },
    { country: 'France', flag: '🇫🇷', days: '3-5', popular: false },
    { country: 'Japan', flag: '🇯🇵', days: '4-6', popular: false },
    { country: 'Netherlands', flag: '🇳🇱', days: '3-5', popular: false }
  ];

  const process = [
    {
      step: 1,
      title: 'Priority Processing',
      description: 'Your package is immediately prioritized for express handling.',
      icon: Zap
    },
    {
      step: 2,
      title: 'Express Packaging',
      description: 'Professional packaging optimized for speed and protection.',
      icon: Package
    },
    {
      step: 3,
      title: 'Fast Transit',
      description: 'Direct routing through our premium carrier network.',
      icon: Plane
    },
    {
      step: 4,
      title: 'Quick Delivery',
      description: 'Priority delivery to your doorstep within 3-5 business days.',
      icon: Truck
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      location: 'San Francisco, USA',
      text: 'Needed my saree for a wedding urgently. Express delivery got it to me in just 4 days - perfect timing!',
      rating: 5,
      deliveryTime: '4 days'
    },
    {
      name: 'Mark Johnson',
      location: 'London, UK',
      text: 'Express service is worth every penny. Fast, reliable, and my package arrived in perfect condition.',
      rating: 5,
      deliveryTime: '3 days'
    },
    {
      name: 'Emma Davis',
      location: 'Sydney, Australia',
      text: 'The tracking was incredibly detailed and accurate. Knew exactly when my package would arrive.',
      rating: 5,
      deliveryTime: '5 days'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Express Delivery
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-yellow-100 max-w-3xl mx-auto">
              When you need it fast - get your packages delivered in 3-5 business days with our premium express service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-white text-orange-600 hover:bg-gray-100 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Zap className="h-5 w-5 mr-2" />
                Ship Express Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
              <button className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold rounded-lg transition-all duration-300">
                Check Delivery Times
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
              Why Choose Express Delivery?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              When time matters, our express delivery service ensures your packages arrive quickly and safely.
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

      {/* Delivery Times */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Express Delivery Times
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fast delivery to major destinations worldwide.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Popular Destinations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deliveryTimes.filter(dest => dest.popular).map((destination, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{destination.flag}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{destination.country}</h4>
                        <p className="text-sm text-gray-600">Express Delivery</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">{destination.days}</div>
                      <div className="text-sm text-gray-600">business days</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Other Destinations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {deliveryTimes.filter(dest => !dest.popular).map((destination, index) => (
                <div key={index} className="bg-white rounded-lg p-4 text-center shadow hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">{destination.flag}</div>
                  <h4 className="font-medium text-gray-900 text-sm">{destination.country}</h4>
                  <p className="text-orange-600 font-semibold">{destination.days} days</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Express Delivery Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamlined process designed for speed and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 text-white rounded-full mb-6">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <div className="absolute top-8 left-8 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Express Delivery Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from customers who chose express delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {testimonial.deliveryTime}
                  </div>
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
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need It Fast? Choose Express!
          </h2>
          <p className="text-xl mb-8 text-orange-100 max-w-2xl mx-auto">
            Don't wait weeks for your packages. Get express delivery and receive your items in just 3-5 business days.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-white text-orange-600 hover:bg-gray-100 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
            <Zap className="h-5 w-5 mr-2" />
            Ship Express Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default ExpressDelivery;