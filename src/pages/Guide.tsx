import React, { useState } from 'react';
import {
  Map,
  CheckCircle,
  ArrowRight,
  User,
  ShoppingCart,
  Package,
  Plane,
  CreditCard,
  AlertCircle,
  Info,
  Play,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userService from '../api/services/userService';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  details: string[];
  tips: string[];
  isExpanded: boolean;
}

const Guide: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = userService.isAuthenticated();
  const [steps, setSteps] = useState<GuideStep[]>([
    {
      id: 'step-1',
      title: 'Create Your Account',
      description: 'Sign up and get your personal vault address in India',
      icon: User,
      isExpanded: false,
      details: [
        'Visit justshopandship.com and click "Sign Up"',
        'Fill in your personal information (name, email, phone, country)',
        'Verify your email address by clicking the confirmation link',
        'Complete your profile with shipping address details',
        'Receive your unique vault address in India'
      ],
      tips: [
        'Use a strong password for account security',
        'Double-check your shipping address for accuracy',
        'Save your vault address in your browser bookmarks',
        'Add our email to your contacts to avoid spam filtering'
      ]
    },
    {
      id: 'step-2',
      title: 'Start Shopping Online',
      description: 'Use your vault address to shop from Indian e-commerce sites',
      icon: ShoppingCart,
      isExpanded: false,
      details: [
        'Visit your favorite Indian online stores (Amazon.in, Flipkart, Myntra, etc.)',
        'Browse and add items to your cart as usual',
        'At checkout, use your JustShopAndShip vault address',
        'Enter your vault ID in the name field for easy identification',
        'Complete the purchase using your preferred payment method'
      ],
      tips: [
        'Always use your exact vault address as provided',
        'Include your vault ID in the recipient name',
        'Keep order confirmation emails for reference',
        'Check seller ratings and reviews before purchasing',
        'Consider buying from multiple stores to maximize consolidation'
      ]
    },
    {
      id: 'step-3',
      title: 'Track Your Packages',
      description: 'Monitor packages arriving at your vault through our dashboard',
      icon: Package,
      isExpanded: false,
      details: [
        'Log into your JustShopAndShip dashboard',
        'Add order details manually or upload receipts',
        'Track domestic shipping to your vault',
        'Receive notifications when packages arrive',
        'View package details, weight, and photos'
      ],
      tips: [
        'Add order details as soon as you place them',
        'Upload order confirmations for better tracking',
        'Set up email/SMS notifications for updates',
        'Check package condition reports upon arrival',
        'Contact support if packages are delayed'
      ]
    },
    {
      id: 'step-4',
      title: 'Consolidate & Ship',
      description: 'Combine packages and ship internationally to save money',
      icon: Plane,
      isExpanded: false,
      details: [
        'Select packages you want to ship together',
        'Use our shipping calculator to estimate costs',
        'Choose your preferred shipping service (Express, Standard, Economy)',
        'Review and confirm shipping details',
        'Make payment for international shipping'
      ],
      tips: [
        'Wait to accumulate 3-5 packages for maximum savings',
        'Consider package weight vs. dimensional weight',
        'Choose faster shipping for urgent items',
        'Review prohibited items list before shipping',
        'Add insurance for valuable items'
      ]
    },
    {
      id: 'step-5',
      title: 'Receive Your Package',
      description: 'Track international shipment and receive at your doorstep',
      icon: CheckCircle,
      isExpanded: false,
      details: [
        'Receive tracking information via email',
        'Monitor shipment progress through carrier website',
        'Prepare for customs clearance if required',
        'Be available for delivery or arrange pickup',
        'Inspect package contents upon delivery'
      ],
      tips: [
        'Track your shipment regularly for updates',
        'Respond quickly to any customs requests',
        'Have identification ready for delivery',
        'Check package contents immediately',
        'Report any issues within 48 hours'
      ]
    }
  ]);

  const toggleStep = (stepId: string) => {
    setSteps(prev => prev.map(step =>
      step.id === stepId
        ? { ...step, isExpanded: !step.isExpanded }
        : step
    ));
  };

  const expandAll = () => {
    setSteps(prev => prev.map(step => ({ ...step, isExpanded: true })));
  };

  const collapseAll = () => {
    setSteps(prev => prev.map(step => ({ ...step, isExpanded: false })));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Map className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Your Complete Guide</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow this step-by-step guide to master international shopping with JustShopAndShip.
            From account creation to receiving your packages, we'll walk you through everything.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={expandAll}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ChevronDown className="h-4 w-4" />
            <span>Expand All</span>
          </button>
          <button
            onClick={collapseAll}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <ChevronUp className="h-4 w-4" />
            <span>Collapse All</span>
          </button>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Journey Overview</h2>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mb-2">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-gray-600 text-center max-w-16">
                    Step {index + 1}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Step {index + 1}: {step.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{step.description}</p>
                    </div>
                  </div>
                  {step.isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </div>
              </button>

              {step.isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Detailed Instructions */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Play className="h-4 w-4 mr-2 text-blue-600" />
                        Detailed Instructions
                      </h4>
                      <ol className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start space-x-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                              {detailIndex + 1}
                            </span>
                            <span className="text-gray-700 text-sm">{detail}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Pro Tips */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Info className="h-4 w-4 mr-2 text-green-600" />
                        Pro Tips
                      </h4>
                      <ul className="space-y-2">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Notes</h3>
              <ul className="space-y-2 text-yellow-800">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Always use your exact vault address as provided - any changes may result in delivery issues</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Check our prohibited items list before making purchases to avoid shipping restrictions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Customs duties and taxes are the responsibility of the recipient and vary by country</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Free storage is provided for 90 days - plan your consolidation accordingly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Getting Started CTA */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied customers who are already saving money on international shipping.
            Create your account today and get your personal vault address in minutes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-colors"
              onClick={() => isLoggedIn ? navigate('/dashboard') : navigate('/signup')}
            >
              <User className="h-5 w-5 mr-2" />
              {isLoggedIn ? 'Get Started' : 'Create Account'}
            </button>
            <button
              className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold rounded-lg transition-colors"
              onClick={() => navigate('/shipping-calculator')}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Calculate Shipping
            </button>
          </div>
        </div>

        {/* Need Help */}
        <div className="mt-8 text-center">
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Additional Help?</h3>
            <p className="text-gray-600 mb-4">
              Our support team is here to help you every step of the way. Don't hesitate to reach out!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {/* <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Live Chat Support
              </button> */}
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg border border-gray-300 transition-colors">
                Email Support
              </button>
              <button
                className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-colors"
                onClick={()=> navigate('/faq')}
              >
                View FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guide;