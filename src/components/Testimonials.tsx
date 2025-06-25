import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Toronto, Canada",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    rating: 5,
    text: "JustShopAndShip has been a game-changer for me! I can finally buy from my favorite Indian brands and get them delivered to Canada at a fraction of the cost. The service is reliable and the team is always helpful."
  },
  {
    name: "Raj Patel",
    location: "London, UK",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    rating: 5,
    text: "I've been using this service for over a year now. The consolidation feature has saved me hundreds of dollars in shipping costs. My packages always arrive on time and in perfect condition."
  },
  {
    name: "Sneha Reddy",
    location: "Sydney, Australia",
    avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    rating: 5,
    text: "The personal shopper service is amazing! They helped me find the exact sarees I wanted and even negotiated better prices. Customer service is top-notch and they really care about their customers."
  },
  {
    name: "Amit Kumar",
    location: "New York, USA",
    avatar: "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    rating: 5,
    text: "Fast, reliable, and cost-effective. I've ordered everything from electronics to traditional clothing, and everything has arrived perfectly. The tracking system keeps me informed every step of the way."
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust us with their international shopping needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <span className="text-gray-500 text-sm">•</span>
                    <span className="text-gray-500 text-sm">{testimonial.location}</span>
                  </div>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-200" />
                <p className="text-gray-600 leading-relaxed pl-6">{testimonial.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-yellow-50 px-6 py-3 rounded-full">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-gray-700 font-medium">4.9/5 average rating from 2,500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;