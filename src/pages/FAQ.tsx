import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Package, 
  Truck, 
  DollarSign, 
  Shield, 
  Clock,
  MessageCircle
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  isExpanded: boolean;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
}

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: 'general-1',
      question: 'What is JustShopAndShip and how does it work?',
      answer: 'JustShopAndShip is a package forwarding service that allows you to shop from Indian online stores and ship internationally. We provide you with a personal vault address in India where your purchases are delivered, consolidated, and then shipped to your international address.',
      category: 'general',
      isExpanded: false
    },
    {
      id: 'general-2',
      question: 'Which countries do you ship to?',
      answer: 'We ship to over 50 countries worldwide including USA, Canada, UK, Australia, Germany, UAE, Singapore, and many more. Check our shipping calculator for specific country availability and rates.',
      category: 'general',
      isExpanded: false
    },
    {
      id: 'general-3',
      question: 'How do I get started with JustShopAndShip?',
      answer: 'Simply sign up for an account, and you\'ll receive your personal vault address in India. Use this address when shopping online, and we\'ll handle the rest - from receiving your packages to consolidating and shipping them internationally.',
      category: 'general',
      isExpanded: false
    },
    {
      id: 'shipping-1',
      question: 'How long does international shipping take?',
      answer: 'Shipping times vary by destination and service level. Express shipping typically takes 3-7 business days, while standard shipping takes 7-15 business days. Processing time at our facility is usually 1-2 business days.',
      category: 'shipping',
      isExpanded: false
    },
    {
      id: 'shipping-2',
      question: 'Can I consolidate multiple orders into one shipment?',
      answer: 'Yes! This is one of our key features. You can consolidate multiple orders to save significantly on shipping costs. Items are stored free for 90 days, giving you time to accumulate multiple purchases.',
      category: 'shipping',
      isExpanded: false
    },
    {
      id: 'shipping-3',
      question: 'What shipping carriers do you use?',
      answer: 'We partner with leading international carriers including DHL, FedEx, UPS, and India Post. The carrier is selected based on your destination, package size, and chosen service level.',
      category: 'shipping',
      isExpanded: false
    },
    {
      id: 'shipping-4',
      question: 'Do you provide tracking information?',
      answer: 'Yes, you\'ll receive tracking information once your package is shipped. You can track your shipment through our dashboard or directly on the carrier\'s website.',
      category: 'shipping',
      isExpanded: false
    },
    {
      id: 'costs-1',
      question: 'How are shipping costs calculated?',
      answer: 'Shipping costs are calculated based on package weight, dimensions, destination, and service level. We use dimensional weight pricing, so both actual weight and package size affect the cost.',
      category: 'costs',
      isExpanded: false
    },
    {
      id: 'costs-2',
      question: 'Are there any hidden fees?',
      answer: 'No hidden fees! Our pricing is transparent. You pay for shipping, any applicable customs duties, and our service fee. All costs are clearly displayed before you confirm your shipment.',
      category: 'costs',
      isExpanded: false
    },
    {
      id: 'costs-3',
      question: 'How much can I save by consolidating packages?',
      answer: 'Consolidation can save you 50-70% on shipping costs compared to shipping items individually. The more items you consolidate, the greater your savings.',
      category: 'costs',
      isExpanded: false
    },
    {
      id: 'costs-4',
      question: 'Who pays for customs duties and taxes?',
      answer: 'Customs duties and taxes are the responsibility of the recipient (you). These are determined by your country\'s customs authorities and vary by product type and value.',
      category: 'costs',
      isExpanded: false
    },
    {
      id: 'security-1',
      question: 'Is my package safe and insured?',
      answer: 'Yes, all packages are fully insured during transit. We also provide secure storage at our facility with 24/7 monitoring and climate control for sensitive items.',
      category: 'security',
      isExpanded: false
    },
    {
      id: 'security-2',
      question: 'What happens if my package is lost or damaged?',
      answer: 'All shipments are insured. In the rare event of loss or damage, we\'ll work with the carrier to file a claim and ensure you\'re compensated according to the insurance terms.',
      category: 'security',
      isExpanded: false
    },
    {
      id: 'security-3',
      question: 'Can I return items to the original seller?',
      answer: 'Yes, we offer return services for eligible items. Contact our support team to initiate a return, and we\'ll coordinate with the original seller on your behalf.',
      category: 'security',
      isExpanded: false
    },
    {
      id: 'account-1',
      question: 'How long are items stored in my vault?',
      answer: 'Items are stored free for 90 days from the date of receipt. After 90 days, a small storage fee applies. This gives you plenty of time to consolidate multiple purchases.',
      category: 'account',
      isExpanded: false
    },
    {
      id: 'account-2',
      question: 'Can I modify my vault address?',
      answer: 'Your vault address is permanent and cannot be changed. However, you can update your personal information and international shipping address anytime through your account dashboard.',
      category: 'account',
      isExpanded: false
    },
    {
      id: 'account-3',
      question: 'What if I enter the wrong vault address when ordering?',
      answer: 'Contact us immediately if you use an incorrect address. We may be able to redirect the package, but this depends on the seller and shipping status. Always double-check your vault address before placing orders.',
      category: 'account',
      isExpanded: false
    }
  ]);

  const categories: FAQCategory[] = [
    { id: 'all', name: 'All Categories', icon: HelpCircle, color: 'text-gray-600' },
    { id: 'general', name: 'General', icon: Package, color: 'text-blue-600' },
    { id: 'shipping', name: 'Shipping', icon: Truck, color: 'text-green-600' },
    { id: 'costs', name: 'Costs & Pricing', icon: DollarSign, color: 'text-orange-600' },
    { id: 'security', name: 'Security & Insurance', icon: Shield, color: 'text-purple-600' },
    { id: 'account', name: 'Account & Vault', icon: Clock, color: 'text-red-600' }
  ];

  const toggleFAQ = (faqId: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === faqId 
        ? { ...faq, isExpanded: !faq.isExpanded }
        : faq
    ));
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about JustShopAndShip services, shipping, pricing, and more.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search for answers..."
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <category.icon className={`h-4 w-4 ${
                  selectedCategory === category.id ? 'text-white' : category.color
                }`} />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 pr-4">{faq.question}</h3>
                  {faq.isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
                  )}
                </div>
              </button>

              {faq.isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed pt-4">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
            <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-center">
            <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Still have questions?</h3>
            <p className="text-blue-800 mb-4">
              Can't find what you're looking for? Our support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                <MessageCircle className="h-4 w-4 mr-2" />
                Live Chat
              </button>
              <button className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 font-medium rounded-lg border border-blue-200 transition-colors">
                Email Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;