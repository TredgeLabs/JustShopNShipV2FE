import React from 'react';
import { 
  Package, 
  TrendingDown, 
  Truck, 
  Shield, 
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Scale,
  Globe
} from 'lucide-react';

const PackageConsolidation: React.FC = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Save Up to 70%',
      description: 'Combine multiple packages into one shipment and dramatically reduce shipping costs.',
      color: 'text-green-600'
    },
    {
      icon: Shield,
      title: 'Better Protection',
      description: 'Professional repacking ensures your items are better protected during transit.',
      color: 'text-blue-600'
    },
    {
      icon: Truck,
      title: 'Simplified Customs',
      description: 'One customs declaration instead of multiple, reducing delays and complications.',
      color: 'text-purple-600'
    },
    {
      icon: Globe,
      title: 'Eco-Friendly',
      description: 'Fewer shipments mean lower carbon footprint and environmental impact.',
      color: 'text-green-600'
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Shop & Ship to Vault',
      description: 'Order from multiple Indian stores and have them delivered to your vault address.',
      icon: Package
    },
    {
      step: 2,
      title: 'Items Arrive',
      description: 'We receive and inspect all your packages at our secure facility.',
      icon: CheckCircle
    },
    {
      step: 3,
      title: 'Consolidation',
      description: 'We carefully repack your items into optimized packages for shipping.',
      icon: Scale
    },
    {
      step: 4,
      title: 'International Shipping',
      description: 'Your consolidated package is shipped internationally with tracking.',
      icon: Truck
    }
  ];

  const savingsExamples = [
    {
      scenario: '3 Small Packages',
      individual: '$120',
      consolidated: '$45',
      savings: '$75',
      percentage: '63%'
    },
    {
      scenario: '5 Medium Packages',
      individual: '$280',
      consolidated: '$85',
      savings: '$195',
      percentage: '70%'
    },
    {
      scenario: '8 Small Items',
      individual: '$200',
      consolidated: '$60',
      savings: '$140',
      percentage: '70%'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Package Consolidation
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Save up to 70% on international shipping by combining multiple packages into one optimized shipment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Package className="h-5 w-5 mr-2" />
                Start Consolidating
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
              <button className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-900 font-semibold rounded-lg transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Consolidate Your Packages?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Package consolidation is the smartest way to ship internationally and save money.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6`}>
                  <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Savings Examples */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real Savings Examples
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how much you can save with package consolidation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {savingsExamples.map((example, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">{example.scenario}</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Individual Shipping:</span>
                    <span className="font-semibold text-red-600">{example.individual}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Consolidated Shipping:</span>
                    <span className="font-semibold text-green-600">{example.consolidated}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">You Save:</span>
                      <span className="font-bold text-green-600">{example.savings}</span>
                    </div>
                    <div className="text-center mt-2">
                      <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        <TrendingDown className="h-4 w-4 mr-1" />
                        {example.percentage} savings
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Consolidation Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple process to combine your packages and save money.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-6">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <div className="absolute top-8 left-8 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Join thousands of customers who are already saving money with package consolidation.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-white text-green-600 hover:bg-gray-100 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
            <Package className="h-5 w-5 mr-2" />
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default PackageConsolidation;