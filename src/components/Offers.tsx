import React from 'react';
import { Gift, Users, Percent, Clock } from 'lucide-react';

const offers = [
  {
    icon: Gift,
    title: "Welcome Bonus",
    description: "Get ₹500 off on your first order above ₹2000",
    code: "WELCOME500",
    color: "bg-green-100 text-green-600",
    bgColor: "bg-green-50"
  },
  {
    icon: Users,
    title: "Refer & Earn",
    description: "Refer friends and earn ₹200 for each successful referral",
    code: "REFER200",
    color: "bg-blue-100 text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: Percent,
    title: "Bulk Discount",
    description: "Save extra 15% when you consolidate 5+ orders",
    code: "BULK15",
    color: "bg-purple-100 text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    icon: Clock,
    title: "Flash Sale",
    description: "48-hour special: Free shipping on orders above ₹1500",
    code: "FLASH48",
    color: "bg-orange-100 text-orange-600",
    bgColor: "bg-orange-50"
  }
];

const Offers: React.FC = () => {
  return (
    <section className="py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Current Offers & Promotions
        </h2>
        <p className="text-xl text-gray-600">
          Save more with our exclusive deals and referral bonuses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {offers.map((offer, index) => (
          <div key={index} className={`${offer.bgColor} rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2`}>
            <div className={`inline-flex items-center justify-center w-12 h-12 ${offer.color} rounded-lg mb-4`}>
              <offer.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{offer.title}</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{offer.description}</p>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-3 py-1 bg-white rounded-full text-xs font-mono font-medium text-gray-700 border">
                {offer.code}
              </span>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                Use Code →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center space-x-2 bg-yellow-100 px-6 py-3 rounded-full">
          <Gift className="h-5 w-5 text-yellow-600" />
          <span className="text-yellow-800 font-medium">Limited time offers - Act fast!</span>
        </div>
      </div>
    </section>
  );
};

export default Offers;