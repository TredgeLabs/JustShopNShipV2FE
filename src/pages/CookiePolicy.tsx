import React, { useState } from 'react';
import { Cookie, Settings, Eye, BarChart, Shield, CheckCircle, X } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false
  });

  const lastUpdated = "January 15, 2024";

  const cookieTypes = [
    {
      type: 'Necessary Cookies',
      icon: Shield,
      color: 'text-green-600',
      required: true,
      description: 'Essential for the website to function properly. These cannot be disabled.',
      examples: ['Authentication tokens', 'Security cookies', 'Load balancing', 'Session management'],
      duration: 'Session or up to 1 year'
    },
    {
      type: 'Functional Cookies',
      icon: Settings,
      color: 'text-blue-600',
      required: false,
      description: 'Enable enhanced functionality and personalization features.',
      examples: ['Language preferences', 'Region settings', 'Accessibility options', 'User interface preferences'],
      duration: 'Up to 2 years'
    },
    {
      type: 'Analytics Cookies',
      icon: BarChart,
      color: 'text-purple-600',
      required: false,
      description: 'Help us understand how visitors interact with our website.',
      examples: ['Google Analytics', 'Page views', 'User behavior', 'Performance metrics'],
      duration: 'Up to 2 years'
    },
    {
      type: 'Marketing Cookies',
      icon: Eye,
      color: 'text-orange-600',
      required: false,
      description: 'Used to track visitors and display relevant advertisements.',
      examples: ['Ad targeting', 'Social media pixels', 'Retargeting', 'Campaign tracking'],
      duration: 'Up to 1 year'
    }
  ];

  const handleCookieToggle = (type: string) => {
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev]
    }));
  };

  const savePreferences = () => {
    // In a real implementation, this would save preferences to localStorage or send to server
    console.log('Cookie preferences saved:', cookiePreferences);
    alert('Cookie preferences saved successfully!');
  };

  const acceptAll = () => {
    setCookiePreferences({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    });
  };

  const rejectAll = () => {
    setCookiePreferences({
      necessary: true, // Necessary cookies cannot be disabled
      functional: false,
      analytics: false,
      marketing: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Cookie className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Cookie Policy</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about how we use cookies and similar technologies to improve your experience on our website.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: {lastUpdated}</p>
        </div>

        {/* Cookie Preferences Panel */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Settings className="h-6 w-6 mr-2 text-blue-600" />
            Cookie Preferences
          </h2>
          
          <div className="space-y-6">
            {cookieTypes.map((cookie, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <cookie.icon className={`h-6 w-6 ${cookie.color}`} />
                    <h3 className="text-lg font-semibold text-gray-900">{cookie.type}</h3>
                    {cookie.required && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cookiePreferences[cookie.type.toLowerCase().split(' ')[0] as keyof typeof cookiePreferences]}
                        onChange={() => !cookie.required && handleCookieToggle(cookie.type.toLowerCase().split(' ')[0])}
                        disabled={cookie.required}
                        className="sr-only peer"
                      />
                      <div className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${cookie.required ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                    </label>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{cookie.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Examples:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {cookie.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Duration:</h4>
                    <p className="text-sm text-gray-600">{cookie.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={acceptAll}
              className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Accept All Cookies
            </button>
            <button
              onClick={rejectAll}
              className="flex-1 py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              Reject Optional Cookies
            </button>
            <button
              onClick={savePreferences}
              className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            
            {/* What Are Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
              <p className="text-gray-700 leading-relaxed">
                Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. Cookies help us remember your preferences, understand how you use our site, and improve your overall experience.
              </p>
            </section>

            {/* How We Use Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
              <p className="text-gray-700 mb-4">We use cookies for several purposes:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Essential Operations:</strong> To provide core functionality like user authentication and security</li>
                <li><strong>Performance:</strong> To analyze how our website is used and identify areas for improvement</li>
                <li><strong>Functionality:</strong> To remember your preferences and provide personalized features</li>
                <li><strong>Marketing:</strong> To show you relevant advertisements and measure campaign effectiveness</li>
              </ul>
            </section>

            {/* Third-Party Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-700 mb-4">
                We may also use third-party cookies from trusted partners to enhance our services:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
                  <p className="text-sm text-gray-600">Helps us understand website usage and improve user experience.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Payment Processors</h4>
                  <p className="text-sm text-gray-600">Secure payment processing and fraud prevention.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Customer Support</h4>
                  <p className="text-sm text-gray-600">Live chat functionality and support ticket management.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Social Media</h4>
                  <p className="text-sm text-gray-600">Social sharing buttons and embedded content.</p>
                </div>
              </div>
            </section>

            {/* Managing Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
              <p className="text-gray-700 mb-4">
                You have several options for managing cookies:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>Use our cookie preference center above to customize your settings</li>
                <li>Configure your browser settings to block or delete cookies</li>
                <li>Use browser extensions that manage cookie preferences</li>
                <li>Opt out of specific third-party services directly</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Browser Settings</h3>
              <p className="text-gray-700 mb-4">
                Most browsers allow you to control cookies through their settings. Here's how to access cookie settings in popular browsers:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
              </ul>
            </section>

            {/* Impact of Disabling Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Impact of Disabling Cookies</h2>
              <p className="text-gray-700 mb-4">
                Disabling certain cookies may affect your experience on our website:
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <ul className="space-y-2 text-yellow-800">
                  <li className="flex items-start space-x-2">
                    <X className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>You may need to re-enter information more frequently</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <X className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>Some features may not work properly or be unavailable</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <X className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>Personalized content and recommendations may be less relevant</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <X className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>We may not be able to remember your preferences</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Updates to Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-700">
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Email:</strong> privacy@justshopandship.com</li>
                  <li><strong>Phone:</strong> +91 9876543210</li>
                  <li><strong>Address:</strong> Plot No. 45, Sector 18, Gurgaon, Haryana 122001, India</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;