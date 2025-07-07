import React from 'react';
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Package,
  Globe,
  DollarSign,
  Users
} from 'lucide-react';

const CustomsHandling: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: 'Expert Documentation',
      description: 'Our team prepares accurate customs declarations and required documentation.',
      color: 'text-blue-600'
    },
    {
      icon: Shield,
      title: 'Compliance Assurance',
      description: 'We ensure all shipments comply with international trade regulations.',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      title: 'Faster Clearance',
      description: 'Professional handling reduces delays and speeds up customs processing.',
      color: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'Dedicated Support',
      description: 'Our customs experts handle any issues that arise during clearance.',
      color: 'text-orange-600'
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Documentation Preparation',
      description: 'We prepare all required customs forms and commercial invoices.',
      icon: FileText
    },
    {
      step: 2,
      title: 'Compliance Check',
      description: 'Verify all items comply with destination country regulations.',
      icon: Shield
    },
    {
      step: 3,
      title: 'Customs Submission',
      description: 'Submit documentation to customs authorities for processing.',
      icon: Package
    },
    {
      step: 4,
      title: 'Clearance & Delivery',
      description: 'Monitor clearance process and coordinate final delivery.',
      icon: CheckCircle
    }
  ];

  const commonIssues = [
    {
      issue: 'Incorrect Valuation',
      solution: 'We provide accurate product valuations based on purchase receipts and market prices.',
      icon: DollarSign
    },
    {
      issue: 'Missing Documentation',
      solution: 'Our team ensures all required documents are complete and properly formatted.',
      icon: FileText
    },
    {
      issue: 'Product Classification',
      solution: 'Expert classification using correct HS codes for each product category.',
      icon: Package
    },
    {
      issue: 'Regulatory Compliance',
      solution: 'We stay updated on changing regulations and ensure full compliance.',
      icon: Shield
    }
  ];

  const tips = [
    {
      title: 'Accurate Product Descriptions',
      description: 'Provide detailed, honest descriptions of all items in your shipment.',
      icon: FileText
    },
    {
      title: 'Keep Original Receipts',
      description: 'Always keep purchase receipts as proof of value for customs declaration.',
      icon: DollarSign
    },
    {
      title: 'Know Duty Rates',
      description: 'Research duty rates for your destination country to avoid surprises.',
      icon: Globe
    },
    {
      title: 'Respond Quickly',
      description: 'Respond promptly to any customs requests to avoid delays.',
      icon: Clock
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Customs Handling
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Professional customs handling to ensure smooth, compliant international shipping with minimal delays.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Shield className="h-5 w-5 mr-2" />
                Get Customs Support
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
              <button className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-900 font-semibold rounded-lg transition-all duration-300">
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
              Professional Customs Handling
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our customs experts ensure your packages clear customs quickly and compliantly.
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
              Our Customs Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Systematic approach to ensure smooth customs clearance.
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

      {/* Common Issues */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Common Customs Issues We Solve
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our expertise helps avoid common pitfalls that cause delays and additional costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commonIssues.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.issue}</h3>
                    <p className="text-gray-600 mb-4">{item.solution}</p>
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Handled by our experts</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Customs Tips for Smooth Shipping
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these best practices to help ensure smooth customs clearance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <tip.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{tip.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <AlertTriangle className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Important Customs Information
              </h2>
              <div className="max-w-4xl mx-auto text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Responsibilities</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Provide accurate product information</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Keep original purchase receipts</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Pay applicable duties and taxes</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Respond to customs requests promptly</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">What We Handle</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>Customs documentation preparation</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>Regulatory compliance verification</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>Communication with customs authorities</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>Issue resolution and support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let Our Experts Handle Your Customs
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Avoid delays and complications with professional customs handling from our experienced team.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-white text-green-600 hover:bg-gray-100 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
            <Shield className="h-5 w-5 mr-2" />
            Get Customs Support
          </button>
        </div>
      </section>
    </div>
  );
};

export default CustomsHandling;