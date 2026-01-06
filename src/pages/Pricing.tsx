import React, { useState } from 'react';
import { 
  DollarSign, 
  Package, 
  Zap, 
  Shield, 
  CheckCircle, 
  Calculator,
  Truck,
  Globe,
  Clock,
  Star
} from 'lucide-react';

const Pricing: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('usa');
  const [packageWeight, setPackageWeight] = useState(1);

  const regions = [
    { id: 'usa', name: 'United States', flag: '🇺🇸' },
    { id: 'canada', name: 'Canada', flag: '🇨🇦' },
    { id: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
    { id: 'australia', name: 'Australia', flag: '🇦🇺' },
    { id: 'europe', name: 'Europe', flag: '🇪🇺' },
    { id: 'uae', name: 'UAE', flag: '🇦🇪' }
  ];

  const shippingRates = {
    usa: { express: 22, standard: 18, economy: 14 },
    canada: { express: 20, standard: 16, economy: 12 },
    uk: { express: 25, standard: 20, economy: 16 },
    australia: { express: 28, standard: 22, economy: 18 },
    europe: { express: 24, standard: 19, economy: 15 },
    uae: { express: 18, standard: 15, economy: 12 }
  };

  const services = [
    {
      name: 'Express Shipping',
      icon: Zap,
      duration: '3-5 business days',
      features: [
        'Priority processing',
        'Express customs clearance',
        'Premium tracking',
        'Insurance included',
        'Signature confirmation'
      ],
      color: 'bg-yellow-500',
      popular: false
    },
    {
      name: 'Standard Shipping',
      icon: Truck,
      duration: '7-12 business days',
      features: [
        'Reliable delivery',
        'Standard tracking',
        'Insurance included',
        'Cost-effective',
        'Customs handling'
      ],
      color: 'bg-blue-500',
      popular: true
    },
    {
      name: 'Economy Shipping',
      icon: Package,
      duration: '12-20 business days',
      features: [
        'Budget-friendly',
        'Basic tracking',
        'Longer transit time',
        'Reliable service',
        'Standard handling'
      ],
      color: 'bg-green-500',
      popular: false
    }
  ];

  const additionalServices = [
    {
      service: 'Package Consolidation',
      price: 'Free',
      description: 'Combine multiple packages to save on shipping'
    },
    {
      service: 'Repackaging',
      price: '$5',
      description: 'Professional repackaging for better protection'
    },
    {
      service: 'Storage (90 days)',
      price: 'Free',
      description: 'Free storage for up to 90 days'
    },
    {
      service: 'Extended Storage',
      price: '$2/day',
      description: 'Additional storage beyond 90 days'
    },
    {
      service: 'Personal Shopping',
      price: '5%',
      description: 'Personal shopping service fee'
    },
    {
      service: 'Express Processing',
      price: '$10',
      description: 'Priority processing for urgent shipments'
    }
  ];

  const calculatePrice = (serviceType: 'express' | 'standard' | 'economy') => {
    const rate = shippingRates[selectedRegion as keyof typeof shippingRates][serviceType];
    return (rate * packageWeight).toFixed(2);
  };

  const savingsExample = {
    individual: [45, 38, 52, 41, 36],
    consolidated: 89,
    savings: 45 + 38 + 52 + 41 + 36 - 89,
    percentage: Math.round(((45 + 38 + 52 + 41 + 36 - 89) / (45 + 38 + 52 + 41 + 36)) * 100)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transparent Pricing
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              No hidden fees, no surprises. See exactly what you'll pay for international shipping.
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Calculator */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Calculate Your Shipping Cost
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant pricing for your destination and package weight.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Controls */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Globe className="inline h-4 w-4 mr-2" />
                    Destination
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {regions.map(region => (
                      <option key={region.id} value={region.id}>
                        {region.flag} {region.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Package className="inline h-4 w-4 mr-2" />
                    Package Weight: {packageWeight} kg
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={packageWeight}
                    onChange={(e) => setPackageWeight(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0.5kg</span>
                    <span>10kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className={`bg-white rounded-xl shadow-lg overflow-hidden ${service.popular ? 'ring-2 ring-blue-500' : ''}`}>
                  {service.popular && (
                    <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 ${service.color} text-white rounded-full mb-4`}>
                        <service.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                      <p className="text-gray-600">{service.duration}</p>
                    </div>

                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        ${calculatePrice(service.name.toLowerCase().split(' ')[0] as 'express' | 'standard' | 'economy')}
                      </div>
                      <p className="text-sm text-gray-600">for {packageWeight}kg package</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      service.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}>
                      Select {service.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Additional Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Optional services to enhance your shipping experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{service.service}</h3>
                  <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                </div>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consolidation Savings */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Save with Package Consolidation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how much you can save by combining multiple packages.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Individual Shipping</h3>
                  <div className="space-y-3">
                    {savingsExample.individual.map((price, index) => (
                      <div key={index} className="flex justify-between items-center bg-white rounded-lg p-3">
                        <span className="text-gray-600">Package {index + 1}</span>
                        <span className="font-semibold text-red-600">${price}</span>
                      </div>
                    ))}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center font-bold">
                        <span>Total:</span>
                        <span className="text-red-600">${savingsExample.individual.reduce((a, b) => a + b, 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Consolidated Shipping</h3>
                  <div className="bg-white rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      ${savingsExample.consolidated}
                    </div>
                    <p className="text-gray-600 mb-4">All 5 packages combined</p>
                    
                    <div className="bg-green-100 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-800 mb-1">
                        Save ${savingsExample.savings}
                      </div>
                      <div className="text-green-700">
                        {savingsExample.percentage}% savings with consolidation
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pricing FAQ
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about our pricing and fees.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Are there any hidden fees?</h3>
                <p className="text-gray-600">No, our pricing is completely transparent. The price you see is what you pay, with no hidden charges or surprise fees.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How is shipping cost calculated?</h3>
                <p className="text-gray-600">Shipping costs are based on package weight, dimensions, destination, and service level. We use dimensional weight pricing for accuracy.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Do I pay customs duties?</h3>
                <p className="text-gray-600">Customs duties and taxes are separate from our shipping fees and are paid by the recipient based on destination country regulations.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I get a refund?</h3>
                <p className="text-gray-600">Shipping fees are generally non-refundable once processing begins. However, we offer refunds for undelivered packages covered by insurance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Shipping?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Get your personal vault address and start saving on international shipping today.
          </p>
          {/* <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
            <Calculator className="h-5 w-5 mr-2" />
            Calculate Your Savings
          </button> */}
        </div>
      </section>
    </div>
  );
};

export default Pricing;