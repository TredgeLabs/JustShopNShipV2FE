import React, { useState } from 'react';
import { 
  AlertTriangle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Shield, 
  FileText, 
  Info,
  Zap,
  Droplets,
  Pill,
  Banknote,
  Flame
} from 'lucide-react';

interface ProhibitedCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  items: string[];
  reason: string;
  isExpanded: boolean;
}

const ProhibitedItems: React.FC = () => {
  const [categories, setCategories] = useState<ProhibitedCategory[]>([
    {
      id: 'electronics',
      name: 'Restricted Electronics',
      icon: Zap,
      description: 'Electronic items with batteries or potential security risks',
      reason: 'Safety regulations and customs restrictions in various countries',
      isExpanded: false,
      items: [
        'Lithium batteries (loose/uninstalled)',
        'Power banks above 20,000mAh',
        'Drones and remote-controlled aircraft',
        'Walkie-talkies and radio transmitters',
        'GPS tracking devices',
        'Laser pointers above 5mW',
        'Electronic cigarettes and vaping devices',
        'Bluetooth speakers with built-in radio',
        'Wireless surveillance cameras',
        'Signal jammers and boosters'
      ]
    },
    {
      id: 'hazardous',
      name: 'Hazardous Materials',
      icon: Flame,
      description: 'Dangerous goods that pose safety risks during transport',
      reason: 'International shipping safety regulations and airline restrictions',
      isExpanded: false,
      items: [
        'Flammable liquids (perfumes, nail polish, alcohol)',
        'Compressed gases and aerosols',
        'Corrosive substances (acids, cleaning agents)',
        'Oxidizing materials',
        'Toxic and infectious substances',
        'Radioactive materials',
        'Magnetized materials',
        'Dry ice and other coolants',
        'Fireworks and explosives',
        'Matches and lighters'
      ]
    },
    {
      id: 'liquids',
      name: 'Liquids & Perishables',
      icon: Droplets,
      description: 'Liquid items and perishable goods with shipping restrictions',
      reason: 'Leakage risks, spoilage, and customs regulations',
      isExpanded: false,
      items: [
        'Liquid medicines and syrups',
        'Essential oils and aromatherapy products',
        'Liquid cosmetics above 100ml',
        'Food items with short shelf life',
        'Fresh fruits and vegetables',
        'Dairy products and frozen items',
        'Honey and liquid food products',
        'Beverages and liquid supplements',
        'Wet wipes and liquid cleaners',
        'Liquid fertilizers and plant nutrients'
      ]
    },
    {
      id: 'medical',
      name: 'Medical & Pharmaceutical',
      icon: Pill,
      description: 'Medical devices and pharmaceutical products requiring special permits',
      reason: 'Prescription requirements and medical device regulations',
      isExpanded: false,
      items: [
        'Prescription medications',
        'Medical devices requiring certification',
        'Surgical instruments',
        'Blood pressure monitors with mercury',
        'Thermometers with mercury',
        'Insulin and refrigerated medicines',
        'Medical marijuana and CBD products',
        'Controlled substances',
        'Medical implants and prosthetics',
        'Diagnostic test kits'
      ]
    },
    {
      id: 'valuable',
      name: 'High-Value & Restricted Items',
      icon: Banknote,
      description: 'Valuable items and goods with import/export restrictions',
      reason: 'Customs duties, import restrictions, and security concerns',
      isExpanded: false,
      items: [
        'Gold, silver, and precious metals',
        'Precious stones and jewelry above $1000',
        'Currency and negotiable instruments',
        'Antiques and artifacts',
        'Religious artifacts and idols',
        'Ivory and animal products',
        'Fur and leather products from endangered species',
        'Seeds and plant materials',
        'Soil and geological specimens',
        'Cultural heritage items'
      ]
    },
    {
      id: 'weapons',
      name: 'Weapons & Security Items',
      icon: Shield,
      description: 'Weapons, security equipment, and potentially dangerous items',
      reason: 'Security regulations and weapon control laws',
      isExpanded: false,
      items: [
        'Knives and sharp objects',
        'Martial arts weapons',
        'Pepper spray and self-defense items',
        'Handcuffs and restraints',
        'Bulletproof vests and armor',
        'Military surplus items',
        'Replica weapons and toy guns',
        'Swords and decorative weapons',
        'Crossbows and archery equipment',
        'Tactical gear and equipment'
      ]
    }
  ]);

  const [termsExpanded, setTermsExpanded] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, isExpanded: !category.isExpanded }
        : category
    ));
  };

  const toggleTerms = () => {
    setTermsExpanded(!termsExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Prohibited Items</h1>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Please review this comprehensive list of items that cannot be shipped through JustShopAndShip. 
            These restrictions are in place to ensure safe, legal, and reliable international shipping.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Important Notice</h3>
              <p className="text-red-800 leading-relaxed">
                Attempting to ship prohibited items may result in package confiscation, legal consequences, 
                and permanent suspension of your JustShopAndShip account. When in doubt, please contact our 
                support team before placing your order.
              </p>
            </div>
          </div>
        </div>

        {/* Prohibited Categories */}
        <div className="space-y-4 mb-8">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <category.icon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    </div>
                  </div>
                  {category.isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </div>
              </button>

              {category.isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-200">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-800">
                        <strong>Restriction Reason:</strong> {category.reason}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="text-sm text-gray-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Additional Guidelines</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Items not listed here may still be restricted based on destination country regulations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Some items may be allowed with proper documentation and permits</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Customs authorities have the final say on item acceptance</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Contact our support team if you're unsure about any item</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={toggleTerms}
            className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Terms & Conditions</h3>
              </div>
              {termsExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              )}
            </div>
          </button>

          {termsExpanded && (
            <div className="px-6 pb-6 border-t border-gray-200">
              <div className="prose prose-sm max-w-none text-gray-700">
                <h4 className="font-semibold text-gray-900 mt-4 mb-2">1. Prohibited Items Policy</h4>
                <p>
                  JustShopAndShip reserves the right to refuse shipment of any item deemed prohibited, 
                  dangerous, or illegal. This list is not exhaustive and may be updated without prior notice.
                </p>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">2. Customer Responsibility</h4>
                <p>
                  Customers are responsible for ensuring their items comply with both Indian export laws 
                  and destination country import regulations. Ignorance of these restrictions does not 
                  exempt customers from liability.
                </p>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">3. Inspection Rights</h4>
                <p>
                  JustShopAndShip reserves the right to inspect any package and refuse shipment of 
                  prohibited items. Customers will be notified of any rejected items and may be 
                  charged for return shipping or disposal.
                </p>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">4. Legal Compliance</h4>
                <p>
                  All shipments must comply with international shipping regulations, customs laws, 
                  and destination country import restrictions. Violations may result in legal action 
                  and account suspension.
                </p>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">5. Liability Disclaimer</h4>
                <p>
                  JustShopAndShip is not liable for any losses, damages, or legal consequences 
                  resulting from attempts to ship prohibited items. Customers assume full 
                  responsibility for their shipment contents.
                </p>

                <h4 className="font-semibold text-gray-900 mt-4 mb-2">6. Updates to Policy</h4>
                <p>
                  This prohibited items list may be updated periodically to reflect changes in 
                  regulations. Customers are responsible for staying informed of current restrictions.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Clarification?</h3>
            <p className="text-gray-600 mb-4">
              If you're unsure whether an item can be shipped, please contact our support team before placing your order.
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProhibitedItems;